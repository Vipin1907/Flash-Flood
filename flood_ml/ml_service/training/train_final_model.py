import os
import pandas as pd
import numpy as np
import xgboost
import joblib
import json
from sklearn.metrics import classification_report, average_precision_score, brier_score_loss
from sklearn.calibration import CalibratedClassifierCV

def main():
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "raw_grid", "final_training_data.csv")
    print(f"Loading data from {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except Exception as e:
        print(f"Error loading data: {e}")
        return

    feature_cols = ['rainfall_mm','rainfall_1d','rainfall_3d','rainfall_7d','rainfall_30d',
                     'soil_saturation_proxy','ndvi','slope_mean','flow_accumulation']

    print("Fix 1: Temporal Split (No random shuffling)")
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)

    # 70-30 split
    split_idx = int(len(df) * 0.7)
    train_data = df.iloc[:split_idx]
    test_data = df.iloc[split_idx:]

    X_train = train_data[feature_cols]
    y_train = train_data['flood_event']
    X_test = test_data[feature_cols]
    y_test = test_data['flood_event']

    print(f"Train size: {len(X_train)} | Positives: {y_train.sum()}")
    print(f"Test size: {len(X_test)} | Positives: {y_test.sum()}")

    print("\nTraining Base XGBoost Model...")
    pos_count = (y_train == 1).sum()
    scale_pos_weight = (y_train == 0).sum() / pos_count if pos_count > 0 else 1

    base_model = xgboost.XGBClassifier(
        n_estimators=300, max_depth=4, learning_rate=0.05,
        subsample=0.8, colsample_bytree=0.8,
        scale_pos_weight=scale_pos_weight,
        eval_metric='aucpr', random_state=42
    )
    base_model.fit(X_train, y_train)

    print("\nFix 2: Calibrating the Final Model...")
    # Using 5-fold cross validation for calibration to ensure reliable probability outputs
    calibrated_model = CalibratedClassifierCV(base_model, method='isotonic', cv=5)
    calibrated_model.fit(X_train, y_train)

    print("\nEvaluating Calibrated Model on Test Set...")
    y_pred = calibrated_model.predict(X_test)
    y_proba = calibrated_model.predict_proba(X_test)[:, 1]

    print(classification_report(y_test, y_pred))
    print(f"PR-AUC (calibrated): {average_precision_score(y_test, y_proba):.4f}")
    print(f"Brier score (calibrated): {brier_score_loss(y_test, y_proba):.4f}")

    # Save the corrected model
    model_path = r"e:\Prediction\flood_ml\data\raw\model_real_v2_fixed.pkl"
    joblib.dump(calibrated_model, model_path)
    print(f"\n✓ Corrected and Calibrated Model saved as: {model_path}")

    # Save feature names
    features_path = r"e:\Prediction\flood_ml\data\raw\model_v2_features.json"
    with open(features_path, "w") as f:
        json.dump(feature_cols, f)
    print(f"✓ Feature-list saved as: {features_path}")

if __name__ == "__main__":
    main()

import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://localhost:8001",
  nodeEnv: process.env.NODE_ENV || "development",
};

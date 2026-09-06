import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import healthCheckRouter from "./routes/healthcheck.routes.js";
import predictRouter from "./routes/predict.routes.js";
import routesRouter from "./routes/routes.routes.js";
import alertRouter from "./routes/alert.routes.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

const corsOriginConfig =
  !config.corsOrigin || config.corsOrigin === "*"
    ? true
    : config.corsOrigin.includes(",")
    ? config.corsOrigin.split(",").map((s) => s.trim())
    : config.corsOrigin;

app.use(
  cors({
    origin: corsOriginConfig,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/predict", predictRouter);
app.use("/api/v1/routes", routesRouter);
app.use("/api/v1/alerts", alertRouter);

app.get("/", (req, res) => {
  res.send("DEIP-192 Flash Flood Backend is running");
});

// error handler sabse last mein
app.use(errorHandler);

export default app;

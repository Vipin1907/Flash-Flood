import { config } from "./config/env.js";
import app from "./app.js";

app.listen(config.port, () => {
  console.log(`DEIP-192 Backend is running on http://localhost:${config.port}`);
  console.log(`ML Service expected at: ${config.mlServiceUrl}`);
});

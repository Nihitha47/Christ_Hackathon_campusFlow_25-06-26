import { createApp } from "./core/app";
import { getEnv } from "./core/env";
import { log } from "./core/logger";

const env = getEnv();
const app = createApp();
const port = env.PORT ?? env.API_PORT;

app.listen(port, () => {
  log("info", "campusflow api started", { port, nodeEnv: env.NODE_ENV });
});
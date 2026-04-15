import { createServer } from "http";

import { createApp } from "./app";
import { env } from "./config/env";
import { createSocketServer } from "./realtime/socket";

async function start() {
  const { app } = await createApp();
  const httpServer = createServer(app);
  createSocketServer(httpServer);

  httpServer.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});

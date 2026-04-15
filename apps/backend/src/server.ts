import { createServer } from "http";

import { createApp } from "./app";
import { env } from "./config/env";
import { createSocketServer } from "./realtime/socket";

const app = createApp();
const httpServer = createServer(app);
createSocketServer(httpServer);

httpServer.listen(env.port, () => {
  console.log(`Backend listening on http://localhost:${env.port}`);
});

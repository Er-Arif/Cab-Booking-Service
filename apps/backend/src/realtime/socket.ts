import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import { env } from "config/env";

export function createSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.adminWebOrigin,
    },
  });

  io.on("connection", (socket) => {
    socket.on("ride:join", (rideId: string) => {
      socket.join(`ride:${rideId}`);
    });

    socket.on(
      "driver:location",
      (payload: { rideId: string; driverId: string; latitude: number; longitude: number }) => {
        io.to(`ride:${payload.rideId}`).emit("ride.location.updated", {
          rideId: payload.rideId,
          driverId: payload.driverId,
          location: {
            latitude: payload.latitude,
            longitude: payload.longitude,
          },
        });
      }
    );
  });

  return io;
}

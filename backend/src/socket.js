import { Server } from "socket.io";

export const initSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    socket.on("subscribe:matatu:all", () => {
      socket.join("matatu:all");
    });

    socket.onAny((event) => {
      if (event.startsWith("subscribe:matatu:") && event !== "subscribe:matatu:all") {
        const parts = event.split(":");
        const id = parts[2];
        if (id) {
          socket.join(`matatu:${id}`);
        }
      }
    });
  });

  return io;
};

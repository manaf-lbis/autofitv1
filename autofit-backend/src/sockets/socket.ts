import { Socket, Server } from "socket.io";
import http from "http";
import { notificationHandler } from "./socketHandlers/notificationHandler";
import { roadsideChatHandler } from "./socketHandlers/roadsideChatHandler";
import { socketAuthMiddleware } from "./middlewares/socketAuthMiddleware";
import { liveLocationHandler } from "./socketHandlers/liveLocationHandler";


export const userSocketMap = new Map<string, { role: string; name: string; socketIds: Set<string> }>();

let io: Server;

export const initSocket = (server: http.Server): Server => {

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN!,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", async (socket: Socket) => {
  console.log("connected");

  try {
    const { id: userId, role: userRole, name } = await socketAuthMiddleware(socket);
    console.log(name);
    

    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, { role: userRole, name, socketIds: new Set() });
    }

    userSocketMap.get(userId)!.socketIds.add(socket.id);

    socket.on("disconnect", () => {
      console.log("disconnected");
      const userData = userSocketMap.get(userId);
      if (userData) {
        userData.socketIds.delete(socket.id);
        if (userData.socketIds.size === 0) {
          userSocketMap.delete(userId);
        }
      }
    });

    socket.on("joinRoom", ({ room }) => socket.join(room));
    socket.on("leaveRoom", ({ room }) => socket.leave(room));


    notificationHandler(socket);
    roadsideChatHandler(socket);
    liveLocationHandler(socket);

  } catch (err: any) {
    console.error("Socket Auth Error:", err.message);

    socket.emit("unauthorized", { message: "Unauthorized: Invalid or expired token" });
    socket.disconnect();
  }
});


  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};
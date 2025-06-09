import { Socket, Server } from "socket.io";
import http from "http";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import { notificationHandler } from "./notificationHandler";
import { forceLogoutHandler } from "./ForceLogoutHandler";


export const userSocketMap = new Map<
  string,
  { role: string; socketIds: Set<string> }
>();

let io: Server;

export const initSocket = (server: http.Server): Server => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("conected");

    const stringCookie = socket.handshake.headers?.cookie;
    if (!stringCookie) {
      socket.disconnect();
      return;
    }

    let parsedCookies;
    try {
      parsedCookies = cookie.parse(stringCookie);
    } catch (err) {
      socket.disconnect();
      return;
    }

    const token = parsedCookies.jwt;
    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
      };

      const userId = decoded.id;
      const userRole = decoded.role;

      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, { role: userRole, socketIds: new Set() });
      }
      userSocketMap.get(userId)!.socketIds.add(socket.id);


      socket.on("disconnect", () => {
        console.log('disconnected');
        
        const userData = userSocketMap.get(userId);
        if (userData) {
          userData.socketIds.delete(socket.id);
          if (userData.socketIds.size === 0) {
            userSocketMap.delete(userId);
          }
        }
      });

      
      notificationHandler(socket);
      forceLogoutHandler(socket);


    } catch (err) {
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
import { Socket } from "socket.io";
import { ChatService } from "../../services/chat/chatService";
import { ChatRepository } from "../../repositories/chatRepository";
import { verifyJwt } from "../verifyJwt";
import { RoadsideAssistanceModel } from "../../models/roadsideAssistanceModel";
import { ApiError } from "../../utils/apiError";
import { getIO, userSocketMap } from "../socket"; // Import userSocketMap
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { Role } from "../../types/role";

export const roadsideChatHandler = (socket: Socket) => {
  const chatRepository = new ChatRepository();
  const roadsideAssistanceRepo = new RoadsideAssistanceRepository();
  const chatService = new ChatService(chatRepository, roadsideAssistanceRepo);

  socket.on("markAsSeen", async (data) => {
    try {
      const { serviceId } = data;
      const { id: userId } = verifyJwt(socket);
      await chatService.markAsSeen(serviceId, userId);

      const room = `roadside_${serviceId}`;
      getIO().to(room).emit("seen", { serviceId });
    } catch  {
      socket.emit("error", { message: "Failed to mark as seen" });
    }
  });

  socket.on("roadsideChat", async (data) => {
    try {
      const { serviceId, message } = data;
      const { id: senderId, role: senderRole } = verifyJwt(socket);
      const serviceDoc = await RoadsideAssistanceModel.findById(serviceId).select("userId mechanicId");

      if (!serviceDoc) throw new ApiError("Service not found", 404);

      let receiverId, receiverRole;
      if (senderRole === Role.USER) {
        if (serviceDoc.userId.toString() !== senderId) throw new ApiError("Unauthorized", 403);
        receiverId = serviceDoc.mechanicId.toString();
        receiverRole = Role.MECHANIC;
      } else if (senderRole === Role.MECHANIC) {
        if (serviceDoc.mechanicId.toString() !== senderId) throw new ApiError("Unauthorized", 403);
        receiverId = serviceDoc.userId.toString();
        receiverRole = Role.USER;
      } else {
        throw new ApiError("Invalid user", 400);
      }

      // Ensure both sender and receiver are in the room
      const room = `roadside_${serviceId}`;
      const io = getIO();

      // Check and add sender's sockets to the room
      const senderSockets = userSocketMap.get(senderId)?.socketIds;
      if (senderSockets) {
        senderSockets.forEach((socketId) => {
          const socketInstance = io.sockets.sockets.get(socketId);
          if (socketInstance && !socketInstance.rooms.has(room)) {
            socketInstance.join(room);
          }
        });
      }

      // Check and add receiver's sockets to the room
      const receiverSockets = userSocketMap.get(receiverId)?.socketIds;
      if (receiverSockets) {
        receiverSockets.forEach((socketId) => {
          const socketInstance = io.sockets.sockets.get(socketId);
          if (socketInstance && !socketInstance.rooms.has(room)) {
            socketInstance.join(room);
          }
        });
      }

      const savedMsg = await chatService.saveMessage(
        serviceId,
        "roadsideAssistance",
        senderId,
        senderRole,
        receiverId,
        receiverRole as Role.USER | Role.MECHANIC,
        message
      );

      // Emit the message to the room
      io.to(room).emit("roadsideMessage", {
        _id: savedMsg._id,
        serviceId,
        message,
        senderId,
        receiverRole,
        senderName: (savedMsg.senderId as any).name,
        senderRole,
        servicetype: savedMsg.serviceType,
        seen: savedMsg.seen,
        createdAt: savedMsg.createdAt,
      });
    } catch {
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};


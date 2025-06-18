import { Socket } from "socket.io";
import { ChatService } from "../services/chatService";
import { ChatRepository } from "../repositories/chatRepository";
import { userSocketMap } from "./socket";

export const chatHandler = (socket: Socket) => {
  const chatRepository = new ChatRepository();
  const chatService = new ChatService(chatRepository);

  socket.on("sendMessage", async (data) => {
    const { serviceId, serviceType, senderId, senderRole, receiverId, receiverRole, message } = data;
    try {
      const chat = await chatService.sendMessage(serviceId, serviceType, senderId, senderRole, receiverId, receiverRole, message);

      const io = socket;
      const receiverData = userSocketMap.get(receiverId);
      if (receiverData && receiverData.socketIds.size > 0) {
        io.to([...receiverData.socketIds]).emit("newMessage", {
          id: chat._id.toString(),
          serviceId: chat.serviceId.toString(),
          serviceType: chat.serviceType,
          senderId: chat.senderId.toString(),
          senderRole: chat.senderRole,
          receiverId: chat.receiverId.toString(),
          receiverRole: chat.receiverRole,
          message: chat.message,
          seen: chat.seen,
          createdAt: chat.createdAt.toISOString(),
          updatedAt: chat.updatedAt.toISOString(),
        });
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};
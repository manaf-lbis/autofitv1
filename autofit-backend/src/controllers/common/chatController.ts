import { Request, Response, NextFunction } from "express";
import { ChatService } from "../../services/chatService";
import { ApiError } from "../../utils/apiError";
import { userSocketMap,getIO } from "../../sockets/socket"; 
import { sendSuccess } from "../../utils/apiResponse";

export class ChatController {
  constructor(private chatService: ChatService) {}

  async getChatsForService(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, serviceType } = req.params;
      const userId = req.user?.id
      if(!userId) throw new ApiError('Invalid User id')
      const chats = await this.chatService.getChatsForService(serviceId, serviceType, userId.toString());
      sendSuccess(res, "Chats fetched successfully", chats);
    } catch (error) {
      next(error);
    }
  }

  async getChatsForMechanic(req: Request, res: Response, next: NextFunction) {
    try {
      const mechanicId = req.user?.id
      if(!mechanicId) throw new ApiError('Invalid User id');

      const chats = await this.chatService.getChatsForMechanic(mechanicId.toString());
      sendSuccess(res, "Mechanic chats fetched successfully", chats);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, serviceType, receiverId, receiverRole, message } = req.body;
      const senderId = req.user?.id
      const senderRole = req.user?.role as "user" | "mechanic";

      if(!senderId) throw new ApiError('Invalid User id');

      const chat = await this.chatService.sendMessage(
        serviceId,
        serviceType,
        senderId.toString(),
        senderRole,
        receiverId,
        receiverRole,
        message
      );

      const io = getIO();
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
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        });
      }

      sendSuccess(res, "Message sent successfully", chat);
    } catch (error) {
      next(error);
    }
  }

  async markMessageAsSeen(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params;
      const userId = req.user?.id
      if(!userId) throw new ApiError('Invalid User id')

      const updatedChat = await this.chatService.markMessageAsSeen(chatId, userId.toString());
      sendSuccess(res, "Message marked as seen", updatedChat);
    } catch (error) {
      next(error);
    }
  }
}
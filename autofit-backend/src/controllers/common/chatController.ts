import { Request, Response, NextFunction } from "express";
import { ChatService } from "../../services/chatService";
import { ApiError } from "../../utils/apiError";
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

  
}
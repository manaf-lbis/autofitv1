import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { sendSuccess } from "../../utils/apiResponse";
import { IChatService } from "../../services/chat/IChatService";

export class ChatController {
  constructor(
    private _chatService: IChatService
  ) { }

  async getChatsForService(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, serviceType } = req.params;
      const userId = req.user?.id
      if (!userId) throw new ApiError('Invalid User id')

      const chats = await this._chatService.getChatsForService(serviceId, serviceType, userId.toString());

      sendSuccess(res, "Chats fetched successfully", chats);
    } catch (error) {
      next(error);
    }
  }

  async getChatsForMechanic(req: Request, res: Response, next: NextFunction) {
    try {
      const mechanicId = req.user?.id
      if (!mechanicId) throw new ApiError('Invalid User id');

      const chats = await this._chatService.getChatsForMechanic(mechanicId.toString());
      sendSuccess(res, "Mechanic chats fetched successfully", chats);
    } catch (error) {
      next(error);
    }
  }


  async avilableRoomId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id

      if(!userId) throw new ApiError('Invalid user')

      const response = await this._chatService.avilableRooms(userId)
        

      sendSuccess(res, "Mechanic chats fetched successfully",response);
    } catch (error) {
      next(error);
    }
  }


}
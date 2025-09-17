import { IChatRepository } from "../../repositories/interfaces/IChatRepository";
import { ChatDocument } from "../../models/chatModel";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IChatService } from "./IChatService";
import { HttpStatus } from "../../types/responseCode";
import { Role } from "../../types/role";

export class ChatService implements IChatService {

  constructor(
    private _chatRepository: IChatRepository,
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo
  ) { }

  async getChatsForService(serviceId: string, serviceType: string, userId: string): Promise<ChatDocument[]> {
    if (!serviceId || !serviceType || !userId) throw new ApiError("Service ID, Service Type, and User ID are required", HttpStatus.BAD_REQUEST);
    return await this._chatRepository.getChatsForService(serviceId, serviceType, userId);
  }


  async getChatsForMechanic(mechanicId: string): Promise<any> {
    if (!mechanicId) throw new ApiError("Mechanic ID is required", HttpStatus.BAD_REQUEST);

    const chats = await this._chatRepository.getChatsForMechanic(mechanicId);
    const serviceIds = chats.map((chat: any) => chat.messages[0].serviceId)
    const services = await this._roadsideAssistanceRepo.checkIsCompleted(serviceIds);


    const serviceMap = services.reduce((acc: any, service: any) => {
      const status = service.status?.toLowerCase();
      acc[service._id.toString()] = status === "completed" || status === "canceled";
      return acc;
    }, {});

    const enrichedChats = chats.map((chat: any) => {
      const serviceId = chat.messages?.[0]?.serviceId;
      return {
        ...chat,
        isCompleted: serviceMap[serviceId?.toString()] ?? false
      };
    });


    return enrichedChats
  }

  async saveMessage(serviceId: string, serviceType: string, senderId: string, senderRole: Role.USER | Role.MECHANIC, receiverId: string, receiverRole: Role.USER | Role.MECHANIC, message: string): Promise<ChatDocument> {

    if (!serviceId || !serviceType || !senderId || !receiverId || !message) {
      throw new ApiError("All message fields are required", HttpStatus.BAD_REQUEST);
    }
    const res = await this._chatRepository.sendMessage(serviceId, serviceType, senderId, senderRole, receiverId, receiverRole, message);
    return res

  }

  async avilableRooms(userId: Types.ObjectId) {
    return await this._roadsideAssistanceRepo.getActiveServiceId(userId)
  }

  async markAsSeen(serviceId: string, userId: string) {
    return await this._chatRepository.markMessageAsSeen(serviceId, userId)
  }




}
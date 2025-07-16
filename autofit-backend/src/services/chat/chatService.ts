import { IChatRepository } from "../../repositories/interfaces/IChatRepository";
import { ChatDocument } from "../../models/chatModel";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IChatService } from "./IChatService";
import { HttpStatus } from "../../types/responseCode";

export class ChatService implements IChatService{

  constructor(
    private _chatRepository: IChatRepository,
    private _roadsideAssistanceRepo : IRoadsideAssistanceRepo
  ) {}

  async getChatsForService(serviceId: string, serviceType: string, userId: string): Promise<ChatDocument[]> {
    if (!serviceId || !serviceType || !userId) throw new ApiError("Service ID, Service Type, and User ID are required", HttpStatus.BAD_REQUEST);
    return await this._chatRepository.getChatsForService(serviceId, serviceType, userId);
  }


  async getChatsForMechanic(mechanicId: string): Promise<any> {
    if (!mechanicId) throw new ApiError("Mechanic ID is required", HttpStatus.BAD_REQUEST);

    const chats =  await this._chatRepository.getChatsForMechanic(mechanicId);
    return chats
  }

  async saveMessage(serviceId: string,serviceType: string,senderId: string,senderRole: "user" | "mechanic",receiverId: string,receiverRole: "user" | "mechanic",message: string): Promise<ChatDocument> {

    if (!serviceId || !serviceType || !senderId || !receiverId || !message) {
      throw new ApiError("All message fields are required", HttpStatus.BAD_REQUEST);
    }
    const res =  await this._chatRepository.sendMessage(serviceId, serviceType, senderId, senderRole, receiverId, receiverRole, message);
    return res
    
  }

  async avilableRooms(userId:Types.ObjectId){
    return await this._roadsideAssistanceRepo.getActiveServiceId(userId)
  }

  async markAsSeen(serviceId:string,userId:string){
    return await this._chatRepository.markMessageAsSeen(serviceId,userId)
  }



  
}
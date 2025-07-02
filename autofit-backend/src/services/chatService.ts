import { IChatRepository } from "../repositories/interfaces/IChatRepository";
import { ChatDocument } from "../models/chatModel";
import { ApiError } from "../utils/apiError";
import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../repositories/interfaces/IRoadsideAssistanceRepo";

export class ChatService {

  constructor(
    private chatRepository: IChatRepository,
    private roadsideAssistanceRepo : IRoadsideAssistanceRepo
  ) {}

  async getChatsForService(serviceId: string, serviceType: string, userId: string): Promise<ChatDocument[]> {
    if (!serviceId || !serviceType || !userId) throw new ApiError("Service ID, Service Type, and User ID are required", 400);
    return await this.chatRepository.getChatsForService(serviceId, serviceType, userId);
  }


  async getChatsForMechanic(mechanicId: string): Promise<any> {
    if (!mechanicId) throw new ApiError("Mechanic ID is required", 400);

    const chats =  await this.chatRepository.getChatsForMechanic(mechanicId);
    return chats
  }

  async saveMessage(serviceId: string,serviceType: string,senderId: string,senderRole: "user" | "mechanic",receiverId: string,receiverRole: "user" | "mechanic",message: string): Promise<ChatDocument> {

    if (!serviceId || !serviceType || !senderId || !receiverId || !message) {
      throw new ApiError("All message fields are required", 400);
    }
    const res =  await this.chatRepository.sendMessage(serviceId, serviceType, senderId, senderRole, receiverId, receiverRole, message);
    return res
    
  }

  async avilableRooms(userId:Types.ObjectId){
    return await this.roadsideAssistanceRepo.getActiveServiceId(userId)
  }

  async markAsSeen(serviceId:string,userId:string){
    return await this.chatRepository.markMessageAsSeen(serviceId,userId)
  }



  
}
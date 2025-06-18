import { IChatRepository } from "../repositories/interfaces/IChatRepository";
import { ChatDocument } from "../models/chatModel";
import { ApiError } from "../utils/apiError";

export class ChatService {

  constructor(private chatRepository: IChatRepository) {}

  async getChatsForService(serviceId: string, serviceType: string, userId: string): Promise<ChatDocument[]> {
    if (!serviceId || !serviceType || !userId) throw new ApiError("Service ID, Service Type, and User ID are required", 400);
    return this.chatRepository.getChatsForService(serviceId, serviceType, userId);
  }

  async getChatsForMechanic(mechanicId: string): Promise<ChatDocument[]> {
    if (!mechanicId) throw new ApiError("Mechanic ID is required", 400);
    return this.chatRepository.getChatsForMechanic(mechanicId);
  }

  async sendMessage(
    serviceId: string,
    serviceType: string,
    senderId: string,
    senderRole: "user" | "mechanic",
    receiverId: string,
    receiverRole: "user" | "mechanic",
    message: string
  ): Promise<ChatDocument> {
    if (!serviceId || !serviceType || !senderId || !receiverId || !message) {
      throw new ApiError("All message fields are required", 400);
    }
    return this.chatRepository.sendMessage(serviceId, serviceType, senderId, senderRole, receiverId, receiverRole, message);
  }

  async markMessageAsSeen(chatId: string, userId: string): Promise<ChatDocument> {
    if (!chatId || !userId) throw new ApiError("Chat ID and User ID are required", 400);
    return this.chatRepository.markMessageAsSeen(chatId, userId);
  }
}
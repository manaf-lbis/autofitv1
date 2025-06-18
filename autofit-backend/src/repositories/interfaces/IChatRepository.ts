import { ChatDocument } from "../../models/chatModel";

export interface IChatRepository {
  getChatsForService(serviceId: string, serviceType: string, userId: string): Promise<ChatDocument[]>;
  getChatsForMechanic(mechanicId: string): Promise<ChatDocument[]>;
  sendMessage(
    serviceId: string,
    serviceType: string,
    senderId: string,
    senderRole: "user" | "mechanic",
    receiverId: string,
    receiverRole: "user" | "mechanic",
    message: string
  ): Promise<ChatDocument>;
  markMessageAsSeen(chatId: string, userId: string): Promise<ChatDocument>;
}
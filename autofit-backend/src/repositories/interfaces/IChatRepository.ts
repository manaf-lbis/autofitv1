import { ChatDocument } from "../../models/chatModel";
import { Role } from "../../types/role";

export interface IChatRepository {
  getChatsForService(serviceId: string, serviceType: string, userId: string): Promise<ChatDocument[]>;
  getChatsForMechanic(mechanicId: string): Promise<ChatDocument[]>;
  sendMessage(
    serviceId: string,
    serviceType: string,
    senderId: string,
    senderRole:Exclude<Role, Role.ADMIN>,
    receiverId: string,
    receiverRole: Exclude<Role, Role.ADMIN>,
    message: string
  ): Promise<ChatDocument>;
  markMessageAsSeen(serviceId: string,userId:string): Promise<void>;
}
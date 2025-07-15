import { Types } from "mongoose";
import { ChatDocument } from "../../models/chatModel";

export interface IChatService {
  getChatsForService(
    serviceId: string,
    serviceType: string,
    userId: string
  ): Promise<ChatDocument[]>;

  getChatsForMechanic(mechanicId: string): Promise<ChatDocument[]>;

  saveMessage(
    serviceId: string,
    serviceType: string,
    senderId: string,
    senderRole: "user" | "mechanic",
    receiverId: string,
    receiverRole: "user" | "mechanic",
    message: string
  ): Promise<ChatDocument>;

  avilableRooms(userId: Types.ObjectId): Promise<any>;

  markAsSeen(serviceId: string, userId: string): Promise<void | any>;
}

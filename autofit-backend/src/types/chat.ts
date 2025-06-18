import { Types } from "mongoose";

export interface Chat {
  serviceId: Types.ObjectId;
  serviceType: "roadsideAssistance" | "pretrip" | "live";
  senderId: Types.ObjectId;
  senderRole: "user" | "mechanic";
  receiverId: Types.ObjectId;
  receiverRole: "user" | "mechanic";
  message: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
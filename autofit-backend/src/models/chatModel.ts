import { Document, model, Schema, Types } from "mongoose";
import { Chat } from "../types/chat";

export interface ChatDocument extends Chat, Document<Types.ObjectId> {}

const chatSchema: Schema<ChatDocument> = new Schema(
{
    serviceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["roadsideAssistance", "pretrip", "live"],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderRole", 
    },
    senderRole: {
      type: String,
      required: true,
      enum: ["user", "mechanic"],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "receiverRole",
    },
    receiverRole: {
      type: String,
      required: true,
      enum: ["user", "mechanic"],
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

chatSchema.index({ serviceId: 1, createdAt: -1 });
chatSchema.index({ receiverId: 1, seen: 1 });

export const ChatMessageModel = model<ChatDocument>("chat", chatSchema);

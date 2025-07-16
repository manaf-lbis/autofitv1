import { Types } from "mongoose";
import { ChatDocument, ChatMessageModel } from "../models/chatModel";
import { RoadsideAssistanceModel } from "../models/roadsideAssistanceModel";
import { ApiError } from "../utils/apiError";
import { IChatRepository } from "./interfaces/IChatRepository";
import { HttpStatus } from "../types/responseCode";
import { Role } from "../types/role";




export class ChatRepository implements IChatRepository {

    private getServiceModel(serviceType: string) {
        switch (serviceType) {
            case "roadsideAssistance":
                return RoadsideAssistanceModel;
            case "pretrip":
                return RoadsideAssistanceModel;
            case "live":
                return RoadsideAssistanceModel;
            default:
                throw new ApiError("Invalid service type", HttpStatus.BAD_REQUEST);
        }
    }

    async getChatsForService(serviceId: string, serviceType: string, userId: string): Promise<ChatDocument[]> {

        const ServiceModel = this.getServiceModel(serviceType);

        const service = await ServiceModel.findById(serviceId);

        if (!service) throw new ApiError("Service not found", HttpStatus.NOT_FOUND);

        if (service.userId.toString() !== userId) throw new ApiError("Unauthorized access to service chats", HttpStatus.FORBIDDEN);

        return ChatMessageModel.find({ serviceId: new Types.ObjectId(serviceId), serviceType })
            .populate("senderId", "name")
            .populate("receiverId", "name")
            .sort({ createdAt: 1 })
            .lean();
    }



    async getChatsForMechanic(mechanicId: string): Promise<ChatDocument[]> {
        const objectId = new Types.ObjectId(mechanicId);
        return await ChatMessageModel.aggregate([
            {$match: {$or: [ { senderId: objectId },{ receiverId: objectId }]}},
            {$lookup: {from: "users",let: { senderId: "$senderId" }, pipeline: [ { $match: { $expr: { $eq: ["$_id", "$$senderId"] } } },{ $project: { name: 1 } } ],as: "senderInfo"}},
            {$unwind: { path: "$senderInfo",preserveNullAndEmptyArrays: true}},
            { $group: { _id: "$serviceId",name: { $first: "$senderInfo.name" } , messages: { $push: "$$ROOT" },}},
            {$sort: {"messages.createdAt": -1}}
        ]);
    }

    async sendMessage(serviceId: string, serviceType: string, senderId: string, senderRole: Role.USER | Role.MECHANIC, receiverId: string, receiverRole: Role.USER | Role.MECHANIC, message: string): Promise<ChatDocument> {

        const chat: ChatDocument = new ChatMessageModel({
            serviceId: new Types.ObjectId(serviceId),
            serviceType: serviceType,
            senderId: new Types.ObjectId(senderId),
            senderRole,
            receiverId: new Types.ObjectId(receiverId),
            receiverRole,
            message,
        });

        const savedChat = await chat.save();
        const populatedChat = await (await savedChat.populate("senderId", "name")).populate("receiverId", "name");
        return populatedChat;
    }

    async markMessageAsSeen(serviceId: string,userId:string): Promise<void> {
        await ChatMessageModel.updateMany({serviceId,receiverId:userId},{seen:true})
    }
}
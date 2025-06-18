import { Types } from "mongoose";
import { ChatDocument, ChatMessageModel } from "../models/chatModel";
import { RoadsideAssistanceModel } from "../models/roadsideAssistanceModel";
import { ApiError } from "../utils/apiError";




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
                throw new ApiError("Invalid service type", 400);
        }
    }

    async getChatsForService(serviceId: string, serviceType: string, userId: string): Promise<ChatDocument[]> {

        const ServiceModel = this.getServiceModel(serviceType);
        const service = await ServiceModel.findById(serviceId);

        if (!service) throw new ApiError("Service not found", 404);

        if (service.userId.toString() !== userId) throw new ApiError("Unauthorized access to service chats", 403);

        return ChatMessageModel.find({ serviceId: new Types.ObjectId(serviceId), serviceType })
            .populate("senderId", "name")
            .populate("receiverId", "name")
            .sort({ createdAt: 1 })
            .lean();
    }

    async getChatsForMechanic(mechanicId: string): Promise<ChatDocument[]> {
        // Fetch services assigned to the mechanic from all three collections
        const roadsideServices = await RoadsideAssistanceModel.find({ assignedMechanicId: new Types.ObjectId(mechanicId) }).select("_id");
        // const pretripServices = await PreTripCheckupModel.find({ assignedMechanicId: new Types.ObjectId(mechanicId) }).select("_id");
        // const liveServices = await LiveAssistanceModel.find({ assignedMechanicId: new Types.ObjectId(mechanicId) }).select("_id");

        const serviceIds = [
            ...roadsideServices.map((s) => ({ id: s._id, type: "roadsideAssistance" })),
            //   ...pretripServices.map((s) => ({ id: s._id, type: "pretrip" })),
            //   ...liveServices.map((s) => ({ id: s._id, type: "live" })),
        ];

        return ChatMessageModel.find({
            $or: serviceIds.map(({ id, type }) => ({ serviceId: id, serviceType: type })),
        })
            .populate("senderId", "name")
            .populate("receiverId", "name")
            .sort({ createdAt: 1 })
            .lean();
    }

    async sendMessage(serviceId: string, serviceType: string, senderId: string, senderRole: "user" | "mechanic", receiverId: string, receiverRole: "user" | "mechanic", message: string): Promise<ChatDocument> {

        const ServiceModel = this.getServiceModel(serviceType);
        const service = await ServiceModel.findById(serviceId);
        if (!service) throw new ApiError("Service not found", 404);

        // Validate sender and receiver based on service roles
        const isSenderValid =
            (senderRole === "user" && service.userId.toString() === senderId) ||
            (senderRole === "mechanic" && service.mechanicId?.toString() === senderId);

        if (!isSenderValid) throw new ApiError("Unauthorized sender", 403);

        const isReceiverValid =
            (receiverRole === "user" && service.userId.toString() === receiverId) ||
            (receiverRole === "mechanic" && service.mechanicId?.toString() === receiverId);

        if (!isReceiverValid) throw new ApiError("Unauthorized receiver", 403);

        const chat: ChatDocument = new ChatMessageModel({
        serviceId: new Types.ObjectId(serviceId),
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

    async markMessageAsSeen(chatId: string, userId: string): Promise<ChatDocument> {

        const chat = await ChatMessageModel.findById(chatId);
        if (!chat) throw new ApiError("Chat message not found", 404);

        const ServiceModel = this.getServiceModel(chat.serviceType);
        const service = await ServiceModel.findById(chat.serviceId);
        if (service) {
            if (
                (chat.receiverRole === "user" && service.userId.toString() !== userId) ||
                (chat.receiverRole === "mechanic" && service.mechanicId?.toString() !== userId)
            ) {
                throw new ApiError("Unauthorized to mark this message as seen", 403);
            }
        }

        chat.seen = true;
        return await chat.save();
    }
}
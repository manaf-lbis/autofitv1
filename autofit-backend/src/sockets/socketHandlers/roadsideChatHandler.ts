import { Socket } from "socket.io";
import { ChatService } from "../../services/chat/chatService"; 
import { ChatRepository } from "../../repositories/chatRepository";
import { verifyJwt } from "../verifyJwt";
import { RoadsideAssistanceModel } from "../../models/roadsideAssistanceModel";
import { ApiError } from "../../utils/apiError";
import { getIO } from "../socket";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { Role } from "../../types/role";

export const roadsideChatHandler = (socket: Socket) => {
  const chatRepository = new ChatRepository();
  const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
  const chatService = new ChatService(chatRepository, roadsideAssistanceRepo);

  try {

    socket.on("markAsSeen", async (data) => {
      const { serviceId } = data;
      const { id: userId } = verifyJwt(socket);
      await chatService.markAsSeen(serviceId, userId);

      const room = `roadside_${serviceId}`;
      getIO().to(room).emit('seen', { serviceId })

    })


    socket.on("roadsideChat", async (data) => {

      let serviceDoc;
      let receiverId;
      let receiverRole: Role.USER | Role.MECHANIC;

      const { serviceId, message } = data;
      const { id: senderId, role: senderRole } = verifyJwt(socket);
      serviceDoc = await RoadsideAssistanceModel.findById(serviceId).select('userId _id mechanicId');

      if (!serviceDoc) throw new ApiError('Service not found');

      if (senderRole === Role.USER) {
        if (serviceDoc?.userId.toString() !== senderId) throw new ApiError("You are not authorized for this service");
        receiverId = serviceDoc.mechanicId.toString();
        receiverRole = Role.MECHANIC

      } else if (senderRole === Role.MECHANIC) {
        if (serviceDoc.mechanicId.toString() !== senderId) throw new ApiError("You are not authorized for this service");
        receiverId = serviceDoc.userId.toString();
        receiverRole = Role.USER;

      } else {
        throw new ApiError('invalid user')
      }

      const savedMsg = await chatService.saveMessage(serviceId, 'roadsideAssistance', senderId, senderRole, receiverId, receiverRole, message)

      const room = `roadside_${serviceId}`;
      getIO().to(room).emit('roadsideMessage', {
        _id: savedMsg._id,
        serviceId,
        message,
        senderId,
        receiverRole,
        senderName: (savedMsg.senderId as any).name,
        senderRole,
        servicetype: savedMsg.serviceType,
        seen: savedMsg.seen,
        createdAt: savedMsg.createdAt,
      })


    });
    
  } catch (error) {
    console.log(error);

    socket.emit("error", { message: "Failed to send message" });
  }
};
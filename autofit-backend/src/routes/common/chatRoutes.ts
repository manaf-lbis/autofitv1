import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { ChatController } from "../../controllers/common/chatController";
import { ChatService } from "../../services/chat/chatService"; 
import { ChatRepository } from "../../repositories/chatRepository";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { Role } from "../../types/role";



const router = express.Router();

const chatRepository = new ChatRepository();
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const chatService = new ChatService(chatRepository,roadsideAssistanceRepo);
const chatController = new ChatController(chatService);

router.get("/service/:serviceType/:serviceId", authenticate, authorize([Role.USER]), chatController.getChatsForService.bind(chatController));
router.get("/mechanic", authenticate, authorize([Role.MECHANIC]), chatController.getChatsForMechanic.bind(chatController));
router.get("/avilable-rooms", authenticate, authorize(Object.values(Role)), chatController.avilableRoomId.bind(chatController));


export default router;
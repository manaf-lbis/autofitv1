import express from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { ChatController } from "../../controllers/common/chatController";
import { ChatService } from "../../services/chatService";
import { ChatRepository } from "../../repositories/chatRepository";



const router = express.Router();

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController = new ChatController(chatService);

router.get("/service/:serviceType/:serviceId", authenticate, authorize(["user"]), chatController.getChatsForService.bind(chatController));
router.get("/mechanic", authenticate, authorize(["mechanic"]), chatController.getChatsForMechanic.bind(chatController));


export default router;
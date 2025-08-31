import express from "express";
import { Role } from "../../types/role";
import { chatController } from "../../di/commonDI";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";


const router = express.Router();



router.get("/service/:serviceType/:serviceId", authenticate, authorize([Role.USER]), chatController.getChatsForService.bind(chatController));
router.get("/mechanic", authenticate, authorize([Role.MECHANIC]), chatController.getChatsForMechanic.bind(chatController));
router.get("/avilable-rooms", authenticate, authorize(Object.values(Role)), chatController.avilableRoomId.bind(chatController));


export default router;
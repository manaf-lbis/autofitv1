import Router from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../types/role";
import { notificationController } from "../../di/commonDI";


const router = Router();

router.get('/', authenticate, authorize(Object.values(Role)), notificationController.getNotification.bind(notificationController));
router.patch('/', authenticate, authorize(Object.values(Role)), notificationController.updateNotification.bind(notificationController));


export default router;
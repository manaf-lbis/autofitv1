import { Router } from "express";
import { liveAssistanceController } from "../../di/mechnaicDI";

const router = Router();




router.get('/', liveAssistanceController.getDetails.bind(liveAssistanceController));
router.get('/service-history', liveAssistanceController.serviceHistory.bind(liveAssistanceController));
router.post('/update-status', liveAssistanceController.markAsCompleted.bind(liveAssistanceController));



export default router



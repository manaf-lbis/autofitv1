import {Router} from "express";
import { liveAssistanceController } from "../../di/userDI";

const router = Router();


router.post('/booking', liveAssistanceController.createBooking.bind(liveAssistanceController));
router.get('/booking/:id/details', liveAssistanceController.bookingDetails.bind(liveAssistanceController));
router.get('/session/:id/details', liveAssistanceController.getSessionDetails.bind(liveAssistanceController));
router.post('/invoice', liveAssistanceController.invoice.bind(liveAssistanceController));
router.post('/update-status', liveAssistanceController.markAsCompleted.bind(liveAssistanceController));




export default router
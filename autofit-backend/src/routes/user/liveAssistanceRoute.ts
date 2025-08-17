import {Router} from "express";
import { LiveAssistanceController } from "../../controllers/user/liveAssistanceController";
import { LiveAssistanceService } from "../../services/liveAssistanceService/liveAssistanceService";
import { WorkingHoursRepository } from "../../repositories/workingHoursRepository";
import { TimeBlockRepository } from "../../repositories/timeBlockRepository";
import { LiveAsistanceRepository } from "../../repositories/liveAssistanceRepository";



const workingHoursRepo = new WorkingHoursRepository()
const timeBlockingRepo = new TimeBlockRepository()
const liveAssistanceRepo = new LiveAsistanceRepository()
const liveAssistanceService = new LiveAssistanceService(workingHoursRepo,timeBlockingRepo,liveAssistanceRepo)
const liveAssistanceController = new LiveAssistanceController(liveAssistanceService)

const router = Router();


router.post('/booking', liveAssistanceController.createBooking.bind(liveAssistanceController));
router.get('/booking/:id/details', liveAssistanceController.bookingDetails.bind(liveAssistanceController));
router.get('/session/:id/details', liveAssistanceController.getSessionDetails.bind(liveAssistanceController));




export default router
import { Router } from "express";
import { LiveAssistanceController } from "../../controllers/mechanic/liveAssistController";
import { LiveAssistanceService } from "../../services/liveAssistanceService/liveAssistanceService";
import { WorkingHoursRepository } from "../../repositories/workingHoursRepository";
import { TimeBlockRepository } from "../../repositories/timeBlockRepository";
import { LiveAsistanceRepository } from "../../repositories/liveAssistanceRepository";

const router = Router();

const timeBlockRepo = new TimeBlockRepository()
const workingHoursRepo = new WorkingHoursRepository()
const liveAsistanceRepository = new LiveAsistanceRepository()
const liveAssistanceService = new LiveAssistanceService(workingHoursRepo,timeBlockRepo,liveAsistanceRepository)
const liveAssistanceController = new LiveAssistanceController(liveAssistanceService)


router.get('/', liveAssistanceController.getDetails.bind(liveAssistanceController));
router.get('/service-history', liveAssistanceController.serviceHistory.bind(liveAssistanceController));
router.post('/update-status', liveAssistanceController.markAsCompleted.bind(liveAssistanceController));



export default router



import { Router } from "express";
import { pretripController } from "../../di/mechnaicDI";



const router = Router();



router.get('/weekly-schedules', pretripController.weeklySchedules.bind(pretripController));
router.get('/:id/details', pretripController.workDetails.bind(pretripController));
router.patch('/update-status', pretripController.updateStatus.bind(pretripController));
router.post('/create-report', pretripController.createReport.bind(pretripController));
router.get('/service-history', pretripController.serviceHistory.bind(pretripController));




export default router



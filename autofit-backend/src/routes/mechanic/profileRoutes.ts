import { Router } from "express";
import { mechProfileController } from "../../di/mechnaicDI";
import fileUploadMiddleware from "../../middlewares/uploadMiddleware";

const router = Router();


router.get('/me', mechProfileController.profile.bind(mechProfileController));
router.post('/register', fileUploadMiddleware, mechProfileController.register.bind(mechProfileController));

router.post('/update', mechProfileController.update.bind(mechProfileController));

router.post('/resubmit-request', mechProfileController.removeApplication.bind(mechProfileController));
router.post('/availability', mechProfileController.changeAvailablity.bind(mechProfileController));
router.post('/updateNotification', mechProfileController.setReadNotification.bind(mechProfileController));

router.get('/working-hours', mechProfileController.getWorkingHours.bind(mechProfileController));
router.post('/working-hours', mechProfileController.createWorkingHours.bind(mechProfileController));
router.patch('/working-hours', mechProfileController.updateworkingHours.bind(mechProfileController));

router.post('/block-schedule', mechProfileController.blockSchedule.bind(mechProfileController));
router.delete('/unblock-schedule', mechProfileController.unblockSchedule.bind(mechProfileController));

router.get('/reviews', mechProfileController.listReviews.bind(mechProfileController));



export default router
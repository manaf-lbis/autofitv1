import { Router } from "express";
import { mechProfileController } from "../../di/mechnaicDI";
import fileUploadMiddleware from "../../middlewares/uploadMiddleware";
// import { ProfileController } from "../../controllers/mechanic/profileController";
// import { ProfileService } from "../../services/mechanic/profileService";
// import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
// import { MechanicRepository } from "../../repositories/mechanicRepository";
// import fileUploadMiddleware from "../../middlewares/uploadMiddleware";
// import { NotificationRepository } from "../../repositories/notificationRepository";
// import { WorkingHoursRepository } from "../../repositories/workingHoursRepository";
// import { TimeBlockRepository } from "../../repositories/timeBlockRepository";



// const mechProfileRepo = new MechanicProfileRepository()
// const mechRepository = new MechanicRepository()
// const notificationRepository = new NotificationRepository()
// const workingHoursRepository = new WorkingHoursRepository()
// const timeBlockingRepo = new TimeBlockRepository()
// const mechanicProfileService = new ProfileService(
//     mechProfileRepo,
//     mechRepository,
//     notificationRepository,
//     workingHoursRepository,
//     timeBlockingRepo
// )
// const mechProfileController = new ProfileController(mechanicProfileService)

const router = Router();


router.get('/me', mechProfileController.profile.bind(mechProfileController));
router.post('/register', fileUploadMiddleware, mechProfileController.register.bind(mechProfileController));
router.post('/resubmit-request', mechProfileController.removeApplication.bind(mechProfileController));
router.post('/availability', mechProfileController.changeAvailablity.bind(mechProfileController));
router.post('/updateNotification', mechProfileController.setReadNotification.bind(mechProfileController));

router.get('/working-hours', mechProfileController.getWorkingHours.bind(mechProfileController));
router.post('/working-hours', mechProfileController.createWorkingHours.bind(mechProfileController));
router.patch('/working-hours', mechProfileController.updateworkingHours.bind(mechProfileController));

router.post('/block-schedule', mechProfileController.blockSchedule.bind(mechProfileController));
router.delete('/unblock-schedule', mechProfileController.unblockSchedule.bind(mechProfileController));


export default router
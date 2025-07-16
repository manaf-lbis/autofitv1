import { Router } from "express";
import { ProfileController } from "../../controllers/mechanic/profileController";
import { ProfileService } from "../../services/mechanic/profileService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { MechanicRepository } from "../../repositories/mechanicRepository";
import fileUploadMiddleware from "../../middlewares/uploadMiddleware";
import { NotificationRepository } from "../../repositories/notificationRepository";



const mechProfileRepo = new MechanicProfileRepository()
const mechRepo = new MechanicRepository()
const notificationRepository = new NotificationRepository()
const mechanicProfileService = new ProfileService(mechProfileRepo, mechRepo, notificationRepository)
const mechProfileController = new ProfileController(mechanicProfileService)

const router = Router();


// router.get('/me', (req, res, next) => mechProfileController.profile(req, res, next))
// router.post('/register', fileUploadMiddleware, (req, res, next) => mechProfileController.register(req, res, next))
// router.post('/resubmit-request', (req, res, next) => mechProfileController.removeApplication(req, res, next))
// router.post('/availability', (req, res, next) => mechProfileController.changeAvailablity(req, res, next))
// router.post('/updateNotification', (req, res, next) => mechProfileController.setReadNotification(req, res, next))

router.get('/me', mechProfileController.profile.bind(mechProfileController));
router.post('/register', fileUploadMiddleware, mechProfileController.register.bind(mechProfileController));
router.post('/resubmit-request', mechProfileController.removeApplication.bind(mechProfileController));
router.post('/availability', mechProfileController.changeAvailablity.bind(mechProfileController));
router.post('/updateNotification', mechProfileController.setReadNotification.bind(mechProfileController));



export default router
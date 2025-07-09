import { Router } from "express";
import { ProfileController } from "../../controllers/user/profileController";
import { ProfileService } from "../../services/user/userProfileService";
import { UserRepository } from "../../repositories/userRepository";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";

const userRepository = new UserRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const profileService = new ProfileService(userRepository,roadsideAssistanceRepo)
const profileController = new ProfileController(profileService)

const router = Router();

router.patch('/update', profileController.updateUser.bind(profileController));
router.get('/service-history', profileController.serviceHistory.bind(profileController));




export default router
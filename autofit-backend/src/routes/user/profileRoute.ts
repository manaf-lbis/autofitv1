import { Router } from "express";
import { ProfileController } from "../../controllers/user/profileController";
import { UserProfileService } from "../../services/user/userProfileService";
import { UserRepository } from "../../repositories/userRepository";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { PretripBookingRepository } from "../../repositories/pretripBookingRepository";

const userRepository = new UserRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const pretripBookingRepository = new PretripBookingRepository()
const profileService = new UserProfileService(userRepository,roadsideAssistanceRepo, pretripBookingRepository)
const profileController = new ProfileController(profileService)

const router = Router();

router.patch('/update', profileController.updateUser.bind(profileController));
router.get('/service-history/roadside-assistance', profileController.roadsideServiceHistory.bind(profileController));
router.get('/service-history/pretrip', profileController.pretripServiceHistory.bind(profileController));




export default router
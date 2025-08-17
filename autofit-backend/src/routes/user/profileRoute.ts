import { Router } from "express";
import { ProfileController } from "../../controllers/user/profileController";
import { UserProfileService } from "../../services/user/userProfileService";
import { UserRepository } from "../../repositories/userRepository";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { PretripBookingRepository } from "../../repositories/pretripBookingRepository";
import { LiveAsistanceRepository } from "../../repositories/liveAssistanceRepository";

const userRepository = new UserRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const pretripBookingRepository = new PretripBookingRepository()
const liveAssistanceRepo = new LiveAsistanceRepository()
const profileService = new UserProfileService(userRepository,roadsideAssistanceRepo, pretripBookingRepository,liveAssistanceRepo)
const profileController = new ProfileController(profileService)

const router = Router();

router.patch('/update', profileController.updateUser.bind(profileController));
router.get('/service-history/roadside-assistance', profileController.roadsideServiceHistory.bind(profileController));
router.get('/service-history/pretrip', profileController.pretripServiceHistory.bind(profileController));
router.get('/service-history/live-assistance', profileController.liveAssistanceServiceHistory.bind(profileController));




export default router
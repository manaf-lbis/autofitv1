import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { ProfileController } from "../../controllers/user/profileController";
import { ProfileService } from "../../services/user/userProfileService";
import { UserRepository } from "../../repositories/userRepository";

const userRepository = new UserRepository()
const profileService = new ProfileService(userRepository)
const profileController = new ProfileController(profileService)

const router = Router();

router.patch('/update',authenticate, authorize(['user']),(req, res,next) => profileController.updateUser(req,res,next) );



export default router
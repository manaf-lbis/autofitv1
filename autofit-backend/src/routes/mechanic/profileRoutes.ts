import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { ProfileController } from "../../controllers/mechanic/profileController";
import { MechanicRegistrationService } from "../../services/mechanic/mechanicRegistrationService";
import { ProfileService } from "../../services/mechanic/profileService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { MechanicRepository } from "../../repositories/mechanicRepository";
import fileUploadMiddleware from "../../middlewares/uploadMiddleware";



const mechProfileRepo = new MechanicProfileRepository()
const mechRepo = new MechanicRepository()
const mechanicProfileService =  new ProfileService(mechProfileRepo,mechRepo)
const mechProfileController = new ProfileController(mechanicProfileService)

const router = Router();
 

router.get('/me',authenticate,authorize(['mechanic']),(req,res,next)=>mechProfileController.profile(req,res,next))
router.post('/register',authenticate,authorize(['mechanic']),fileUploadMiddleware,(req,res,next)=>mechProfileController.register(req,res,next))
router.post('/resubmit-request',authenticate,authorize(['mechanic']),(req,res,next)=>mechProfileController.removeApplication(req,res,next))


export default router
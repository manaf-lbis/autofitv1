import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { PageController } from "../../controllers/mechanic/pageController";
import { PageService } from "../../services/mechanic/pageService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { NotificationRepository } from "../../repositories/notificationRepository";



const mechanicProfileRepo = new MechanicProfileRepository()
const notificationRepository =  new NotificationRepository()
const pageService = new PageService(mechanicProfileRepo,notificationRepository)
const pageController = new PageController(pageService)


const router = Router();
 

router.get('/dashboard',authenticate,authorize(['mechanic']),(req,res,next)=>pageController.dashboard(req,res,next));
router.get('/info',authenticate,authorize(['mechanic']),(req,res,next)=>pageController.primaryInfo(req,res,next));



export default router
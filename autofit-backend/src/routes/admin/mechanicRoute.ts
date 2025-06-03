import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { MechanicController } from "../../controllers/admin/mechanicController";
import { MechanicService } from "../../services/admin/mechanicSevice";
import { MechanicRepository } from "../../repositories/mechanicRepository";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { ProfileService } from "../../services/mechanic/profileService";

const mechanicProfileRepository = new MechanicProfileRepository()
const mechanicRepository = new MechanicRepository()
const mechanicService = new MechanicService(mechanicRepository,mechanicProfileRepository)
const profileService = new ProfileService(mechanicProfileRepository,mechanicRepository)
const mechanicController = new MechanicController(mechanicService,profileService)


const router = Router()


router.get("/applications", authenticate, authorize(['admin']),(req,res,next)=>mechanicController.listApplications(req,res,next))
router.get("/application/:id", authenticate, authorize(['admin']), (req,res,next)=>mechanicController.getApplication(req,res,next))
router.patch("/application/:id/status", authenticate, authorize(['admin']), (req,res,next)=>mechanicController.applicationStatus(req,res,next))

router.get("/",authenticate, authorize(['admin']), (req,res,next)=>mechanicController.getAllMechanic(req,res,next))
router.get("/:id", authenticate, authorize(['admin']), (req,res,next)=>mechanicController.getMechanicById(req,res,next))
router.patch("/:id/status", authenticate, authorize(['admin']), (req,res,next)=>mechanicController.changeStatus(req,res,next))



export default router

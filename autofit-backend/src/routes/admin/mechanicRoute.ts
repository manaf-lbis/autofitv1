import { Router } from "express";
import { MechanicController } from "../../controllers/admin/mechanicController";
import { MechanicService } from "../../services/admin/mechanicSevice";
import { MechanicRepository } from "../../repositories/mechanicRepository";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { ProfileService } from "../../services/mechanic/profileService";
import { NotificationRepository } from "../../repositories/notificationRepository";

const mechanicProfileRepository = new MechanicProfileRepository()
const mechanicRepository = new MechanicRepository()
const mechanicService = new MechanicService(mechanicRepository, mechanicProfileRepository)
const notificationRepository = new NotificationRepository()
const profileService = new ProfileService(mechanicProfileRepository, mechanicRepository, notificationRepository)
const mechanicController = new MechanicController(mechanicService, profileService)


const router = Router()


router.get("/applications", (req, res, next) => mechanicController.listApplications(req, res, next))
router.patch("/application/:id/status", (req, res, next) => mechanicController.applicationStatus(req, res, next))

router.get("/", (req, res, next) => mechanicController.getAllMechanic(req, res, next))
router.get("/:id", (req, res, next) => mechanicController.getMechanicById(req, res, next))
router.patch("/:id/status", (req, res, next) => mechanicController.changeStatus(req, res, next))



export default router

import { Router } from "express";
import { PageController } from "../../controllers/mechanic/pageController";
import { PageService } from "../../services/mechanic/pageService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { NotificationRepository } from "../../repositories/notificationRepository";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { PretripBookingRepository } from "../../repositories/pretripBookingRepository";



const mechanicProfileRepo = new MechanicProfileRepository()
const notificationRepository = new NotificationRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const pretripBookingRepository = new PretripBookingRepository()
const pageService = new PageService(
    mechanicProfileRepo,
    notificationRepository,
    roadsideAssistanceRepo,
    pretripBookingRepository
)
const pageController = new PageController(pageService)


const router = Router();

router.get('/dashboard', pageController.dashboard.bind(pageController));
router.get('/info', pageController.primaryInfo.bind(pageController));



export default router
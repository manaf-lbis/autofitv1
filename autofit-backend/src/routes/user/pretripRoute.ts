import { Router } from "express";
import { PretripController } from "../../controllers/user/pretripController";
import { PretripPlanService } from "../../services/pretripCheckup/PretripPlanService";
import { PretripFeatureRepository } from "../../repositories/pretripFeatureRepository";
import { PretripPlanRepository } from "../../repositories/pretripPlanRepository";
import { PretripService } from "../../services/pretripCheckup/pretripService";
import { PretripSlotRepository } from "../../repositories/pretripSlotRepository";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { GoogleMapRepository } from "../../repositories/GoogleMapRepository";


const router = Router();

const pretripPlanRepository = new PretripPlanRepository()
const pretripFeaterRepository = new PretripFeatureRepository()
const pretripPlanService = new PretripPlanService(pretripFeaterRepository,pretripPlanRepository);
const pretripSlotRepository = new PretripSlotRepository()
const mechanicProfileRepository = new MechanicProfileRepository()
const googleMapRepo = new GoogleMapRepository()
const pretripService = new PretripService(pretripSlotRepository,mechanicProfileRepository,googleMapRepo)
const pretripController = new PretripController(pretripPlanService, pretripService)


router.get('/plans',pretripController.getPlans.bind(pretripController));
router.get('/plan/:id',pretripController.getPlan.bind(pretripController));
router.get('/mechanic-shops',pretripController.getNearbyMechanics.bind(pretripController));


export default router
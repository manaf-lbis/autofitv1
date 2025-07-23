import { Router } from "express";
import { PretripController } from "../../controllers/user/pretripController";
import { PretripPlanService } from "../../services/pretripCheckup/PretripPlanService";
import { PretripFeatureRepository } from "../../repositories/pretripFeatureRepository";
import { PretripPlanRepository } from "../../repositories/pretripPlanRepository";


const router = Router();

const pretripPlanRepository = new PretripPlanRepository()
const pretripFeaterRepository = new PretripFeatureRepository()
const pretripPlanService = new PretripPlanService(pretripFeaterRepository,pretripPlanRepository)
const pretripController = new PretripController(pretripPlanService)


router.get('/plans',pretripController.getPlans.bind(pretripController));


export default router
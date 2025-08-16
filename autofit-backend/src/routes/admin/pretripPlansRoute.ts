import { Router } from "express";
import { PretripController } from "../../controllers/admin/pretripController";
import { PretripPlanService } from "../../services/pretripCheckup/PretripPlanService";
import { PretripFeatureRepository } from "../../repositories/pretripFeatureRepository";
import { PretripPlanRepository } from "../../repositories/pretripPlanRepository";




const router = Router()

const pretripFeatureRepository = new PretripFeatureRepository()
const pretripPlanRepository = new PretripPlanRepository()
const pretripPlanService = new PretripPlanService(pretripFeatureRepository,pretripPlanRepository)
const pretripController = new PretripController(pretripPlanService)



router.get("/", pretripController.getPlans.bind(pretripController))
router.post("/", pretripController.createPlan.bind(pretripController)) 

router.get("/features", pretripController.getFeatures.bind(pretripController)) 
router.post("/features", pretripController.createFeature.bind(pretripController)) 

router.patch("/features/:id", pretripController.updateFeature.bind(pretripController)) 
router.delete("/features/:id", pretripController.deleteFeature.bind(pretripController) )


router.patch("/:id/toggle", pretripController.togglePlanStatus.bind(pretripController)) 
router.patch("/:id", pretripController.updatePlan.bind(pretripController))
router.delete("/:id", pretripController.deletePlan.bind(pretripController))



export default router

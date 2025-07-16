import { Router } from "express";
import { ServicesController } from "../../controllers/mechanic/servicesController";
import { RoadsideService } from "../../services/roadsideAssistance/roadsideService";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { QuotationRepository } from "../../repositories/quotationRepository";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";


const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const quotationRepo = new QuotationRepository()
const mechanicProfileRepo = new MechanicProfileRepository()
const roadsideService = new RoadsideService(roadsideAssistanceRepo,quotationRepo,mechanicProfileRepo)
const servicesController = new ServicesController(roadsideService)

const router = Router();
 


router.post('/roadside-assistance/status',servicesController.roadsideStatusUpdate.bind(servicesController))
router.post('/roadside-assistance/quotation',servicesController.quotation.bind(servicesController))
router.get('/roadside-assistance/:id/details',servicesController.roadsideAssistanceDetails.bind(servicesController))


export default router
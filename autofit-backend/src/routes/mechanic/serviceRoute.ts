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
 


router.post('/roadside-assistance/status',(req,res,next)=>servicesController.roadsideStatusUpdate(req,res,next))
router.post('/roadside-assistance/quotation',(req,res,next)=>servicesController.quotation(req,res,next))
router.get('/roadside-assistance/:id/details',(req,res,next)=>servicesController.roadsideAssistanceDetails(req,res,next))


export default router
import { Router } from "express";
import { ServicesController } from "../../controllers/mechanic/roadsideController";
import { RoadsideService } from "../../services/roadsideAssistance/roadsideService";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { QuotationRepository } from "../../repositories/quotationRepository";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { TransactionRepository } from "../../repositories/TransactionRepository";
import { PaymentRepository } from "../../repositories/PaymentRepository";


const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const quotationRepo = new QuotationRepository()
const mechanicProfileRepo = new MechanicProfileRepository();
const transactionRepo = new TransactionRepository()
const paymentRepo = new PaymentRepository()
const roadsideService = new RoadsideService(roadsideAssistanceRepo,quotationRepo,mechanicProfileRepo,transactionRepo,paymentRepo)
const servicesController = new ServicesController(roadsideService)

const router = Router();
 


router.post('/roadside-assistance/status',servicesController.roadsideStatusUpdate.bind(servicesController))
router.post('/roadside-assistance/quotation',servicesController.quotation.bind(servicesController))
router.get('/roadside-assistance/:id/details',servicesController.roadsideAssistanceDetails.bind(servicesController))


export default router
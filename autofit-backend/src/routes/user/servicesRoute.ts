import { Router } from "express";
import { ServicesController } from "../../controllers/user/servicesController";
import { UserRoadsideService } from "../../services/roadsideAssistance/userRoadsideService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { GoogleMapRepository } from "../../repositories/googleMapRepository";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { VehicleRepository } from "../../repositories/vehicleRepository";
import { NotificationRepository } from "../../repositories/notificationRepository";
import { RoadsideService } from "../../services/roadsideAssistance/roadsideService";
import { QuotationRepository } from "../../repositories/quotationRepository";
import { RazorpayRepository } from "../../repositories/razorpayRepository";
import { PaymentRepository } from "../../repositories/paymentRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";

const mechanicProfileRepo = new MechanicProfileRepository()
const googleMapRepo = new GoogleMapRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const vehicleRepository = new VehicleRepository()
const quotationRepo = new QuotationRepository()
const transactionRepo = new TransactionRepository()
const notificationRepository = new NotificationRepository()
const paymentRepo = new PaymentRepository()
const roadsideService = new RoadsideService(roadsideAssistanceRepo, quotationRepo,mechanicProfileRepo,transactionRepo,paymentRepo)
const razorpayRepository = new RazorpayRepository()
const roadsideAssistanceService = new UserRoadsideService(mechanicProfileRepo,
    googleMapRepo,
    roadsideAssistanceRepo,
    vehicleRepository,
    notificationRepository,
    razorpayRepository,
    quotationRepo,
    paymentRepo
)
const servicesController = new ServicesController(roadsideAssistanceService, roadsideService)

const router = Router();

router.get('/mechanics-nearby', servicesController.getNearbyMechanic.bind(servicesController));
router.post('/roadside-assistance', servicesController.roadsideAssistance.bind(servicesController));
router.get('/roadside-assistance/:id/details', servicesController.serviceDetails.bind(servicesController));
router.post('/roadside-assistance/payment', servicesController.makePayment.bind(servicesController));
router.post('/roadside-assistance/verify-payment', servicesController.verifyPayment.bind(servicesController));

router.post('/roadside-assistance/quotation/reject', servicesController.cancelQuotation.bind(servicesController));
router.post('/roadside-assistance/cancel', servicesController.cancelQuotation.bind(servicesController));


export default router
import { Router } from "express";
import { ServicesController } from "../../controllers/user/servicesController";
import { UserRoadsideService } from "../../services/roadsideAssistance/userRoadsideService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { GoogleMapRepository } from "../../repositories/GoogleMapRepository";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { VehicleRepository } from "../../repositories/vehicleRepository";
import { NotificationRepository } from "../../repositories/notificationRepository";
import { RoadsideService } from "../../services/roadsideAssistance/roadsideService";
import { QuotationRepository } from "../../repositories/quotationRepository";
import { RazorpayRepository } from "../../repositories/RazorpayRepository";
import { PaymentRepository } from "../../repositories/PaymentRepository";
import { MechanicRepository } from "../../repositories/mechanicRepository";

const mechanicProfileRepo = new MechanicProfileRepository()
const googleMapRepo = new GoogleMapRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const vehicleRepository = new VehicleRepository()
const quotationRepo = new QuotationRepository()
const roadsideService = new RoadsideService(roadsideAssistanceRepo, quotationRepo,mechanicProfileRepo)
const notificationRepository = new NotificationRepository()
const paymentRepo = new PaymentRepository()
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



export default router
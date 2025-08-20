import { Router } from "express";
import { PretripController } from "../../controllers/user/pretripController";
import { PretripPlanService } from "../../services/pretripCheckup/PretripPlanService";
import { PretripFeatureRepository } from "../../repositories/pretripFeatureRepository";
import { PretripPlanRepository } from "../../repositories/pretripPlanRepository";
import { PretripService } from "../../services/pretripCheckup/pretripService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { GoogleMapRepository } from "../../repositories/googleMapRepository";
import { PretripBookingRepository } from "../../repositories/pretripBookingRepository";
import { authorize } from "../../middlewares/authorize";
import { authenticate } from "../../middlewares/authenticate";
import { WorkingHoursRepository } from "../../repositories/workingHoursRepository";
import { TimeBlockRepository } from "../../repositories/timeBlockRepository";
import { PretripReportRepository } from "../../repositories/pretripReportRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { PaymentRepository } from "../../repositories/paymentRepository";


const router = Router();

const pretripPlanRepository = new PretripPlanRepository()
const pretripFeaterRepository = new PretripFeatureRepository()
const pretripPlanService = new PretripPlanService(pretripFeaterRepository,pretripPlanRepository);
const mechanicProfileRepository = new MechanicProfileRepository()
const googleMapRepo = new GoogleMapRepository()
const pretripBookingRepository = new PretripBookingRepository() 
const workingHoursRepository = new WorkingHoursRepository()
const timeBlockingRepository = new TimeBlockRepository()
const pretripReportRepository = new PretripReportRepository()
const transactionRepo = new TransactionRepository()
const paymentRepo = new PaymentRepository()
const pretripService = new PretripService(
    mechanicProfileRepository,
    googleMapRepo,
    pretripBookingRepository,
    pretripPlanRepository,
    workingHoursRepository,
    timeBlockingRepository,
    pretripReportRepository,
    transactionRepo,
    paymentRepo
)
const pretripController = new PretripController(pretripPlanService, pretripService)


router.get('/plans',pretripController.getPlans.bind(pretripController));
router.get('/plan/:id',pretripController.getPlan.bind(pretripController));
router.get('/mechanic-shops',pretripController.getNearbyMechanics.bind(pretripController));
router.post('/booking',authenticate, authorize(['user']),pretripController.booking.bind(pretripController));
router.get('/:id/details',authenticate, authorize(['user']),pretripController.details.bind(pretripController));


export default router
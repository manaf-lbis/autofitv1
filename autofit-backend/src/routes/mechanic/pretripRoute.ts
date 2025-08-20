import { Router } from "express";
import { PretripController } from "../../controllers/mechanic/pretripController";
import { PretripService } from "../../services/pretripCheckup/pretripService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { GoogleMapRepository } from "../../repositories/googleMapRepository";
import { PretripBookingRepository } from "../../repositories/pretripBookingRepository";
import { PretripPlanRepository } from "../../repositories/pretripPlanRepository";
import { ProfileService } from "../../services/mechanic/profileService";
import { NotificationRepository } from "../../repositories/notificationRepository";
import { MechanicRepository } from "../../repositories/mechanicRepository";
import { WorkingHoursRepository } from "../../repositories/workingHoursRepository";
import { TimeBlockRepository } from "../../repositories/timeBlockRepository";
import { PretripReportRepository } from "../../repositories/pretripReportRepository";
import { TransactionRepository } from "../../repositories/transactionRepository";
import { PaymentRepository } from "../../repositories/paymentRepository";


const router = Router();

const mechanicProfileRepository = new MechanicProfileRepository()
const googleMapRepo = new GoogleMapRepository()
const pretripBookingRepository = new PretripBookingRepository()
const pretripPlanRepository = new PretripPlanRepository()
const notificationRepository = new NotificationRepository()
const mechanicRepository = new MechanicRepository();
const workingHoursRepository = new WorkingHoursRepository()
const timeBlockingRepo = new TimeBlockRepository()
const pretripReportRepository = new PretripReportRepository()
const mechanicProfileService = new ProfileService(
    mechanicProfileRepository,
    mechanicRepository,
    notificationRepository,
    workingHoursRepository,
    timeBlockingRepo
)
const transactionRepo = new TransactionRepository()
const paymentRepo = new PaymentRepository()
const pretripService = new PretripService(
    mechanicProfileRepository,
    googleMapRepo,
    pretripBookingRepository,
    pretripPlanRepository,
    workingHoursRepository,
    timeBlockingRepo,
    pretripReportRepository,
    transactionRepo,
    paymentRepo
)

const pretripController = new PretripController(pretripService, mechanicProfileService)


router.get('/weekly-schedules', pretripController.weeklySchedules.bind(pretripController));
router.get('/:id/details', pretripController.workDetails.bind(pretripController));
router.patch('/update-status', pretripController.updateStatus.bind(pretripController));
router.post('/create-report', pretripController.createReport.bind(pretripController));




export default router



import { AuthController } from "../controllers/mechanic/authController"
import { LiveAssistanceController } from "../controllers/mechanic/liveAssistController"
import { PageController } from "../controllers/mechanic/pageController"
import { PretripController } from "../controllers/mechanic/pretripController"
import { ProfileController } from "../controllers/mechanic/profileController"
import { ServicesController } from "../controllers/mechanic/roadsideController"
import { GoogleMapRepository } from "../repositories/mapRepository"
import { LiveAsistanceRepository } from "../repositories/liveAssistanceRepository"
import { MechanicProfileRepository } from "../repositories/mechanicProfileRepository"
import { MechanicRepository } from "../repositories/mechanicRepository"
import { NotificationRepository } from "../repositories/notificationRepository"
import { OtpRepository } from "../repositories/otpRepository"
import { PaymentRepository } from "../repositories/paymentsRepository"
import { PretripBookingRepository } from "../repositories/pretripBookingRepository"
import { PretripPlanRepository } from "../repositories/pretripPlanRepository"
import { PretripReportRepository } from "../repositories/pretripReportRepository"
import { QuotationRepository } from "../repositories/quotationRepository"
import { RoadsideAssistanceRepository } from "../repositories/roadsideAssistanceRepo"
import { TimeBlockRepository } from "../repositories/timeBlockRepository"
import { TransactionRepository } from "../repositories/transactionsRepository"
import { WorkingHoursRepository } from "../repositories/workingHoursRepository"
import { AuthService } from "../services/auth/mechanic/authService"
import { GoogleAuthService } from "../services/auth/mechanic/googleAuthService"
import { HashService } from "../services/hash/hashService"
import { LiveAssistanceService } from "../services/liveAssistanceService/liveAssistanceService"
import { MechanicRegistrationService } from "../services/mechanic/mechanicRegistrationService"
import { PageService } from "../services/mechanic/pageService"
import { ProfileService } from "../services/mechanic/profileService"
import { OtpService } from "../services/otp/otpService"
import { PretripService } from "../services/pretripCheckup/pretripService"
import { RoadsideService } from "../services/roadsideAssistance/roadsideService"
import { TokenService } from "../services/token/tokenService"
import { RatingRepository } from "../repositories/ratingRepository"

const hashService = new HashService()
const tokenService = new TokenService()
const mechanicRepository = new MechanicRepository()
const otpRepository = new OtpRepository()
const ratingRepo = new RatingRepository()
const mechanicProfileRepository = new MechanicProfileRepository()
const otpService = new OtpService(otpRepository, hashService)
const authService = new AuthService(hashService, tokenService, mechanicRepository, otpService, mechanicProfileRepository)
const mechanicRegistration = new MechanicRegistrationService(mechanicRepository)
const googleAuth = new GoogleAuthService(mechanicRepository, tokenService)
const timeBlockRepo = new TimeBlockRepository()
const workingHoursRepo = new WorkingHoursRepository()
const liveAsistanceRepository = new LiveAsistanceRepository()
const liveAssistanceService = new LiveAssistanceService(workingHoursRepo,timeBlockRepo,liveAsistanceRepository)
const notificationRepository = new NotificationRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const pretripBookingRepository = new PretripBookingRepository()
const transactionRepo = new TransactionRepository()
const pageService = new PageService(mechanicProfileRepository,notificationRepository,roadsideAssistanceRepo,pretripBookingRepository,transactionRepo,ratingRepo)
const googleMapRepo = new GoogleMapRepository()
const pretripPlanRepository = new PretripPlanRepository()
const pretripReportRepository = new PretripReportRepository()
const mechanicProfileService = new ProfileService( mechanicProfileRepository, mechanicRepository,notificationRepository, workingHoursRepo,timeBlockRepo,ratingRepo)
const paymentRepo = new PaymentRepository()
const pretripService = new PretripService( mechanicProfileRepository,googleMapRepo,pretripBookingRepository,pretripPlanRepository,workingHoursRepo,timeBlockRepo, pretripReportRepository, transactionRepo, paymentRepo,mechanicProfileRepository,ratingRepo)
const quotationRepo = new QuotationRepository()
const roadsideService = new RoadsideService(roadsideAssistanceRepo,quotationRepo,mechanicProfileRepository,transactionRepo,paymentRepo)




export const authController = new AuthController(authService, otpService, tokenService, mechanicRegistration, googleAuth)
export const liveAssistanceController = new LiveAssistanceController(liveAssistanceService)
export const pageController = new PageController(pageService)
export const pretripController = new PretripController(pretripService, mechanicProfileService)
export const mechProfileController = new ProfileController(mechanicProfileService)
export const servicesController = new ServicesController(roadsideService)










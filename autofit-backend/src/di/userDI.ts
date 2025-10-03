import { AuthController } from "../controllers/user/authController";
import { CheckoutController } from "../controllers/user/checkoutController";
import { LiveAssistanceController } from "../controllers/user/liveAssistanceController";
import { PretripController } from "../controllers/user/pretripController";
import { ProfileController } from "../controllers/user/profileController";
import { ServicesController } from "../controllers/user/servicesController";
import { VehicleController } from "../controllers/user/vehicleController";
import { GoogleMapRepository } from "../repositories/mapRepository";
import { LiveAsistanceRepository } from "../repositories/liveAssistanceRepository";
import { MechanicProfileRepository } from "../repositories/mechanicProfileRepository";
import { NotificationRepository } from "../repositories/notificationRepository";
import { OtpRepository } from "../repositories/otpRepository";
import { PaymentRepository } from "../repositories/paymentsRepository";
import { PretripBookingRepository } from "../repositories/pretripBookingRepository";
import { PretripFeatureRepository } from "../repositories/pretripFeatureRepository";
import { PretripPlanRepository } from "../repositories/pretripPlanRepository";
import { PretripReportRepository } from "../repositories/pretripReportRepository";
import { QuotationRepository } from "../repositories/quotationRepository";
import { RoadsideAssistanceRepository } from "../repositories/roadsideAssistanceRepo";
import { TimeBlockRepository } from "../repositories/timeBlockRepository";
import { TransactionRepository } from "../repositories/transactionsRepository";
import { UserRepository } from "../repositories/userRepository";
import { VehicleBrandRepository } from "../repositories/vehicleBrandRepository";
import { VehicleRepository } from "../repositories/vehicleRepository";
import { WorkingHoursRepository } from "../repositories/workingHoursRepository";
import { AuthService } from "../services/auth/user/authService";
import { GoogleAuthService } from "../services/auth/user/googleAuthService";
import { HashService } from "../services/hash/hashService";
import { LiveAssistanceService } from "../services/liveAssistanceService/liveAssistanceService";
import { OtpService } from "../services/otp/otpService";
import { RazorpayGateway } from "../services/paymentServices/paymentGateways/razorpayGateway";
import { PaymentGatewayResolver } from "../services/paymentServices/resolvers/paymentGatewayResolver";
import { ServicePaymentHandleResolver } from "../services/paymentServices/resolvers/servicePaymentHandleResolver";
import { LiveAssistancePaymentHandler } from "../services/paymentServices/servicePaymentHandler/liveAssistancePaymentHandler";
import { PretripPaymentHandler } from "../services/paymentServices/servicePaymentHandler/PretripPaymentHandler";
import { PretripPlanService } from "../services/pretripCheckup/PretripPlanService";
import { PretripService } from "../services/pretripCheckup/pretripService";
import { RoadsideService } from "../services/roadsideAssistance/roadsideService";
import { UserRoadsideService } from "../services/roadsideAssistance/userRoadsideService";
import { TokenService } from "../services/token/tokenService";
import { CheckoutService } from "../services/user/checkoutService";
import { UserProfileService } from "../services/user/userProfileService";
import { UserRegistrationService } from "../services/user/userRegistrationService";
import { VehicleService } from "../services/vehicle/vehicleService";
import { PaymentGateway } from "../types/payment";
import { ServiceType } from "../types/services";
import { RoadsidePaymentHandler } from "../services/paymentServices/servicePaymentHandler/roadsidePaymentHandler";
import { RatingRepository } from "../repositories/ratingRepository";
import { NotificationService } from "../services/notifications/notificationService";




const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const tokenService = new TokenService();
const hashService = new HashService();
const ratingRepo = new RatingRepository()
const notificationRepository = new NotificationRepository()
const notificationService = new NotificationService(notificationRepository)
const otpService = new OtpService(otpRepository, hashService);
const authService = new AuthService(userRepository, otpService, tokenService, hashService);
const googleAuthService = new GoogleAuthService(userRepository, tokenService);
const userRegistrationService = new UserRegistrationService(userRepository);
const pretripBookingRepository = new PretripBookingRepository()
const razorpayGateway = new RazorpayGateway()
const paymentGatewayResolver = new PaymentGatewayResolver([{ name: PaymentGateway.RAZORPAY, instance: razorpayGateway }]);
const paymentRepository = new PaymentRepository()
const liveAssistanceRepo = new LiveAsistanceRepository()
const timeBlockingRepository = new TimeBlockRepository()
const transactionRepo = new TransactionRepository()
const quotationRepo = new QuotationRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const pretripPaymentHandler = new PretripPaymentHandler(pretripBookingRepository, paymentRepository, timeBlockingRepository, notificationService);
const liveAssistancePaymentHandler = new LiveAssistancePaymentHandler(liveAssistanceRepo, paymentRepository, timeBlockingRepository, transactionRepo, notificationService)
const roadsidePaymentHandler = new RoadsidePaymentHandler(roadsideAssistanceRepo, paymentRepository, quotationRepo, notificationService)
const servicePaymentHanleResolver = new ServicePaymentHandleResolver([
    { type: ServiceType.PRETRIP, handler: pretripPaymentHandler },
    { type: ServiceType.LIVE, handler: liveAssistancePaymentHandler },
    { type: ServiceType.ROADSIDE, handler: roadsidePaymentHandler }
]);
const checkoutService = new CheckoutService(pretripBookingRepository, paymentGatewayResolver, servicePaymentHanleResolver, paymentRepository, liveAssistanceRepo, roadsideAssistanceRepo)
const workingHoursRepository = new WorkingHoursRepository()
const liveAssistanceService = new LiveAssistanceService(workingHoursRepository, timeBlockingRepository, liveAssistanceRepo, notificationService)
const pretripPlanRepository = new PretripPlanRepository()
const pretripFeaterRepository = new PretripFeatureRepository()
const pretripPlanService = new PretripPlanService(pretripFeaterRepository, pretripPlanRepository);
const mechanicProfileRepository = new MechanicProfileRepository()
const googleMapRepo = new GoogleMapRepository()
const pretripReportRepository = new PretripReportRepository()
const pretripService = new PretripService(mechanicProfileRepository, googleMapRepo, pretripBookingRepository,
    pretripPlanRepository, workingHoursRepository, timeBlockingRepository, pretripReportRepository, transactionRepo,
    paymentRepository, mechanicProfileRepository, ratingRepo, notificationService)
const profileService = new UserProfileService(userRepository, roadsideAssistanceRepo, pretripBookingRepository,
    liveAssistanceRepo, hashService, ratingRepo)
const vehicleRepository = new VehicleRepository()
const roadsideService = new RoadsideService(roadsideAssistanceRepo, quotationRepo, mechanicProfileRepository, transactionRepo, paymentRepository, notificationService)
const roadsideAssistanceService = new UserRoadsideService(mechanicProfileRepository, googleMapRepo, roadsideAssistanceRepo, vehicleRepository, notificationRepository, timeBlockingRepository, ratingRepo, notificationService)
const vehicleBrands = new VehicleBrandRepository()
const vehicleService = new VehicleService(vehicleRepository, vehicleBrands)


//user controllers
export const authController = new AuthController(authService, userRegistrationService, googleAuthService, tokenService, otpService);
export const checkoutcontroller = new CheckoutController(checkoutService)
export const liveAssistanceController = new LiveAssistanceController(liveAssistanceService)
export const pretripController = new PretripController(pretripPlanService, pretripService)
export const profileController = new ProfileController(profileService, notificationService)
export const servicesController = new ServicesController(roadsideAssistanceService, roadsideService)
export const vehicleController = new VehicleController(vehicleService);





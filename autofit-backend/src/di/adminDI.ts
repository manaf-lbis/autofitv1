import { AdminAuthController } from "../controllers/admin/authController"
import { MechanicController } from "../controllers/admin/mechanicController"
import { PretripController } from "../controllers/admin/pretripController"
import { UserController } from "../controllers/admin/userController"
import { AdminRepository } from "../repositories/adminRepository"
import { MechanicProfileRepository } from "../repositories/mechanicProfileRepository"
import { MechanicRepository } from "../repositories/mechanicRepository"
import { NotificationRepository } from "../repositories/notificationRepository"
import { PretripFeatureRepository } from "../repositories/pretripFeatureRepository"
import { PretripPlanRepository } from "../repositories/pretripPlanRepository"
import { TimeBlockRepository } from "../repositories/timeBlockRepository"
import { UserRepository } from "../repositories/userRepository"
import { VehicleRepository } from "../repositories/vehicleRepository"
import { WorkingHoursRepository } from "../repositories/workingHoursRepository"
import { MechanicService } from "../services/admin/mechanicSevice"
import { UserServices } from "../services/admin/userServices"
import { AdminAuthService } from "../services/auth/admin/authService"
import { AdminGoogleAuthService } from "../services/auth/admin/googleAuthService"
import { HashService } from "../services/hash/hashService"
import { ProfileService } from "../services/mechanic/profileService"
import { PretripPlanService } from "../services/pretripCheckup/PretripPlanService"
import { TokenService } from "../services/token/tokenService"

const adminRepository = new AdminRepository()
const hashService = new HashService()
const tokenService = new TokenService()
const adminAuthService = new AdminAuthService(adminRepository,hashService,tokenService)
const googleAuthService = new AdminGoogleAuthService(adminRepository,tokenService)
const mechanicProfileRepository = new MechanicProfileRepository()
const mechanicRepository = new MechanicRepository()
const mechanicService = new MechanicService(mechanicRepository, mechanicProfileRepository)
const notificationRepository = new NotificationRepository()
const workingHoursRepository = new WorkingHoursRepository()
const timeBlockingRepo = new TimeBlockRepository()
const profileService = new ProfileService( mechanicProfileRepository,mechanicRepository,notificationRepository,workingHoursRepository,timeBlockingRepo)
const pretripFeatureRepository = new PretripFeatureRepository()
const pretripPlanRepository = new PretripPlanRepository()
const pretripPlanService = new PretripPlanService(pretripFeatureRepository,pretripPlanRepository)
const userRepository = new UserRepository()
const vehicleRepository = new VehicleRepository()
const userServices = new UserServices(userRepository, vehicleRepository)



export const userController = new UserController(userServices)
export const pretripController = new PretripController(pretripPlanService)
export const mechanicController = new MechanicController(mechanicService, profileService)
export const authController = new AdminAuthController(adminAuthService,googleAuthService)
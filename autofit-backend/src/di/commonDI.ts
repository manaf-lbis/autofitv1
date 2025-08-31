import { AssetsController } from "../controllers/common/assetsController";
import { ChatController } from "../controllers/common/chatController";
import { AdminRepository } from "../repositories/adminRepository";
import { ChatRepository } from "../repositories/chatRepository";
import { OtpRepository } from "../repositories/otpRepository";
import { RoadsideAssistanceRepository } from "../repositories/roadsideAssistanceRepo";
import ResetPasswordService from "../services/auth/common/resetPasswordService";
import { UserRepository } from "../repositories/userRepository";
import { AssetsService } from "../services/assets/assetsService";
import { ChatService } from "../services/chat/chatService";
import { HashService } from "../services/hash/hashService";
import { OtpService } from "../services/otp/otpService";
import { TokenService } from "../services/token/tokenService";
import { ResetPasswordController } from "../controllers/common/resetPassword";

const assetsService = new AssetsService();
const chatRepository = new ChatRepository();
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const chatService = new ChatService(chatRepository, roadsideAssistanceRepo);
const userRepository = new UserRepository()
const adminRepository = new AdminRepository()
const otpRepository = new OtpRepository()
const hashService =  new HashService()
const otpService = new OtpService(otpRepository,hashService)
const resetPasswordService = new ResetPasswordService(userRepository,adminRepository,otpService,hashService)
const tokenService = new TokenService()




export const resetPasswordController = new  ResetPasswordController(resetPasswordService,otpService,tokenService)
export const chatController = new ChatController(chatService);
export const assetsController = new AssetsController(assetsService);

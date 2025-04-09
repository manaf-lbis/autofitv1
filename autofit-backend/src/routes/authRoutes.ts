import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/auth/authService";
import { UserRepository } from "../repositories/userRepository";
import { OtpRepository } from "../repositories/otpRepository";
import { OtpService } from "../services/otp/otpService";
import { TokenService } from "../services/token/tokenService";
import { HashService } from "../services/hash/hashService";
import { authenticate } from "../middlewares/authenticate";
import { UserRegistrationService } from "../services/user/userRegistrationService";



const userRepository = new UserRepository();
const otpService = new OtpService()
const otpRepository = new OtpRepository()
const tokenService = new TokenService()
const hashService = new HashService()

const authService = new AuthService(userRepository,
    otpService,
    otpRepository,
    tokenService,
    hashService,
);
const userRegistrationService = new UserRegistrationService(userRepository)
const authController = new AuthController(authService,userRegistrationService);



const router = Router();

router.post('/user/login', (req, res, next) => authController.login(req, res, next))
router.post('/user/signup', (req, res, next) => authController.signup(req, res,next))

router.post('/user/verify-otp',authenticate, (req,res, next)=>authController.verifyOtp(req,res,next) )

export default router;
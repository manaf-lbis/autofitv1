import { Router } from "express";
import { AuthController } from "../../controllers/mechanic/authController";
import { AuthService } from "../../services/auth/mechanic/authService";
import { HashService } from "../../services/hash/hashService";
import { TokenService } from "../../services/token/tokenService";
import { MechanicRepository } from "../../repositories/mechanicRepository";
import { authorize } from "../../middlewares/authorize";
import { authenticate } from "../../middlewares/authenticate";
import { OtpService } from "../../services/otp/otpService";
import { OtpRepository } from "../../repositories/otpRepository";
import { MechanicRegistrationService } from "../../services/mechanic/mechanicRegistrationService";
import { GoogleAuthService } from "../../services/auth/mechanic/googleAuthService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";



const router = Router();
const hashService = new HashService()
const tokenService = new TokenService()
const mechanicRepository = new MechanicRepository()
const otpRepository = new OtpRepository()
const mechanicProfileRepository = new MechanicProfileRepository()
const otpService = new OtpService(otpRepository, hashService,)
const authService = new AuthService(hashService, tokenService, mechanicRepository, otpService, mechanicProfileRepository)
const mechanicRegistration = new MechanicRegistrationService(mechanicRepository)
const googleAuth = new GoogleAuthService(mechanicRepository, tokenService)
const authController = new AuthController(authService, otpService, tokenService, mechanicRegistration, googleAuth)



router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/verify-otp', authenticate, authController.verifyOtp.bind(authController));
router.post('/google/callback', authController.googleCallback.bind(authController));
router.post('/logout',authenticate, authController.logout.bind(authController));
router.post('/resent-otp', authenticate, authController.resentOtp.bind(authController));
router.get('/me', authenticate, authorize(['mechanic']), authController.getUser.bind(authController));
router.post("/refresh", authController.refreshToken.bind(authController));



export default router


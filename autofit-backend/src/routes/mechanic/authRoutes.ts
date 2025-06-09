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



router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/signup', (req, res, next) => authController.signup(req, res, next));
router.post('/verify-otp', authenticate, (req, res, next) => authController.verifyOtp(req, res, next));
router.post('/google/callback', (req, res, next) => authController.googleCallback(req, res, next));

router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.post('/resent-otp', authenticate, (req, res, next) => authController.resentOtp(req, res, next));



router.get('/me', authenticate, authorize(['mechanic']), (req, res, next) => authController.getUser(req, res, next))
router.post("/refresh",authenticate, (req, res, next) => authController.refreshToken(req, res, next));



export default router


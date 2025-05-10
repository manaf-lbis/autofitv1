import { Router } from "express";
import { AuthController } from "../../controllers/user/authController";
import { AuthService } from "../../services/auth/user/authService";
import { UserRepository } from "../../repositories/userRepository";
import { OtpRepository } from "../../repositories/otpRepository";
import { OtpService } from "../../services/otp/otpService";
import { TokenService } from "../../services/token/tokenService";
import { HashService } from "../../services/hash/hashService";
import { authenticate } from "../../middlewares/authenticate";
import { UserRegistrationService } from "../../services/user/userRegistrationService";
import { GoogleAuthService } from "../../services/auth/user/googleAuthService";



const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const tokenService = new TokenService();
const hashService = new HashService();
const otpService = new OtpService(otpRepository,hashService);
const authService = new AuthService(userRepository,
    otpService,
    otpRepository,
    tokenService,
    hashService,
);
const googleAuthService = new GoogleAuthService(userRepository, tokenService);
const userRegistrationService = new UserRegistrationService(userRepository);
const authController = new AuthController(authService,
    userRegistrationService,
    googleAuthService,
    tokenService,
    otpService
);


const router = Router();


router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/signup', (req, res, next) => authController.signup(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.getUser(req, res, next));
router.post('/google/callback', (req, res, next) => authController.googleCallback(req, res, next));
router.post('/verify-otp', authenticate, (req, res, next) => authController.verifyOtp(req, res, next));
router.post('/logout',(req,res,next)=> authController.logout(req,res,next));
router.post('/resent-otp', authenticate, (req, res, next) => authController.resentOtp(req, res, next));


router.post("/refresh", (req, res, next) => authController.refreshToken(req, res, next));


export default router;
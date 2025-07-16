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
import { authorize } from "../../middlewares/authorize";



const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const tokenService = new TokenService();
const hashService = new HashService();
const otpService = new OtpService(otpRepository, hashService);
const authService = new AuthService(userRepository, otpService, tokenService, hashService);
const googleAuthService = new GoogleAuthService(userRepository, tokenService);
const userRegistrationService = new UserRegistrationService(userRepository);
const authController = new AuthController(authService,
    userRegistrationService,
    googleAuthService,
    tokenService,
    otpService,
);


const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.get('/me', authenticate, authorize(['user']), authController.getUser.bind(authController));
router.post('/google/callback', authController.googleCallback.bind(authController));
router.post('/verify-otp', authenticate, authController.verifyOtp.bind(authController));
router.post('/logout',authenticate, authController.logout.bind(authController));
router.post('/resent-otp', authenticate, authController.resentOtp.bind(authController));
router.get('/allusers', authenticate, authController.allusers.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

export default router;




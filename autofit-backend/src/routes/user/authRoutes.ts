import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { authController } from "../../di/userDI";
import { authenticate } from "../../middlewares/authenticate";



const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.get('/me', authenticate, authorize(['user']), authController.getUser.bind(authController));
router.post('/google/callback', authController.googleCallback.bind(authController));
router.post('/verify-otp', authenticate, authController.verifyOtp.bind(authController));
router.post('/logout', authenticate, authController.logout.bind(authController));
router.post('/resent-otp', authenticate, authController.resentOtp.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

export default router;




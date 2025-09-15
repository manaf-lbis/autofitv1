import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { authController } from "../../di/mechnaicDI";




const router = Router();




router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/verify-otp', authenticate, authController.verifyOtp.bind(authController));
router.post('/google/callback', authController.googleCallback.bind(authController));
router.post('/logout',authenticate, authController.logout.bind(authController));
router.post('/resent-otp', authenticate, authController.resentOtp.bind(authController));
router.get('/me', authenticate, authorize(['mechanic']), authController.getUser.bind(authController));
router.post("/refresh", authController.refreshToken.bind(authController));



export default router


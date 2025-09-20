import { Router } from "express";
import { resetPasswordController } from "../../di/commonDI";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";



const router = Router({ mergeParams: true })


router.post('/',authenticate,authorize(['user','mechanic','admin']),resetPasswordController.resetPassword.bind(resetPasswordController))
router.post('/verify-email',resetPasswordController.verifyEmailandSentOtp.bind(resetPasswordController))
router.post('/verify-otp',resetPasswordController.verifyOtp.bind(resetPasswordController))
router.post('/resent-otp',resetPasswordController.resentOtp.bind(resetPasswordController))
router.post('/updatePassword',resetPasswordController.updatePassword.bind(resetPasswordController))

export default router
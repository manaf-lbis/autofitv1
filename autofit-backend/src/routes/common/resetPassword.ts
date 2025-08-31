import { Router } from "express";
import { resetPasswordController } from "../../di/commonDI";



const router = Router({ mergeParams: true })


router.post('/verify-email',resetPasswordController.verifyEmailandSentOtp.bind(resetPasswordController))
router.post('/verify-otp',resetPasswordController.verifyOtp.bind(resetPasswordController))
router.post('/resent-otp',resetPasswordController.resentOtp.bind(resetPasswordController))
router.post('/updatePassword',resetPasswordController.updatePassword.bind(resetPasswordController))

export default router
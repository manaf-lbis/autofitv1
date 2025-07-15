import { Router } from "express";
import ResetPasswordController from "../../controllers/common/resetPassword";
import ResetPasswordService from "../../services/auth/common/resetPasswordService";
import { OtpService } from "../../services/otp/otpService";
import { UserRepository } from "../../repositories/userRepository";
import { AdminRepository } from "../../repositories/adminRepository";
import { OtpRepository } from "../../repositories/otpRepository";
import { HashService } from "../../services/hash/hashService";
import { TokenService } from "../../services/token/tokenService";


const userRepository = new UserRepository()
const adminRepository = new AdminRepository()
const otpRepository = new OtpRepository()
const hashService =  new HashService()
const otpService = new OtpService(otpRepository,hashService)
const resetPasswordService = new ResetPasswordService(userRepository,adminRepository,otpService,hashService)
const tokenService = new TokenService()
const resetPasswordController = new  ResetPasswordController(resetPasswordService,otpService,tokenService)


const router = Router({ mergeParams: true })

router.post('/verify-email',(req,res,next)=>resetPasswordController.verifyEmailandSentOtp(req,res,next))
router.post('/verify-otp',(req,res,next)=>resetPasswordController.verifyOtp(req,res,next))
router.post('/resent-otp',(req,res,next)=>resetPasswordController.resentOtp(req,res,next))
router.post('/updatePassword',(req,res,next)=>resetPasswordController.updatePassword(req,res,next))

export default router
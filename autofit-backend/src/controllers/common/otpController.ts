import ResetPasswordService from "../../services/auth/common/resetPassword";
import { Request, Response, NextFunction } from "express";
import { Role } from "../../types/role";
import { ApiError } from "../../utils/apiError";
import { OtpService } from "../../services/otp/otpService";
import { emailValidation } from "../../validation/authValidation";
import { sendSuccess } from "../../utils/apiResponse";


class ResetPassword {
    constructor(
        private resetPasswordService: ResetPasswordService,
        private otpService: OtpService
    ) { }

   

    // async verifyOtp(req:Request,res:Response,next:NextFunction){
    //     try {
    //         const {otp,email} = req.body;
    //         this.resetPasswordService



            
    //     } catch (error) {
    //         next(error)
    //     }
    // }



}

export default ResetPassword
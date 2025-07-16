import ResetPasswordService from "../../services/auth/common/resetPasswordService";
import { Request, Response, NextFunction } from "express";
import { Role } from "../../types/role";
import { ApiError } from "../../utils/apiError";
import { OtpService } from "../../services/otp/otpService";
import { emailValidation } from "../../validation/authValidation";
import { sendSuccess } from "../../utils/apiResponse";
import { TokenService } from "../../services/token/tokenService";
import { CustomJwtPayload } from "../../types/express";
import { HttpStatus } from "../../types/responseCode";


class ResetPassword {
    constructor(
        private _resetPasswordService: ResetPasswordService,
        private _otpService: OtpService,
        private _tokenService: TokenService
    ) { }

    async verifyEmailandSentOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body
            const { role } = req.params

            // if (!['user', 'admin', 'mechanic'].includes(role)) {
            //     throw new ApiError('Invalid Role', HttpStatus.BAD_REQUEST)
            // }

            if (!Object.values(Role).includes(role as Role)) {
                throw new ApiError('Invalid Role', HttpStatus.BAD_REQUEST);
            }

            emailValidation.parse({ email })
            const user = await this._resetPasswordService.verifyEmail(email, role as Role);
            await this._resetPasswordService.saveAndSentOtp(email, role as Role)

            const token = this._tokenService.generateAccessToken({ email, role, otpResent : 0, _id:user._id })


            res.cookie('resetToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: Number(process.env.RESET_COOKIE_MAX_AGE)
            });

            sendSuccess(res, 'OTP Sent Successfully', { email })

        } catch (error) {
            next(error)
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.resetToken;

            if (!token) throw new ApiError('Invalid Token, Verify Email Again');
            const validToken = this._tokenService.verifyToken(token);
            if (!validToken) throw new ApiError('Invalid Token, Verify Email Again');

            const { otp } = req.body;

            if (otp.length !== 6) throw new ApiError('Invalid Otp')

            await this._otpService.verifyOtp(otp, validToken.email);

            sendSuccess(res, 'OTP Verified', null)

        } catch (error) {
            next(error)
        }
    }

    async resentOtp(req: Request, res: Response, next: NextFunction){
        try {
            
            const resetToken = req.cookies.resetToken;

            if (!resetToken) throw new ApiError('Invalid Token, Verify Email Again');
            const validToken = this._tokenService.verifyToken(resetToken);
          
            const { role } = req.params

            // if (!['user', 'admin', 'mechanic'].includes(role)) {
            //     throw new ApiError('Invalid Role', HttpStatus.BAD_REQUEST)
            // }
            if (!Object.values(Role).includes(role as Role)) {
                throw new ApiError('Invalid Role', HttpStatus.BAD_REQUEST);
            }

            const {email,otpResent}:CustomJwtPayload = validToken

            if(typeof otpResent !== 'number' || !email) throw new ApiError('Invalid Token, Verify Email Again');

            if(otpResent >= 3 ) throw new ApiError('Attempt Exhausted try after 5 min');
            

            emailValidation.parse({ email })
            
            await this._resetPasswordService.verifyEmail(email, role as Role);

            await this._resetPasswordService.saveAndSentOtp(email, role as Role)

            const token = this._tokenService.generateAccessToken({ email, role, otpResent:otpResent+1 })

            res.cookie('resetToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: Number(process.env.RESET_COOKIE_MAX_AGE)
            });
            

            sendSuccess(res, 'OTP Resent', { email })

        } catch (error) {
            next(error)
        }

    }

    async updatePassword(req: Request, res: Response, next: NextFunction){
        try {
            const {password} = req.body;

            if(password.trim().length <6 ) throw new ApiError('invalid password');

            const resetToken = req.cookies.resetToken;

            if (!resetToken) throw new ApiError('Invalid Token, Verify Email Again');
            const validToken = this._tokenService.verifyToken(resetToken);
          
            const { role } = req.params

            // if (!['user', 'admin', 'mechanic'].includes(role)) {
            //     throw new ApiError('Invalid Role', HttpStatus.BAD_REQUEST)
            // }

            if (!Object.values(Role).includes(role as Role)) {
                throw new ApiError('Invalid Role', HttpStatus.BAD_REQUEST);
            }

            const {_id,email,} = validToken

           await this._resetPasswordService.updatePassword(email,password,role as Role,_id)

           sendSuccess(res,'Password Updated Successfully')

            
        } catch (error) {
            next(error)
        }
    }

}

export default ResetPassword
import { Request, Response, NextFunction } from "express";
import { loginValidation, signupValidation } from "../../validation/authValidation";
import { sendSuccess } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { CustomJwtPayload } from "../../types/express";
import { Role } from "../../types/role";
import { HttpStatus } from "../../types/responseCode";
import { IAuthService } from "../../services/auth/mechanic/interface/IAuthService";
import { IOtpService } from "../../services/otp/IOtpService";
import { ITokenService } from "../../services/token/ITokenService";
import { IMechanicRegistrationService } from "../../services/mechanic/interface/IMechanicRegistrationService";
import { IGoogleAuthService } from "../../services/auth/mechanic/interface/IGoogleAuthService";
import { ZodError } from "zod";

export class AuthController {
    constructor(
        private _authService: IAuthService,
        private _otpService: IOtpService,
        private _tokenService: ITokenService,
        private _mechanicRegistrationService: IMechanicRegistrationService,
        private _googleAuthService: IGoogleAuthService

    ) { }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            loginValidation.parse({ email, password });

            const result = await this._authService.login(email, password);

            res.cookie('jwt', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: Number(process.env.JWT_COOKIE_MAX_AGE)
            });

            sendSuccess(res, 'Login Successful', result.user);

        } catch (error: any) {
            console.log('here');
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

            if (!token) {
                throw new ApiError("No token provided", HttpStatus.UNAUTHORIZED);
            }

            const decoded = this._tokenService.verifyToken(token, true);
            const userId = decoded.id;

            const result = await this._authService.refreshAccessToken(userId);

            console.log('token refreshed');

            res.cookie("jwt", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: '/',
                maxAge: Number(process.env.JWT_COOKIE_MAX_AGE)
            });

            sendSuccess(res, "Token refreshed");
        } catch (error: any) {
            next(error);
        }
    }



    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, email, password, mobile } = req.body;
            signupValidation.parse({ name, mobile, password, email });

            const result = await this._authService.signup(name.toLowerCase(), email, password, mobile);

            res.cookie('jwt', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: Number(process.env.SIGNUP_COOKIE_MAX_AGE)
            });
            sendSuccess(res, result.message)

        } catch (error: any) {
            if (error instanceof ZodError) {
                next(new ApiError(error.issues[0].message, HttpStatus.BAD_REQUEST));
                return
            }
            next(error);
        }
    }

    async verifyOtp(req: Request & { user?: CustomJwtPayload }, res: Response, next: NextFunction): Promise<void> {
        try {

            const { otp } = req.body;

            if (!otp) {
                throw new ApiError('Invalid OTP', HttpStatus.BAD_REQUEST)
            }

            if (!req.user) {
                throw new ApiError('Unauthorized No token', HttpStatus.UNAUTHORIZED)
            }

            const { email, password, mobile, name, role } = req.user;

            if (!email || !password || !mobile || !name) {
                throw new Error('Missing required user data in token');
            }

            await this._otpService.verifyOtp(otp, email)

            const { _id } = await this._mechanicRegistrationService.registerUser({
                name,
                email,
                password,
                mobile,
                role: role || Role.MECHANIC
            });
            const token = this._tokenService.generateAccessToken({ id: _id, role })

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: Number(process.env.JWT_COOKIE_MAX_AGE)
            });

            sendSuccess(res, 'OTP verified successfully', { name, role })

        } catch (error: any) {
            next(error);
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req?.user?.id) {
                throw new ApiError("Not authenticated!", HttpStatus.UNAUTHORIZED);
            }

            const data = await this._authService.getUser(req.user.id)

            sendSuccess(res, 'user Active', data)

        } catch (error) {
            next(error)
        }
    }

    async resentOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized No token" });
                return;
            }

            const { email, role } = req.user;

            if (!email) {
                throw new Error('Missing required user data in token');
            }

            await this._otpService.saveAndResentOtp(email, role as Role)

            sendSuccess(res, 'Resent Success')

        } catch (error: any) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;

            if (!userId) throw new ApiError("Not authenticated!", HttpStatus.BAD_REQUEST);

            await this._authService.logout(userId);
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/'
            });

            sendSuccess(res, 'Logout Successfully')

        } catch (error) {
            next(error)
        }
    }

    async googleCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { code } = req.body;
            const result = await this._googleAuthService.googleAuth({ code })

            res.cookie('jwt', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: Number(process.env.JWT_COOKIE_MAX_AGE)
            });

            sendSuccess(res, 'Login Success', result.user)

        } catch (error) {
            next(error)
        }
    }

}
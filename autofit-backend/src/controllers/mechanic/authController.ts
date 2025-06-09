import { Request, Response, NextFunction } from "express";
import { loginValidation, signupValidation } from "../../validation/authValidation";
import { sendSuccess } from "../../utils/apiResponse";
import { AuthService } from "../../services/auth/mechanic/authService";
import { ApiError } from "../../utils/apiError";
import { CustomJwtPayload } from "../../types/express";
import { OtpService } from "../../services/otp/otpService";
import { TokenService } from "../../services/token/tokenService";
import { MechanicRegistrationService } from "../../services/mechanic/mechanicRegistrationService";
import { Role } from "../../types/role";
import { GoogleAuthService } from "../../services/auth/mechanic/googleAuthService";

export class AuthController {
    constructor(
        private authService: AuthService,
        private otpService: OtpService,
        private tokenService: TokenService,
        private mechanicRegistrationService: MechanicRegistrationService,
        private googleAuthService: GoogleAuthService

    ) { }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            loginValidation.parse({ email, password });

            const result = await this.authService.login(email, password);

            res.cookie('jwt', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            sendSuccess(res, 'Login Successful', result.user);
        } catch (error: any) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

            if (!token) {
                throw new ApiError("No token provided", 401);
            }

            const decoded = this.tokenService.verifyToken(token, true);
            const userId = decoded.id;

            const result = await this.authService.refreshAccessToken(userId);

            console.log('token refreshed');

            res.cookie("jwt", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
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

            const result = await this.authService.signup(name, email, password, mobile);

            res.cookie('jwt', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 60 * 60 * 1000
            });
            sendSuccess(res, result.message)

        } catch (error: any) {
            next(error);
        }
    }

    async verifyOtp(req: Request & { user?: CustomJwtPayload }, res: Response, next: NextFunction): Promise<void> {
        try {

            const { otp } = req.body;

            if (!otp) {
                throw new ApiError('Invalid OTP', 401)
            }

            if (!req.user) {
                throw new ApiError('Unauthorized No token', 401)
            }

            const { email, password, mobile, name, role } = req.user;

            if (!email || !password || !mobile || !name) {
                throw new Error('Missing required user data in token');
            }

            await this.otpService.verifyOtp(otp, email)

            const { _id } = await this.mechanicRegistrationService.registerUser({
                name,
                email,
                password,
                mobile,
                role: role || 'mechanic'
            });
            const token = this.tokenService.generateToken({ id: _id, role })

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            sendSuccess(res, 'OTP verified successfully', { name, role }, 200)

        } catch (error: any) {
            next(error);
        }
    }

    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req?.user?.id) {
                throw new ApiError("Not authenticated!", 401)
            }

            const data = await this.authService.getUser(req.user.id)

            sendSuccess(res, 'user Active', data)

        } catch (error) {
            next(error)
        }
    }

    async resentOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            if (!req.user) {
                res.status(401).json({ message: "Unauthorized No token" });
                return;
            }

            const { email, role } = req.user;

            if (!email) {
                throw new Error('Missing required user data in token');
            }

            await this.otpService.saveAndResentOtp(email, role as Role)

            sendSuccess(res, 'Resent Success')

        } catch (error: any) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
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
            const result = await this.googleAuthService.googleAuth({ code })

            res.cookie('jwt', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            sendSuccess(res, 'Login Success', result.user)

        } catch (error) {
            next(error)
        }
    }

}
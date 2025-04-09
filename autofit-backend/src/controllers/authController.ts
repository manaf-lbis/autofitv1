import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth/authService";
import { loginValidation, signupValidation } from "../validation/authValidation";
import { UserRegistrationService } from "../services/user/userRegistrationService";
import { CustomJwtPayload } from "../types/express/index";
import { sendSuccess, StatusCode } from "../utils/apiResponse";

export class AuthController {
    constructor(
        private authService: AuthService,
        private userRegistrationService: UserRegistrationService
    ) {}

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            loginValidation.parse({ email, password });

            const result = await this.authService.login(email, password);

            res.cookie('jwt', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000
            });

            sendSuccess(res,'Login SuccessFull',result.user)

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
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000
            });
            sendSuccess(res,result.message)

        } catch (error: any) {
            next(error);
        }
    }

    async verifyOtp(req: Request & { user?: CustomJwtPayload }, res: Response, next: NextFunction): Promise<void> {
        try {
            const { otp } = req.body;

            if (!req.user) {
                res.status(401).json({ message: "Unauthorized No token" });
                return;
            }

            const { email, password, mobile, name, role } = req.user;

            if (!email || !password || !mobile || !name) {
                throw new Error('Missing required user data in token');
            }

            await this.authService.verifyOtp(otp, email);
           const user =  await this.userRegistrationService.registerUser({ 
                name, 
                email, 
                password, 
                mobile, 
                role: role || 'user' 
            });

            sendSuccess(res,'OTP verified successfully',user,StatusCode.CREATED)

        } catch (error: any) {
            next(error);
        }
    }
}
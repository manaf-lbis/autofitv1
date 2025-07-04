import { Request, Response, NextFunction } from "express";
import { AdminAuthService } from "../../services/auth/admin/authService"; 
import { sendSuccess } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { loginValidation } from "../../validation/authValidation";
import { AdminGoogleAuthService } from "../../services/auth/admin/googleAuthService";


export class AdminAuthController {
  constructor(
    private _adminAuthService: AdminAuthService,
    private _googleAuthService: AdminGoogleAuthService
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      loginValidation.parse({ email, password });

      const result = await this._adminAuthService.login(email, password);

      res.cookie("jwt", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 7*24*60*60*1000, 
      });

      sendSuccess(res, "Login Successful", result.user);
    } catch (error: any) {
      next(error);
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction):Promise<void> {
    try {
      const { code } = req.body;

      if (!code) {
        throw new ApiError("Authorization code is required",400)
      }

      const { token, user } = await this._googleAuthService.loginWithGoogle({ code });

      res.cookie('jwt',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',       
        maxAge: 7*24*60*60*1000 
      });

      sendSuccess(res,'Login Success',user)

    } catch (error) {
      next(error);
    }
  }


  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });
      sendSuccess(res, "Logout Successful");
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new ApiError("Not authenticated!", 401);
      }

      if (req.user.role !== 'admin') {
        throw new ApiError("Forbidden: Insufficient permissions", 403);
      }

      const data = await this._adminAuthService.getUser(req.user.id);
      sendSuccess(res, "Admin details retrieved", data);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
      if (!token) throw new ApiError("No token provided", 401);

      const userId = await this._adminAuthService.validateRefreshToken(token);
      const result = await this._adminAuthService.refreshAccessToken(userId);

      res.cookie("jwt", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, "Token refreshed");

    } catch (error: any) {
      next(error);
    }
  }



}
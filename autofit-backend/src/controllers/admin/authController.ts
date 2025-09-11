import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import { loginValidation } from "../../validation/authValidation";
import logger from "../../utils/logger";
import { HttpStatus } from "../../types/responseCode";
import { Role } from "../../types/role";
import { IAdminAuthService } from "../../services/auth/admin/interface/IAdminAuthService";
import { IAdminGoogleAuthService } from "../../services/auth/admin/interface/IAdminGoogleAuthService";
import { ITokenService } from "../../services/token/ITokenService";

export class AdminAuthController {
  constructor(
    private _adminAuthService: IAdminAuthService,
    private _googleAuthService: IAdminGoogleAuthService,
    private _tokenService: ITokenService
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info("Admin logined");
      const { email, password } = req.body;
      loginValidation.parse({ email, password });

      const result = await this._adminAuthService.login(email.toLowerCase(), password);

      res.cookie("jwt", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: Number(process.env.JWT_COOKIE_MAX_AGE), 
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
        throw new ApiError("Authorization code is required", HttpStatus.BAD_REQUEST)
      }

      const { token, user } = await this._googleAuthService.loginWithGoogle({ code });

      res.cookie('jwt',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',       
        maxAge: Number(process.env.JWT_COOKIE_MAX_AGE) 
      });

      sendSuccess(res,'Login Success', user)

    } catch (error) {
      next(error);
    }
  }


  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if(!userId) throw new ApiError("Not authenticated!", HttpStatus.BAD_REQUEST);

      await this._adminAuthService.logout(userId);
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
        throw new ApiError("Not authenticated!", HttpStatus.UNAUTHORIZED);
      }

      if (req.user.role !== Role.ADMIN) {
        throw new ApiError("Forbidden: Insufficient permissions", HttpStatus.FORBIDDEN);
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
      if (!token) throw new ApiError("No token provided", HttpStatus.UNAUTHORIZED);

      const decoded = this._tokenService.verifyToken(token, true);
      const userId = decoded.id;

      const result = await this._adminAuthService.refreshAccessToken(userId);

      res.cookie("jwt", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: Number(process.env.JWT_COOKIE_MAX_AGE),
      });

      sendSuccess(res, "Token refreshed");

    } catch (error: any) {
      next(error);
    }
  }


}
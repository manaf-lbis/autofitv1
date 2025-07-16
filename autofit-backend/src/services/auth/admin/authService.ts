import { IAdminRepository } from "../../../repositories/interfaces/IAdminRepository";
import { HashService } from "../../hash/hashService";
import { TokenService } from "../../token/tokenService";
import { ApiError } from "../../../utils/apiError";
import { Types } from "mongoose";
import { IAdminAuthService } from "./interface/IAdminAuthService";
import logger from "../../../utils/logger";
import { HttpStatus } from "../../../types/responseCode";

export class AdminAuthService implements IAdminAuthService {

  constructor(
    private _adminRepository: IAdminRepository,
    private _hashService: HashService,
    private _tokenService: TokenService
  ) {}

  async login(email: string, password: string) {

    const admin = await this._adminRepository.findByEmail(email);
    if (!admin) throw new ApiError("Invalid email or password", HttpStatus.NOT_FOUND);

    const INVALID_ATTEMPTS = Number(process.env.MAX_INVALID_PASSWORD_ATTEMPT);

    if (admin.lockUntil && admin.lockUntil > new Date()) {
      throw new ApiError(`Account locked until ${admin.lockUntil.toLocaleTimeString()}`, HttpStatus.FORBIDDEN);
    }

    const isMatch = await this._hashService.compare(password, admin.password);
    if (!isMatch) {
      const attempts = (admin.failedLoginAttempts || 0) + 1;
      const lockUntil = attempts >= INVALID_ATTEMPTS ? new Date(Date.now() + 5 * 60 * 1000) : undefined;

      await this._adminRepository.update(admin._id, {
        failedLoginAttempts: attempts,
        ...(lockUntil && { lockUntil }),
      });
      logger.error(`Admin ${admin.email} failed login attempts: ${attempts}`);

      throw new ApiError(
        attempts >= INVALID_ATTEMPTS
          ? "Account locked due to too many failed attempts"
          : `Invalid credentials. ${INVALID_ATTEMPTS - attempts} tries left.`,
        HttpStatus.UNAUTHORIZED
      );
    }

    await this._adminRepository.update(admin._id, {
      failedLoginAttempts: 0,
      lockUntil: null,
    });

    const payload = { id: admin._id, role: admin.role };
    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    await this._adminRepository.storeRefreshToken(admin._id, refreshToken);
    return { token: accessToken, user: { name: admin.name, role: admin.role } };

  }


  async validateRefreshToken(token: string): Promise<string> {
    try {
      const payload = this._tokenService.verifyToken(token);
      const storedToken = await this._adminRepository.getRefreshToken(payload.id);
      if (storedToken !== token) {
        throw new ApiError("Invalid refresh token", HttpStatus.UNAUTHORIZED);
      }
      return payload.id;
    } catch {
      throw new ApiError("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }

  }

  async refreshAccessToken(userId: string): Promise<{ accessToken: string }> {
    const admin = await this._adminRepository.findById(new Types.ObjectId(userId));
    if (!admin) throw new ApiError("Admin not found", HttpStatus.NOT_FOUND);

    const storedRefreshToken = admin.refreshToken;
    if (!storedRefreshToken) throw new ApiError("No refresh token available", HttpStatus.UNAUTHORIZED);

    try {
      this._tokenService.verifyToken(storedRefreshToken);
    } catch {
      throw new ApiError("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }
    
    const payload = { id: userId, role: admin.role };
    const newAccessToken = this._tokenService.generateAccessToken(payload);
    const newRefreshToken = this._tokenService.generateRefreshToken(payload);

    await this._adminRepository.storeRefreshToken(new Types.ObjectId(userId), newRefreshToken);
    return { accessToken: newAccessToken };
  }


  async getUser(id: Types.ObjectId) {
    const admin = await this._adminRepository.findById(id);
    if (!admin) {
      throw new ApiError("Admin not found", HttpStatus.NOT_FOUND);
    }
    return { name: admin.name, role: admin.role , email : admin.email };
  }

}
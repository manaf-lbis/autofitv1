import { IAdminRepository } from "../../../repositories/interfaces/IAdminRepository";
import { HashService } from "../../hash/hashService";
import { TokenService } from "../../token/tokenService";
import { ApiError } from "../../../utils/apiError";
import { Types } from "mongoose";

export class AdminAuthService {

  constructor(
    private adminRepository: IAdminRepository,
    private hashService: HashService,
    private tokenService: TokenService
  ) {}

  async login(email: string, password: string) {

    const admin = await this.adminRepository.findByEmail(email);
    if (!admin) throw new ApiError("Invalid email or password", 404);

    if (admin.lockUntil && admin.lockUntil > new Date()) {
      throw new ApiError(`Account locked until ${admin.lockUntil.toLocaleTimeString()}`, 423);
    }

    const isMatch = await this.hashService.compare(password, admin.password);
    if (!isMatch) {
      const attempts = (admin.failedLoginAttempts || 0) + 1;
      const lockUntil = attempts >= 3 ? new Date(Date.now() + 5 * 60 * 1000) : undefined;

      await this.adminRepository.update(admin._id, {
        failedLoginAttempts: attempts,
        ...(lockUntil && { lockUntil }),
      });

      throw new ApiError(
        attempts >= 3
          ? "Account locked due to too many failed attempts"
          : `Invalid credentials. ${3 - attempts} tries left.`,
        401
      );
    }

    await this.adminRepository.update(admin._id, {
      failedLoginAttempts: 0,
      lockUntil: null,
    });

    const payload = { id: admin._id, role: admin.role };
    const accessToken = this.tokenService.generateToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    await this.adminRepository.storeRefreshToken(admin._id, refreshToken);
    return { token: accessToken, user: { name: admin.name, role: admin.role } };

  }


  async validateRefreshToken(token: string): Promise<string> {
    try {
      const payload = this.tokenService.verifyToken(token);
      const storedToken = await this.adminRepository.getRefreshToken(payload.id);
      if (storedToken !== token) {
        throw new ApiError("Invalid refresh token", 401);
      }
      return payload.id;
    } catch (error) {
      throw new ApiError("Invalid refresh token", 401);
    }

  }

  async refreshAccessToken(userId: string): Promise<{ accessToken: string }> {
    const admin = await this.adminRepository.findById(new Types.ObjectId(userId));
    if (!admin) throw new ApiError("Admin not found", 404);

    const storedRefreshToken = admin.refreshToken;
    if (!storedRefreshToken) throw new ApiError("No refresh token available", 401);

    try {
      this.tokenService.verifyToken(storedRefreshToken);
    } catch (error) {
      throw new ApiError("Invalid refresh token", 401);
    }
    
    const payload = { id: userId, role: admin.role };
    const newAccessToken = this.tokenService.generateToken(payload);
    const newRefreshToken = this.tokenService.generateRefreshToken(payload);

    await this.adminRepository.storeRefreshToken(new Types.ObjectId(userId), newRefreshToken);
    return { accessToken: newAccessToken };
  }


  async getUser(id: Types.ObjectId) {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      throw new ApiError("Admin not found", 404);
    }
    return { name: admin.name, role: admin.role , email : admin.email };
  }

}
import { IUserRepository } from "../../../repositories/interfaces/IUserRepository";
import { OtpService } from "../../otp/otpService";
import { IOtpRepository } from "../../../repositories/interfaces/IOtpRepository";
import { HashService } from "../../hash/hashService";
import { TokenService } from "../../token/tokenService";
import { ApiError } from "../../../utils/apiError";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";


export class AuthService {

  constructor(
    private userRepository: IUserRepository,
    private otpService: OtpService,
    private tokenService: TokenService,
    private hashService: HashService,
  ) { }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new ApiError('Invalid email or password', 404);

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new ApiError(
        `Account locked until ${user.lockUntil.toLocaleTimeString()}`, 423
      );
    }

    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) {

      const attempts = (user.failedLoginAttempts || 0) + 1;
      const lockUntil = attempts >= 3
        ? new Date(Date.now() + 5 * 60 * 1000)
        : undefined;

      await this.userRepository.update(user._id.toString(), {
        failedLoginAttempts: attempts,
        ...(lockUntil && { lockUntil }),
      });

      throw new ApiError(
        attempts >= 3
          ? 'Account locked due to too many failed attempts'
          : `Invalid credentials. ${3 - attempts} tries left.`,
        401
      );
    }


    await this.userRepository.update(user._id.toString(), {
      failedLoginAttempts: 0,
      lockUntil: null,
    });


    const payload = { id: user._id, role: user.role };
    const accessToken = this.tokenService.generateToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    await this.userRepository.storeRefreshToken(user._id, refreshToken);
    return { token: accessToken, user: { name: user.name, role: user.role } };
  }


  async signup(name: string, email: string, password: string, mobile: string) {

    const isExist = await this.userRepository.findByEmail(email)
    if (isExist) throw new ApiError('User With Email Already Exists!', 400)

    const passwordHash = await this.hashService.hash(password)

    await this.otpService.saveAndSentOtp(email, 'user')
    const token = this.tokenService.generateToken({
      name,
      password: passwordHash,
      email,
      mobile,
      role: 'user'
    })
    return { token, message: 'OTP sent successfully' }
  }


  async getUser(_id: ObjectId) {
    const user = await this.userRepository.findById(_id)

    if (user?.status !== 'active') {
      throw new ApiError('user blocked')
    }
    const { name, role, email } = user;
    return { name, role ,email}
  }


  async validateRefreshToken(token: string): Promise<string> {
    try {

      const payload = this.tokenService.verifyToken(token);
      const storedToken = await this.userRepository.getRefreshToken(payload.id);
      if (storedToken !== token) {
        throw new ApiError("Invalid refresh token", 401);
      }
      return payload.id;
    } catch (error) {
      throw new ApiError("Invalid refresh token", 401);
    }
  }

  async refreshAccessToken(userId: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findById(new Types.ObjectId(userId));
    if (!user) throw new ApiError("User not found", 404);

    const storedRefreshToken = user.refreshToken;
    if (!storedRefreshToken) throw new ApiError("No refresh token available", 401);


    try {
      this.tokenService.verifyToken(storedRefreshToken);
    } catch (error) {
      throw new ApiError("Invalid refresh token", 401);
    }

    const payload = { id: userId, role: user.role };
    const newAccessToken = this.tokenService.generateAccessToken(payload);

    const newRefreshToken = this.tokenService.generateRefreshToken(payload);
    await this.userRepository.storeRefreshToken(new Types.ObjectId(userId), newRefreshToken);

    return { accessToken: newAccessToken };
  }

}

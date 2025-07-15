import { IUserRepository } from "../../../repositories/interfaces/IUserRepository";
import { OtpService } from "../../otp/otpService";
import { HashService } from "../../hash/hashService";
import { TokenService } from "../../token/tokenService";
import { ApiError } from "../../../utils/apiError";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { IAuthService } from "./interface/IAuthService";



export class AuthService implements IAuthService {

  constructor(
    private _userRepository: IUserRepository,
    private _otpService: OtpService,
    private _tokenService: TokenService,
    private _hashService: HashService,
  ) { }

  async login(email: string, password: string) {

    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new ApiError('Invalid email or password', 404);
    if(user.status === 'blocked') throw new ApiError('User Blocked Contact Admin', 401);

    const INVALID_ATTEMPTS = Number(process.env.MAX_INVALID_PASSWORD_ATTEMPT);

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new ApiError(
        `Account locked until ${user.lockUntil.toLocaleTimeString()}`, 423
      );
    }

    const isMatch = await this._hashService.compare(password, user.password);
    if (!isMatch) {

      const attempts = (user.failedLoginAttempts || 0) + 1;
      const lockUntil = attempts >= INVALID_ATTEMPTS
        ? new Date(Date.now() + 5 * 60 * 1000)
        : undefined;

      await this._userRepository.update(user._id, {
        failedLoginAttempts: attempts,
        ...(lockUntil && { lockUntil }),
      });

      throw new ApiError(
        attempts >= INVALID_ATTEMPTS
          ? 'Account locked due to too many failed attempts'
          : `Invalid credentials. ${INVALID_ATTEMPTS - attempts} tries left.`,
        401
      );
    }


    await this._userRepository.update(user._id, {
      failedLoginAttempts: 0,
      lockUntil: null,
    });


    const payload = { id: user._id, role: user.role };
    const accessToken = this._tokenService.generateAccessToken(payload);
    const refreshToken = this._tokenService.generateRefreshToken(payload);

    await this._userRepository.storeRefreshToken(user._id, refreshToken);
    return { token: accessToken, user: { name: user.name, role: user.role } };
  }


  async signup(name: string, email: string, password: string, mobile: string) {

    const isExist = await this._userRepository.findByEmail(email)
    if (isExist) throw new ApiError('User With Email Already Exists!', 400)

    const passwordHash = await this._hashService.hash(password)

    await this._otpService.saveAndSentOtp(email, 'user')
    const token = this._tokenService.generateAccessToken({
      name,
      password: passwordHash,
      email,
      mobile,
      role: 'user'
    })
    return { token, message: 'OTP sent successfully' }
  }


  async getUser(_id: ObjectId) {
    const user = await this._userRepository.findById(_id)

    if (user?.status !== 'active') {
      throw new ApiError('user blocked')
    }
    const { name, role, email, mobile } = user;
    return { name, role ,email, mobile}
  }


  async validateRefreshToken(token: string): Promise<string> {
    try {

      const payload = this._tokenService.verifyToken(token);
      const storedToken = await this._userRepository.getRefreshToken(payload.id);
      if (storedToken !== token) {
        throw new ApiError("Invalid refresh token", 401);
      }
      return payload.id;
    } catch {
      throw new ApiError("Invalid refresh token", 401);
    }
  }

  async refreshAccessToken(userId: string): Promise<{ accessToken: string }> {

    const user = await this._userRepository.findById(new Types.ObjectId(userId));
    if (!user) throw new ApiError("User not found", 404);

    const storedRefreshToken = user.refreshToken;
    if (!storedRefreshToken) throw new ApiError("No refresh token available", 401);

    try {
      this._tokenService.verifyToken(storedRefreshToken);
      
    } catch {
      throw new ApiError("Invalid refresh token", 401);
    }

    const payload = { id: userId, role: user.role };
    const newAccessToken = this._tokenService.generateAccessToken(payload);
    const newRefreshToken = this._tokenService.generateRefreshToken(payload);
    
    await this._userRepository.storeRefreshToken(new Types.ObjectId(userId), newRefreshToken);
    return { accessToken: newAccessToken };
  }

}

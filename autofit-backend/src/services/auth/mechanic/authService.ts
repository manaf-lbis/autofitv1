import { ApiError } from "../../../utils/apiError";
import { HashService } from "../../hash/hashService";
import { TokenService } from "../../token/tokenService";
import { ObjectId } from "mongodb";
import { OtpService } from "../../otp/otpService";
import { IMechanicRepository } from "../../../repositories/interfaces/IMechanicRepository";
import { IMechanicProfileRepository } from "../../../repositories/interfaces/IMechanicProfileRepository";
import { Types } from "mongoose";

export class AuthService {
    constructor(
        private hashService: HashService,
        private tokenService: TokenService,
        private mechanicRepository: IMechanicRepository,
        private otpService: OtpService,
        private mechanicProfileRepo: IMechanicProfileRepository

    ) { }


    async login(email: string, password: string) {

        const mechanic = await this.mechanicRepository.findByEmail(email);
        if (!mechanic) throw new ApiError("Invalid email or password", 404);

        if (mechanic.status === 'blocked') throw new ApiError('User Blocked - Contact Admin', 401);

        if (mechanic.lockUntil && mechanic.lockUntil > new Date()) {
            throw new ApiError(`Account locked until ${mechanic.lockUntil.toLocaleTimeString()}`, 423);
        }

        const isMatch = await this.hashService.compare(password, mechanic.password);
        if (!isMatch) {
            const attempts = (mechanic.failedLoginAttempts || 0) + 1;
            const lockUntil = attempts >= 3 ? new Date(Date.now() + 5 * 60 * 1000) : undefined;

            await this.mechanicRepository.update(mechanic._id, {
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

        await this.mechanicRepository.update(mechanic._id, {
            failedLoginAttempts: 0,
            lockUntil: null,
        });

        const payload = { id: mechanic._id, role: mechanic.role };
        const accessToken = this.tokenService.generateToken(payload);
        const refreshToken = this.tokenService.generateRefreshToken(payload);

        await this.mechanicRepository.storeRefreshToken(mechanic._id, refreshToken);
        return { token: accessToken, user: { name: mechanic.name, role: mechanic.role } };

    }

    async signup(name: string, email: string, password: string, mobile: string) {

        const isExist = await this.mechanicRepository.findByEmail(email)
        if (isExist) throw new ApiError('User With Email Already Exists!', 400)

        const passwordHash = await this.hashService.hash(password)

        await this.otpService.saveAndSentOtp(email, 'mechanic')
        const token = this.tokenService.generateToken({
            name,
            password: passwordHash,
            email,
            mobile,
            role: 'mechanic'
        })
        return { token, message: 'OTP sent successfully' }
    }

    async refreshAccessToken(userId: string): Promise<{ accessToken: string }> {

        const user = await this.mechanicRepository.findById(new Types.ObjectId(userId));
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

        await this.mechanicRepository.storeRefreshToken(new Types.ObjectId(userId), newRefreshToken);
        return { accessToken: newAccessToken };
    }




    async getUser(_id: ObjectId) {
        const mechanic = await this.mechanicRepository.findById(_id)

        if (mechanic?.status !== 'active') {
            throw new ApiError('user blocked')
        }
        const res = await this.mechanicProfileRepo.getProfileStatus(mechanic._id)

        const profileStatus = res ? res.registration.status : null

        const { name, role, email, mobile, avatar } = mechanic;
        return { name, role, email, mobile, avatar, profileStatus }
    }


}
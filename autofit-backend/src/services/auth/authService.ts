import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { OtpService } from "../otp/otpService";
import { IOtpRepository } from "../../repositories/interfaces/IOtpRepository";
import { HashService } from "../hash/hashService";
import { TokenService } from "../token/tokenService";
import { ApiError } from "../../utils/apiError";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";


export class AuthService {

    constructor (
        private userRepository: IUserRepository,
        private otpService: OtpService,
        private otpRepository : IOtpRepository,
        private tokenService : TokenService,
        private hashService : HashService,
    ){}

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email)

        if (!user) {
          throw new ApiError('Invalid email or password',404)
        }
        
        const isMatch = await this.hashService.compare(password,user.password)
    
        if (!isMatch) {
          throw new ApiError('Invalid email or password',404)
        }

        const payload = { id: user._id, role: user.role };
        const accessToken =  this.tokenService.generateToken(payload)
        const refreshToken = this.tokenService.generateRefreshToken(payload);

        await this.userRepository.storeRefreshToken(user._id, refreshToken);

        return { token:accessToken, user: {  name: user.name, role: user.role } };
    }


    async signup(name:string ,email:string, password:string, mobile:string) {

       const isExist = await this.userRepository.findByEmail(email)

        if(isExist) throw new ApiError('User With Email Already Exists!', 400)


        const otp = this.otpService.generate();
        console.error('your OTP is :', otp);
        
        this.otpService.send(email,otp);

        const otpHash = await this.hashService.hash(otp)
        const passwordHash = await this.hashService.hash(password)

        await this.otpRepository.save({
            email,
            otp : otpHash,
            attempt : 0,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            verified : false
        })

        const token = this.tokenService.generateToken({name,password:passwordHash,email,mobile,role:'user'})

        return {token,message : 'OTP sent successfully'}   
    }

    async verifyOtp(otp: string, email: string): Promise<void> {

        const data = await this.otpRepository.findByEmail(email);
        
        const now = new Date();
        if (!data || data.expiresAt < now) {
          throw new ApiError("Please request a new OTP.",400);
        }
        
        if (data.attempt >= 3) {
          const timeLeftMs = data.expiresAt.getTime() - now.getTime();
          const minutes = Math.floor(timeLeftMs / 60000);
          const seconds = Math.floor((timeLeftMs % 60000) / 1000);

          const formattedMinutes = String(minutes).padStart(2, '0');
          const formattedSeconds = String(seconds).padStart(2, '0');
        
          throw new ApiError(
            `Too many invalid attempts. Please try again in ${formattedMinutes}:${formattedSeconds}`,
            400
          );
        }
    
        const isCorrect = await this.hashService.compare(otp, data.otp);


        if (!isCorrect && data._id) {
          await this.otpRepository.incrementAttemptCount(data._id);
          throw new ApiError(`Invalid OTP you have ${3 - data.attempt } attempt left`,400);
        }
        
        if (data._id) {
          await this.otpRepository.markAsVerified(data._id);
        }
    }

  
    async getUser(_id:ObjectId){
      const user =  await this.userRepository.findById(_id)

      if(user?.status !== 'active'){
        throw new ApiError('user blocked')
      }
      const {name,role} = user;
      return {name,role}

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

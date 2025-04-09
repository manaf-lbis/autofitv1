import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { OtpService } from "../otp/otpService";
import { IOtpRepository } from "../../repositories/interfaces/IOtpRepository";
import { HashService } from "../hash/hashService";
import { TokenService } from "../token/tokenService";
import { ApiError } from "../../utils/apiError";



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

        const token =  this.tokenService.generateToken({ id: user._id, role: user.role })

        return { token, user: { _id: user._id, name: user.name, role: user.role } };
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
          throw new ApiError("Invalid OTP",400);
        }
        
        if (data._id) {
          await this.otpRepository.markAsVerified(data._id);
        }
    }
}


import { IOtpRepository } from "../../repositories/interfaces/IOtpRepository";
import { HttpStatus } from "../../types/responseCode";
import { Role } from "../../types/role";
import { ApiError } from "../../utils/apiError";
import { HashService } from "../hash/hashService";
import { sendMail } from "../mail/mailService";
import { IOtpService } from "./IOtpService";

export class OtpService implements IOtpService {

  constructor(
    private _otpRepository: IOtpRepository,
    private _hashService: HashService,
  ) { }

  async verifyOtp(otp: string, email: string): Promise<void> {


    const data = await this._otpRepository.findByEmail(email);

    const now = new Date();
    if (!data || data.expiresAt < now) {
      throw new ApiError("Please request a new OTP.", HttpStatus.BAD_REQUEST);
    }

    if (data.attempt >= Number(process.env.OTP_ATTEMPT_LIMIT)) {
      const timeLeftMs = data.expiresAt.getTime() - now.getTime();
      const remainingSeconds = Math.floor(timeLeftMs / 1000);


      throw new ApiError(
        `Too many invalid attempts. Try After : `,
        HttpStatus.BAD_REQUEST, {remainingTime:remainingSeconds}
      );
    }

    const isCorrect = await this._hashService.compare(otp, data.otp);

    if (!isCorrect && data._id) {
      await this._otpRepository.incrementAttemptCount(data._id);
      throw new ApiError(`Invalid OTP you have ${Number(process.env.OTP_ATTEMPT_LIMIT) - data.attempt} attempt left`, HttpStatus.BAD_REQUEST);
    }

    if (data._id) {
      await this._otpRepository.markAsVerified(data._id);
    }
  }


  async saveAndSentOtp(email: string, role: Role) {

    const otpDoc = await this._otpRepository.findByEmail(email);

    const now = new Date();

    if (otpDoc && otpDoc.attempt >= Number(process.env.OTP_ATTEMPT_LIMIT)) {
      const timeLeftMs = otpDoc.expiresAt.getTime() - now.getTime();
      const remainingSeconds = Math.floor(timeLeftMs / 1000);
     
      throw new ApiError(
        `Attempt already Exhausted Try After : `,
        HttpStatus.BAD_REQUEST,{remainingTime:remainingSeconds}
      );
    }

    const newOtp = this.generate();
    console.log(`Your OTP is: ${newOtp}`);

    const otpHash = await this._hashService.hash(newOtp);

    await this._otpRepository.save({
      email,
      otp: otpHash,
      attempt: 0,
      role: role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRE_IN)),
      verified: false
    });

    await sendMail(email, newOtp);
  }

  async saveAndResentOtp(email: string, role: Role){

    const newOtp = this.generate();
    console.log(`Resent OTP is: ${newOtp}`);

    const otpHash = await this._hashService.hash(newOtp);

    await this._otpRepository.save({
      email,
      otp: otpHash,
      attempt: 0,
      role: role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + Number(process.env.OTP_EXPIRE_IN)),
      verified: false
    });

    await sendMail(email, newOtp);
  }


  generate(length: number = 6): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }


  async send(email: string, otp: string) {
    await sendMail(email, otp);
  }

}


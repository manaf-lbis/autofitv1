
import { OtpRepository } from "../../repositories/otpRepository";
import { Role } from "../../types/role";
import { ApiError } from "../../utils/apiError";
import { HashService } from "../hash/hashService";
import { sendMail } from "../mail/mailService";

export class OtpService {

  constructor(
    private otpRepository: OtpRepository,
    private hashService: HashService,
  ) { }

  async verifyOtp(otp: string, email: string): Promise<void> {


    const data = await this.otpRepository.findByEmail(email);

    const now = new Date();
    if (!data || data.expiresAt < now) {
      throw new ApiError("Please request a new OTP.", 400);
    }

    if (data.attempt >= 3) {
      const timeLeftMs = data.expiresAt.getTime() - now.getTime();
      const remainingSeconds = Math.floor(timeLeftMs / 1000);


      throw new ApiError(
        `Too many invalid attempts. Try After : `,
        400, {remainingTime:remainingSeconds}
      );
    }

    const isCorrect = await this.hashService.compare(otp, data.otp);

    if (!isCorrect && data._id) {
      await this.otpRepository.incrementAttemptCount(data._id);
      throw new ApiError(`Invalid OTP you have ${3 - data.attempt} attempt left`, 400);
    }

    if (data._id) {
      await this.otpRepository.markAsVerified(data._id);
    }
  }


  async saveAndSentOtp(email: string, role: Role) {

    const otpDoc = await this.otpRepository.findByEmail(email);

    const now = new Date();

    if (otpDoc && otpDoc.attempt >= 3) {
      const timeLeftMs = otpDoc.expiresAt.getTime() - now.getTime();
      const remainingSeconds = Math.floor(timeLeftMs / 1000);
     
      throw new ApiError(
        `Attempt already Exhausted Try After : `,
        400,{remainingTime:remainingSeconds}
      );
    }

    const newOtp = this.generate();
    console.log(`Your OTP is: ${newOtp}`);

    const otpHash = await this.hashService.hash(newOtp);

    await this.otpRepository.save({
      email,
      otp: otpHash,
      attempt: 0,
      role: role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verified: false
    });

    await sendMail(email, newOtp);
  }

  async saveAndResentOtp(email: string, role: Role){

    const newOtp = this.generate();
    console.log(`Resent OTP is: ${newOtp}`);

    const otpHash = await this.hashService.hash(newOtp);

    await this.otpRepository.save({
      email,
      otp: otpHash,
      attempt: 0,
      role: role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
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


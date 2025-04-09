
import { sendMail } from "../mail/mailService";

export class OtpService {
  generate (length:number = 6) : string {
      return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  async send(email: string, otp: string) {
    await sendMail(email,otp );
  }

  

}


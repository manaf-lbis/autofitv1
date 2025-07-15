import { Role } from "../../types/role";

export interface IOtpService {

  verifyOtp(otp: string, email: string): Promise<void>;
  saveAndSentOtp(email: string, role: Role): Promise<void>;
  saveAndResentOtp(email: string, role: Role): Promise<void>;
  generate(length?: number): string;
  send(email: string, otp: string): Promise<void>;
}

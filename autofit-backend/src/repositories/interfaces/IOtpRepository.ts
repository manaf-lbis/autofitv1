import { Otp } from "../../types/otp";
import { OtpDocument } from "../../models/otpModel";
import { ObjectId } from "mongodb";

export interface IOtpRepository {
    findByEmail(email: string): Promise<OtpDocument | null>;
    incrementAttemptCount(id:ObjectId): Promise<void>;
    markAsVerified(id: ObjectId): Promise<void>;
    save(entity: Otp): Promise<Otp>
} 



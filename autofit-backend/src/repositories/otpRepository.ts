import { OtpDocument } from "../models/otpModel";
import { IOtpRepository } from "./interfaces/IOtpRepository";
import { OtpModel } from "../models/otpModel";
import { Otp } from "../types/otp";
import { ObjectId } from "mongodb";

export class OtpRepository implements IOtpRepository {
    
    async findByEmail(email: string): Promise<OtpDocument | null> {
        return await OtpModel.findOne({ email });
    }

    async save(entity: Otp): Promise<OtpDocument> {
        const updatedOtp = await OtpModel.findOneAndUpdate(
            { email: entity.email },
            {
                $set: {
                    otp: entity.otp,
                    expiresAt: entity.expiresAt,
                    createdAt: new Date(),
                    attempt: 0,
                    role:entity.role,
                    verified: false
                }
            },
            {
                upsert: true,
                new: true,
            }
        );
        return updatedOtp as OtpDocument;
    }

    async incrementAttemptCount(id: ObjectId): Promise<void> {
        await OtpModel.findByIdAndUpdate(id, { $inc: { attempt: 1 } });
    }

    async markAsVerified(id: ObjectId): Promise<void> {
        await OtpModel.findByIdAndDelete(id);
    }
}


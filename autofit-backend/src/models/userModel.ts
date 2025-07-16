import mongoose, { Schema, Document ,Types} from 'mongoose';
import { User } from '../types/user/user';
import { Role } from '../types/role';

export interface UserDocument extends Document<Types.ObjectId>, User  {}

const userSchema: Schema<UserDocument> = new Schema(
  {

    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    mobile: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true
    },
    googleId: { type: String },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active'
    },
    refreshToken: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

export const UserModel = mongoose.model<UserDocument>('user', userSchema);

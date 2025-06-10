import { Types } from "mongoose"

export interface Mechanic {
  _id: Types.ObjectId,
  name: string,
  email: string,
  mobile: string,
  avatar: string,
  password: string,
  role: 'user' | 'admin' | 'mechanic',
  status: 'active' | 'blocked',
  refreshToken: string
  failedLoginAttempts: number
  lockUntil: Date | null
  googleId?: string,
  createdAt?: Date,
  updatedAt?: Date
}

export interface MechanicProfile {
  _id: Types.ObjectId,
  mechanicId: Types.ObjectId
  education: string,
  isAvailable: boolean,
  specialised: string,
  experience: number,
  shopName: string,
  registration:{
     status:'pending'| 'approved' | 'rejected',
     rejectionReason:string,
     approvedOn:Date,
     rejectedOn:Date
  }
  place: string,
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  landmark: string,
  photo: string
  shopImage: string,
  qualification: string,
  createdAt?: Date,
  updatedAt?: Date
}


export interface MechanicRegisterInput {
  education: string;
  specialised: string;
  experience: number;
  shopName: string;
  place: string;
  landmark: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}


export type ProfileStatus = {
  registration: {
    status: string;
  };
};
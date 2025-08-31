import { Types } from "mongoose"
import { Role } from "../role"

export interface Mechanic {
  _id: Types.ObjectId,
  name: string,
  email: string,
  mobile: string,
  avatar: string,
  password: string,
  role: Role,
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
  availability: 'available' | 'notAvailable' | 'busy'
  specialised: string,
  experience: number,
  shopName: string,
  registration: {
    status: 'pending' | 'approved' | 'rejected',
    rejectionReason: string,
    approvedOn: Date,
    rejectedOn: Date
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
  workingHours: Types.ObjectId
  createdAt: Date,
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

export interface MechanicAvailability {
  availability: 'available' | 'notAvailable' | 'busy'
}


export interface MechanicNearbyDto {
  _id: Types.ObjectId;
  mechanicId: Types.ObjectId;
  availability: 'available' | 'notAvailable' | 'busy';
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  education?: string;
  specialised?: string;
  experience?: number;
  photo?: string;
  [key: string]: any;
  distanceInMeters: number;
  durationInSeconds: number;
}

export interface IDayTiming {
  isOpen: boolean;
  openTime: number;
  closeTime: number;
}

export interface IMechanicTiming {
  mechanicId: Types.ObjectId;
  sunday: IDayTiming;
  monday: IDayTiming;
  tuesday: IDayTiming;
  wednesday: IDayTiming;
  thursday: IDayTiming;
  friday: IDayTiming;
  saturday: IDayTiming;
}


export interface ITimeBlock {
  _id: Types.ObjectId;
  mechanicId: Types.ObjectId;
  date:Date;
  startMinutes: number;
  endMinutes: number;
  blockType: string;
  reason: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

}

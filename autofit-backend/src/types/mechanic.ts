import { ObjectId } from "mongodb";

export interface Mechanic {
    _id: ObjectId,
    name: string,
    email: string,
    mobile:string,
    password: string,
    role: 'user' | 'admin' | 'mechanic',
    status: 'active' | 'blocked',
    refreshToken:string
    failedLoginAttempts:number
    lockUntil:Date | null
    googleId?:string,
    createdAt?: Date,
    updatedAt?: Date
}

export interface MechanicProfile {
    _id: ObjectId,
    mechanicId:ObjectId
    registration: {
        status: 'pending' | 'approved',
        approvedOn : Date 
        rejectedOn : Date 
    },
    education: string,
    specialised : string,
    experience : number,
    shopName : string,
    place : string,
    location: {
        type: 'Point';
        coordinates: [number, number]; 
    };
    landmark:string,
    photo:string
    shopImage:string,
    qualification:string,
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
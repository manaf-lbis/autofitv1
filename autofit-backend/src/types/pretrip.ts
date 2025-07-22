import { Types } from "mongoose";

export interface IPretripPlan  {
    _id:Types.ObjectId
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    features: string[];
    isDeleted: boolean;
    isActive: boolean;
    isPopular: boolean;
    createdAt: Date; 
    updatedAt: Date; 
}

export interface IPretripFeature {
    _id:Types.ObjectId
    name: string;
    createdAt: Date; 
    updatedAt: Date; 
}
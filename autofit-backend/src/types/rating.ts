import { Types } from "mongoose";
import { ServiceType } from "./services";

export enum Sort {
    ALL = "all",
    TOP = "top",
    LEAST = "least",
}
export interface Rating {
    _id: Types.ObjectId;
    rating: number;
    review: string;
    serviceId: Types.ObjectId;
    serviceType: ServiceType;
    mechanicId: Types.ObjectId;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

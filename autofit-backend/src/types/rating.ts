import { Types } from "mongoose";
import { ServiceType } from "./services";

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

import { Types } from "mongoose";

export interface IPageService {

  primaryInfo(mechanicId: Types.ObjectId): Promise<{
    availability: string;
    notifications: any[]; 
    messages: number;
  }>;


  dashboard(mechanicId: Types.ObjectId): Promise<{
    recentActivities: { id: number; name: string; action: string; time: string }[];
    emergencyRequest: {
      _id: Types.ObjectId;
      name: string;
      issue: string;
      description: string;
      location: number[];
      time: Date;
      status: string;
      vehicle: string;
    } | null;
  }>;
}

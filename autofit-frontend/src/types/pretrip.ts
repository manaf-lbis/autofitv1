export enum SlotStatus {
  BOOKED = "booked",
  BLOCKED = "blocked",
  AVAILABLE = "available",
  CANCELLED = "cancelled",
}

export interface IPretripSlot {
  _id: string;
  date: string;
  status: SlotStatus;
  mechanicId: string;
  userId?: { _id: string; name: string; phone: string  };
  vehicleId?: { _id: string; regNo: string; modelName:string; brand:string};
  bookingId?: string 
  servicePlan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  date: Date; 
  status: SlotStatus;
  customer?: string;
  vehicle?: string;
  plan?: string;
  bookingId?: string;
  customerPhone?: string;
}
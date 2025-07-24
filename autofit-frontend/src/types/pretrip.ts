export enum SlotStatus {
  BOOKED = "booked",
  AVAILABLE = "available",
  CANCELLED = "cancelled",
}

export interface IPretripSlot {
  _id: string;
  date: string; // Full ISO string with time
  status: SlotStatus;
  mechanicId: string;
  userId?: { _id: string; name: string; phone: string };
  vehicleId?: { _id: string; regno: string };
  bookingId?: { _id: string };
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
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
  schedule: { start: string; end: string };
  servicePlan?:{_id: string; name: string};
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

export interface IBlockedSchedule {
  _id: string
  date: string 
  blockedTiming?: {
    from: string 
    to: string
  }
  reason?: string
  isFullDayBlock: boolean
}

export interface TimeWindow {
  start: string
  end: string
}

export interface CombinedTimeSlot {
  windows: TimeWindow[]
  totalDuration: number
  breaks: { start: string; end: string }[]
  startTime: string
  endTime: string
  canAccommodateService: boolean
}

export interface MechanicData {
  mechanicId: string
  shopName: string
  distanceInMeters: number
  place: string
  specialised: string
  availableWindows: {
    [date: string]: TimeWindow[]
  }
}

export interface ApiResponse {
  data: {
    mechanics: MechanicData[]
  }
}

export enum PretripStatus{
  BOOKED = 'booked',
  PICKED_UP = 'picked_up',
  ANALYSING='analysing',
  REPORT_CREATED = 'report_created',
  VEHICLE_RETURNED = 'vehicle_returned',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

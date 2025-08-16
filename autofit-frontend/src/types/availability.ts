export interface TimeSlot {
  id: number
  time: string
  status: "available" | "booked" | "cancelled" | "blocked"
  customer?: string
  vehicle?: string
  plan?: "essential" | "premium" | "delight"
  bookingId?: string
  customerPhone?: string
}

export interface Service {
  id: string
  customer: string
  vehicle: string
  plan: "essential" | "premium" | "delight"
  status: "active" | "scheduled" | "completed" | "cancelled"
  date: string
  location: string
  amount: number
  phone: string
  description?: string
}

export interface Plan {
  name: string
  color: string
  duration: number
  price: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

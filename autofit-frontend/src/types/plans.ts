export interface Feature {
  id: string
  name: string
  createdAt: string
}

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  features: string[]
  isActive: boolean
  isPopular: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePlanRequest {
  name: string
  description: string
  price: string | number
  originalPrice?: string | number
  features: string[]
  isPopular?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

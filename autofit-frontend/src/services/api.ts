import type { TimeSlot, Service, ApiResponse } from "@/types/availability"

// Mock API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API functions - replace with real API calls later
export const api = {
  // Slot management
  async getSlots(date: string): Promise<ApiResponse<TimeSlot[]>> {
    await delay(500)
    // Mock response - replace with actual API call
    return {
      success: true,
      data: [], // Will be populated from mock data
    }
  },

  async createSlots(date: string, times: string[]): Promise<ApiResponse<TimeSlot[]>> {
    await delay(800)
    console.log(date, times);
    
    // Mock response - replace with actual API call
    return {
      success: true,
      data: times.map((time, index) => ({
        id: Date.now() + index,
        time,
        status: "available" as const,
      })),
      message: `${times.length} slot${times.length > 1 ? "s" : ""} created successfully`,
    }
  },

  async deleteSlot(slotId: number): Promise<ApiResponse<void>> {
    await delay(300)
    // Mock response - replace with actual API call
    return {
      success: true,
      message: "Slot deleted successfully",
    }
  },

  async updateSlotStatus(slotId: number, status: TimeSlot["status"]): Promise<ApiResponse<TimeSlot>> {
    await delay(400)
    // Mock response - replace with actual API call
    return {
      success: true,
      message: "Slot status updated successfully",
    }
  },

  // Service management
  async getServices(filters?: { search?: string; status?: string }): Promise<ApiResponse<Service[]>> {
    await delay(600)
    // Mock response - replace with actual API call
    return {
      success: true,
      data: [], // Will be populated from mock data
    }
  },

  async getServiceById(serviceId: string): Promise<ApiResponse<Service>> {
    await delay(400)
    // Mock response - replace with actual API call
    return {
      success: true,
      data: {} as Service, // Will be populated from mock data
    }
  },

  async updateServiceStatus(serviceId: string, status: Service["status"]): Promise<ApiResponse<Service>> {
    await delay(500)
    // Mock response - replace with actual API call
    return {
      success: true,
      message: "Service status updated successfully",
    }
  },
}

// import type { Plan, Feature, CreatePlanRequest, ApiResponse } from "@/types/plans"

// // Mock delay to simulate network
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// // Mock database data
// const mockFeatures: Feature[] = [
//   { id: "f1", name: "Basic inspection", createdAt: "2024-01-01T00:00:00Z" },
//   { id: "f2", name: "Oil change", createdAt: "2024-01-01T00:00:00Z" },
//   { id: "f3", name: "Brake check", createdAt: "2024-01-01T00:00:00Z" },
//   { id: "f4", name: "Battery test", createdAt: "2024-01-01T00:00:00Z" },
//   { id: "f5", name: "Tire rotation", createdAt: "2024-01-01T00:00:00Z" },
//   { id: "f6", name: "Engine diagnostics", createdAt: "2024-01-01T00:00:00Z" },
//   { id: "f7", name: "AC service", createdAt: "2024-01-01T00:00:00Z" },
//   { id: "f8", name: "Transmission check", createdAt: "2024-01-01T00:00:00Z" },
// ]

// const mockPlans: Plan[] = [
//   {
//     id: "p1",
//     name: "Basic",
//     description: "Essential maintenance",
//     price: 1500,
//     originalPrice: 2000,
//     features: ["f1", "f2", "f3"],
//     isActive: true,
//     isPopular: false,
//     createdAt: "2024-01-01T00:00:00Z",
//     updatedAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "p2",
//     name: "Premium",
//     description: "Complete vehicle care",
//     price: 3500,
//     originalPrice: 4500,
//     features: ["f1", "f2", "f3", "f4", "f5", "f6"],
//     isActive: true,
//     isPopular: true,
//     createdAt: "2024-01-01T00:00:00Z",
//     updatedAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     id: "p3",
//     name: "Deluxe",
//     description: "Premium service with extras",
//     price: 5500,
//     features: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"],
//     isActive: true,
//     isPopular: false,
//     createdAt: "2024-01-01T00:00:00Z",
//     updatedAt: "2024-01-01T00:00:00Z",
//   },
// ]

// // Plans API
// export const plansApi = {
//   // Get all plans
//   async getPlans(): Promise<ApiResponse<Plan[]>> {
//     await delay(500)
//     return {
//       success: true,
//       data: mockPlans,
//     }
//   },

//   // Create plan
//   async createPlan(data: CreatePlanRequest): Promise<ApiResponse<Plan>> {
//     await delay(800)

//     const newPlan: Plan = {
//       id: `p${Date.now()}`,
//       name: data.name,
//       description: data.description,
//       price: typeof data.price === "string" ? Number(data.price) : data.price,
//       originalPrice: data.originalPrice
//         ? typeof data.originalPrice === "string"
//           ? Number(data.originalPrice)
//           : data.originalPrice
//         : undefined,
//       features: data.features,
//       isPopular: data.isPopular || false,
//       isActive: true,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }

//     mockPlans.push(newPlan)

//     return {
//       success: true,
//       data: newPlan,
//       message: "Plan created successfully",
//     }
//   },

//   // Update plan
//   async updatePlan(id: string, data: Partial<CreatePlanRequest>): Promise<ApiResponse<Plan>> {
//     await delay(600)

//     const planIndex = mockPlans.findIndex((p) => p.id === id)
//     if (planIndex === -1) {
//       return {
//         success: false,
//         error: "Plan not found",
//       }
//     }

//     mockPlans[planIndex] = {
//       ...mockPlans[planIndex],
//       name: data.name || mockPlans[planIndex].name,
//       description: data.description || mockPlans[planIndex].description,
//       price: data.price
//         ? typeof data.price === "string"
//           ? Number(data.price)
//           : data.price
//         : mockPlans[planIndex].price,
//       originalPrice: data.originalPrice
//         ? typeof data.originalPrice === "string"
//           ? Number(data.originalPrice)
//           : data.originalPrice
//         : mockPlans[planIndex].originalPrice,
//       features: data.features || mockPlans[planIndex].features,
//       isPopular: data.isPopular !== undefined ? data.isPopular : mockPlans[planIndex].isPopular,
//       updatedAt: new Date().toISOString(),
//     }

//     return {
//       success: true,
//       data: mockPlans[planIndex],
//       message: "Plan updated successfully",
//     }
//   },

//   // Delete plan
//   async deletePlan(id: string): Promise<ApiResponse<void>> {
//     await delay(400)

//     const planIndex = mockPlans.findIndex((p) => p.id === id)
//     if (planIndex === -1) {
//       return {
//         success: false,
//         error: "Plan not found",
//       }
//     }

//     mockPlans.splice(planIndex, 1)

//     return {
//       success: true,
//       message: "Plan deleted successfully",
//     }
//   },

//   // Toggle plan status
//   async togglePlanStatus(id: string): Promise<ApiResponse<Plan>> {
//     await delay(300)

//     const planIndex = mockPlans.findIndex((p) => p.id === id)
//     if (planIndex === -1) {
//       return {
//         success: false,
//         error: "Plan not found",
//       }
//     }

//     mockPlans[planIndex].isActive = !mockPlans[planIndex].isActive
//     mockPlans[planIndex].updatedAt = new Date().toISOString()

//     return {
//       success: true,
//       data: mockPlans[planIndex],
//       message: `Plan ${mockPlans[planIndex].isActive ? "activated" : "deactivated"} successfully`,
//     }
//   },
// }

// // Features API
// export const featuresApi = {
//   // Get all features
//   async getFeatures(): Promise<ApiResponse<Feature[]>> {
//     await delay(300)
//     return {
//       success: true,
//       data: mockFeatures,
//     }
//   },

//   // Create feature
//   async createFeature(name: string): Promise<ApiResponse<Feature>> {
//     await delay(500)

//     const newFeature: Feature = {
//       id: `f${Date.now()}`,
//       name: name.trim(),
//       createdAt: new Date().toISOString(),
//     }

//     mockFeatures.push(newFeature)

//     return {
//       success: true,
//       data: newFeature,
//       message: "Feature created successfully",
//     }
//   },

//   // Update feature
//   async updateFeature(id: string, name: string): Promise<ApiResponse<Feature>> {
//     await delay(500)

//     const featureIndex = mockFeatures.findIndex((f) => f.id === id)
//     if (featureIndex === -1) {
//       return {
//         success: false,
//         error: "Feature not found",
//       }
//     }

//     mockFeatures[featureIndex].name = name.trim()

//     return {
//       success: true,
//       data: mockFeatures[featureIndex],
//       message: "Feature updated successfully",
//     }
//   },

//   // Delete feature
//   async deleteFeature(id: string): Promise<ApiResponse<void>> {
//     await delay(400)

//     const featureIndex = mockFeatures.findIndex((f) => f.id === id)
//     if (featureIndex === -1) {
//       return {
//         success: false,
//         error: "Feature not found",
//       }
//     }

//     // Remove feature from all plans
//     mockPlans.forEach((plan) => {
//       plan.features = plan.features.filter((fId) => fId !== id)
//       plan.updatedAt = new Date().toISOString()
//     })

//     mockFeatures.splice(featureIndex, 1)

//     return {
//       success: true,
//       message: "Feature deleted successfully",
//     }
//   },
// }




// import type { ApiResponse } from "@/types/plans"

// // Mock database data for slots and bookings
// const mockSlots: Slot[] = [
//   {
//     id: "s1",
//     mechanicId: "m1",
//     planId: "p1",
//     date: "2025-07-21",
//     time: "11:00 AM",
//     status: "available",
//     createdAt: "2025-07-20T10:00:00Z",
//   },
//   {
//     id: "s2",
//     mechanicId: "m1",
//     planId: "p1",
//     date: "2025-07-21",
//     time: "04:00 PM",
//     status: "available",
//     createdAt: "2025-07-20T10:00:00Z",
//   },
// ];

// const mockBookings: Booking[] = [];

// interface Slot {
//   id: string;
//   mechanicId: string;
//   planId: string;
//   date: string; // ISO date, e.g., "2025-07-21"
//   time: string; // e.g., "11:00 AM"
//   status: "available" | "booked" | "cancelled";
//   createdAt: string;
// }

// interface Booking {
//   id: string;
//   userId: string;
//   slotId: string;
//   vehicleId: string;
//   status: "pending" | "confirmed" | "cancelled";
//   createdAt: string;
// }

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export const slotsApi = {
//   // Get all available slots
//   async getSlots(): Promise<ApiResponse<Slot[]>> {
//     await delay(600);
//     const availableSlots = mockSlots.filter((slot) => slot.status === "available");
//     return {
//       success: true,
//       data: availableSlots,
//       message: "Slots loaded successfully",
//       meta: {
//         total: availableSlots.length,
//         timestamp: new Date().toISOString(),
//       },
//     };
//   },

//   // Create a slot
//   async createSlot(data: {
//     mechanicId: string;
//     planId: string;
//     date: string;
//     time: string;
//   }): Promise<ApiResponse<Slot>> {
//     await delay(800);

//     // Validation
//     if (!data.mechanicId) {
//       return {
//         success: false,
//         error: "Mechanic ID is required",
//         code: "VALIDATION_ERROR",
//       };
//     }
//     if (!data.planId) {
//       return {
//         success: false,
//         error: "Plan ID is required",
//         code: "VALIDATION_ERROR",
//       };
//     }
//     if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
//       return {
//         success: false,
//         error: "Valid date is required (YYYY-MM-DD)",
//         code: "VALIDATION_ERROR",
//       };
//     }
//     if (!data.time || !/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(data.time)) {
//       return {
//         success: false,
//         error: "Valid time is required (e.g., 11:00 AM)",
//         code: "VALIDATION_ERROR",
//       };
//     }
//     if (mockSlots.some((slot) => slot.mechanicId === data.mechanicId && slot.date === data.date && slot.time === data.time)) {
//       return {
//         success: false,
//         error: "Slot already exists for this date and time",
//         code: "DUPLICATE_ERROR",
//       };
//     }

//     const newSlot: Slot = {
//       id: `s${Date.now()}`,
//       mechanicId: data.mechanicId,
//       planId: data.planId,
//       date: data.date,
//       time: data.time,
//       status: "available",
//       createdAt: new Date().toISOString(),
//     };

//     mockSlots.push(newSlot);

//     return {
//       success: true,
//       data: newSlot,
//       message: "Slot created successfully",
//       meta: {
//         id: newSlot.id,
//         timestamp: new Date().toISOString(),
//       },
//     };
//   },

//   // Book a slot
//   async bookSlot(data: {
//     userId: string;
//     slotId: string;
//     vehicleId: string;
//   }): Promise<ApiResponse<Booking>> {
//     await delay(1000);

//     // Validation
//     if (!data.userId) {
//       return {
//         success: false,
//         error: "User ID is required",
//         code: "VALIDATION_ERROR",
//       };
//     }
//     if (!data.slotId) {
//       return {
//         success: false,
//         error: "Slot ID is required",
//         code: "VALIDATION_ERROR",
//       };
//     }
//     if (!data.vehicleId) {
//       return {
//         success: false,
//         error: "Vehicle ID is required",
//         code: "VALIDATION_ERROR",
//       };
//     }

//     const slot = mockSlots.find((s) => s.id === data.slotId);
//     if (!slot) {
//       return {
//         success: false,
//         error: "Slot not found",
//         code: "NOT_FOUND",
//       };
//     }
//     if (slot.status !== "available") {
//       return {
//         success: false,
//         error: "Slot is not available",
//         code: "INVALID_STATE",
//       };
//     }
//     if (mockBookings.some((b) => b.slotId === data.slotId)) {
//       return {
//         success: false,
//         error: "Slot is already booked",
//         code: "DUPLICATE_ERROR",
//       };
//     }

//     const newBooking: Booking = {
//       id: `b${Date.now()}`,
//       userId: data.userId,
//       slotId: data.slotId,
//       vehicleId: data.vehicleId,
//       status: "pending",
//       createdAt: new Date().toISOString(),
//     };

//     mockBookings.push(newBooking);
//     slot.status = "booked";

//     return {
//       success: true,
//       data: newBooking,
//       message: "Slot booked successfully",
//       meta: {
//         id: newBooking.id,
//         timestamp: new Date().toISOString(),
//       },
//     };
//   },
// };
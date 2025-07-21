import { useState } from "react"
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Ban,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Timer,
  ArrowRight,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TimeSlot } from "@/types/availability"
import { formatTime12Hour, getAvailableTimeSlots } from "@/utils/timeUtils"
import { api } from "@/services/api"

const mockSlots: Record<string, TimeSlot[]> = {
  "2025-07-22": [
    {
      id: 1,
      time: "08:00",
      status: "booked",
      customer: "Rajesh Kumar",
      vehicle: "KL 07 AB 1234",
      plan: "premium",
      bookingId: "BK-2025-001",
      customerPhone: "+91 9876543210",
    },
    {
      id: 2,
      time: "10:00",
      status: "booked",
      customer: "Priya Nair",
      vehicle: "KL 23 H 8255",
      plan: "delight",
      bookingId: "BK-2025-002",
      customerPhone: "+91 9876543211",
    },
    { id: 3, time: "12:00", status: "available" },
    { id: 4, time: "14:00", status: "available" },
    {
      id: 5,
      time: "16:00",
      status: "cancelled",
      customer: "Mike Johnson",
      vehicle: "KL 12 A 3456",
      plan: "essential",
      bookingId: "BK-2025-003",
      customerPhone: "+91 9876543212",
    },
    {
      id: 6,
      time: "18:00",
      status: "booked",
      customer: "Anitha Menon",
      vehicle: "KL 45 M 9876",
      plan: "premium",
      bookingId: "BK-2025-004",
      customerPhone: "+91 9876543213",
    },
  ],
  "2025-07-23": [
    { id: 7, time: "08:00", status: "available" },
    {
      id: 8,
      time: "10:00",
      status: "booked",
      customer: "Suresh Pillai",
      vehicle: "KL 67 B 8901",
      plan: "delight",
      bookingId: "BK-2025-005",
      customerPhone: "+91 9876543214",
    },
    { id: 9, time: "12:00", status: "available" },
    {
      id: 10,
      time: "14:00",
      status: "booked",
      customer: "Lakshmi Devi",
      vehicle: "KL 89 C 2345",
      plan: "essential",
      bookingId: "BK-2025-006",
      customerPhone: "+91 9876543215",
    },
    { id: 11, time: "16:00", status: "available" },
    {
      id: 12,
      time: "18:00",
      status: "cancelled",
      customer: "Ravi Varma",
      vehicle: "KL 34 D 5678",
      plan: "premium",
      bookingId: "BK-2025-007",
      customerPhone: "+91 9876543216",
    },
  ],
  "2025-07-24": [
    {
      id: 13,
      time: "08:00",
      status: "booked",
      customer: "Deepa Krishnan",
      vehicle: "KL 56 E 7890",
      plan: "premium",
      bookingId: "BK-2025-008",
      customerPhone: "+91 9876543217",
    },
    { id: 14, time: "10:00", status: "available" },
    {
      id: 15,
      time: "12:00",
      status: "booked",
      customer: "Arun Nair",
      vehicle: "KL 78 F 1234",
      plan: "delight",
      bookingId: "BK-2025-009",
      customerPhone: "+91 9876543218",
    },
    { id: 16, time: "14:00", status: "available" },
    {
      id: 17,
      time: "16:00",
      status: "booked",
      customer: "Meera Sasi",
      vehicle: "KL 90 G 5678",
      plan: "essential",
      bookingId: "BK-2025-010",
      customerPhone: "+91 9876543219",
    },
    { id: 18, time: "18:00", status: "available" },
  ],
  "2025-07-25": [
    { id: 19, time: "08:00", status: "available" },
    {
      id: 20,
      time: "10:00",
      status: "booked",
      customer: "Vinod Kumar",
      vehicle: "KL 12 H 9012",
      plan: "premium",
      bookingId: "BK-2025-011",
      customerPhone: "+91 9876543220",
    },
    { id: 21, time: "12:00", status: "available" },
    { id: 22, time: "14:00", status: "available" },
    {
      id: 23,
      time: "16:00",
      status: "booked",
      customer: "Sita Ramesh",
      vehicle: "KL 34 J 3456",
      plan: "delight",
      bookingId: "BK-2025-012",
      customerPhone: "+91 9876543221",
    },
    { id: 24, time: "18:00", status: "available" },
  ],
  "2025-07-26": [
    {
      id: 25,
      time: "08:00",
      status: "booked",
      customer: "Gopal Menon",
      vehicle: "KL 56 K 7890",
      plan: "essential",
      bookingId: "BK-2025-013",
      customerPhone: "+91 9876543222",
    },
    {
      id: 26,
      time: "10:00",
      status: "booked",
      customer: "Radha Krishnan",
      vehicle: "KL 78 L 1234",
      plan: "premium",
      bookingId: "BK-2025-014",
      customerPhone: "+91 9876543223",
    },
    { id: 27, time: "12:00", status: "available" },
    {
      id: 28,
      time: "14:00",
      status: "cancelled",
      customer: "Biju Thomas",
      vehicle: "KL 90 M 5678",
      plan: "delight",
      bookingId: "BK-2025-015",
      customerPhone: "+91 9876543224",
    },
    { id: 29, time: "16:00", status: "available" },
    { id: 30, time: "18:00", status: "available" },
  ],
  "2025-07-27": [
    { id: 31, time: "08:00", status: "available" },
    { id: 32, time: "10:00", status: "available" },
    {
      id: 33,
      time: "12:00",
      status: "booked",
      customer: "Suma Nair",
      vehicle: "KL 12 N 9012",
      plan: "premium",
      bookingId: "BK-2025-016",
      customerPhone: "+91 9876543225",
    },
    { id: 34, time: "14:00", status: "available" },
    {
      id: 35,
      time: "16:00",
      status: "booked",
      customer: "Raman Pillai",
      vehicle: "KL 34 P 3456",
      plan: "delight",
      bookingId: "BK-2025-017",
      customerPhone: "+91 9876543226",
    },
    { id: 36, time: "18:00", status: "available" },
  ],
}

interface ScheduleManagementProps {
  loading?: boolean
}

export function ScheduleManagement({ loading = false }: ScheduleManagementProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [slots, setSlots] = useState<Record<string, TimeSlot[]>>(mockSlots)
  const [showSlotModal, setShowSlotModal] = useState<boolean>(false)
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [slotStatusFilter, setSlotStatusFilter] = useState<string>("all")
  const [slotLoading, setSlotLoading] = useState<boolean>(false)
  const [creating, setCreating] = useState<boolean>(false)
  const [selectedSlotDetails, setSelectedSlotDetails] = useState<TimeSlot | null>(null)
  const [errors, setErrors] = useState<{
    times?: string
    general?: string
  }>({})

  // Get formatted date string
  const getDateString = (date: Date): string => {
    return date.toISOString().split("T")[0]
  }

  // Check if date is in the future
  const isFutureDate = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }

  // Get slots for selected date
  const getSelectedDateSlots = (): TimeSlot[] => {
    const dateString = getDateString(selectedDate)
    const dateSlots = slots[dateString] || []

    if (slotStatusFilter === "all") {
      return dateSlots
    }

    return dateSlots.filter((slot) => slot.status === slotStatusFilter)
  }

  // Check if time slot is available (2-hour gap validation)
  const isTimeSlotAvailable = (time: string): boolean => {
    const dateString = getDateString(selectedDate)
    const existingSlots = slots[dateString] || []
    const newTime = new Date(`2000-01-01T${time}:00`)

    for (const slot of existingSlots) {
      const slotTime = new Date(`2000-01-01T${slot.time}:00`)
      const timeDiff = Math.abs(newTime.getTime() - slotTime.getTime()) / (1000 * 60) // minutes

      if (timeDiff < 120) {
        return false
      }
    }
    return true
  }

  // Handle multiple time selection
  const handleTimeSelection = (time: string): void => {
    if (!isTimeSlotAvailable(time)) return

    setSelectedTimes((prev) => {
      if (prev.includes(time)) {
        return prev.filter((t) => t !== time)
      } else {
        return [...prev, time].sort()
      }
    })
  }

  // Validate slot creation
  const validateSlots = (): boolean => {
    const newErrors: typeof errors = {}

    if (selectedTimes.length === 0) {
      newErrors.times = "Please select at least one time slot"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add multiple slots with API call
  const handleAddSlots = async (): Promise<void> => {
    if (!validateSlots()) return

    if (!isFutureDate(selectedDate)) {
      setErrors({ general: "Cannot create slots for past dates" })
      return
    }

    setCreating(true)
    try {
      const dateString = getDateString(selectedDate)
      const response = await api.createSlots(dateString, selectedTimes)

      if (response.success && response.data) {
        setSlots((prev) => ({
          ...prev,
          [dateString]: [...(prev[dateString] || []), ...response.data!].sort((a, b) => a.time.localeCompare(b.time)),
        }))

        setSelectedTimes([])
        setErrors({})
        setShowSlotModal(false)
      } else {
        setErrors({ general: response.error || "Failed to create slots" })
      }
    } catch  {
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setCreating(false)
    }
  }

  // Delete slot with API call
  const handleDeleteSlot = async (slotId: number): Promise<void> => {
    const dateString = getDateString(selectedDate)
    const slot = (slots[dateString] || []).find((s) => s.id === slotId)
    if (!slot || slot.status === "booked") return

    setSlotLoading(true)
    try {
      const response = await api.deleteSlot(slotId)

      if (response.success) {
        setSlots((prev) => ({
          ...prev,
          [dateString]: prev[dateString]?.filter((slot) => slot.id !== slotId) || [],
        }))
      }
    } catch (error) {
      console.error("Failed to delete slot:", error)
    } finally {
      setSlotLoading(false)
    }
  }

  // Refresh slots data
  const handleRefreshSlots = async (): Promise<void> => {
    setSlotLoading(true)
    try {
      const dateString = getDateString(selectedDate)
      const response = await api.getSlots(dateString)

      if (response.success && response.data) {
        setSlots((prev) => ({
          ...prev,
          [dateString]: response.data!,
        }))
      }
    } catch (error) {
      console.error("Failed to refresh slots:", error)
    } finally {
      setSlotLoading(false)
    }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 42; i++) {
      const dateString = getDateString(current)
      const dateSlots = slots[dateString] || []
      const hasSlots = dateSlots.length > 0
      const isCurrentMonth = current.getMonth() === month
      const isToday = current.toDateString() === new Date().toDateString()
      const isSelected = current.toDateString() === selectedDate.toDateString()
      const isPast = current < today

      days.push({
        date: new Date(current),
        dateString,
        hasSlots,
        isCurrentMonth,
        isToday,
        isSelected,
        isPast,
        slotsCount: dateSlots.length,
        bookedCount: dateSlots.filter((s) => s.status === "booked").length,
        availableCount: dateSlots.filter((s) => s.status === "available").length,
        cancelledCount: dateSlots.filter((s) => s.status === "cancelled").length,
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const selectedDateSlots = getSelectedDateSlots()
  const allSelectedDateSlots = slots[getDateString(selectedDate)] || []
  const availableSlotsCount = allSelectedDateSlots.filter((slot) => slot.status === "available").length
  const bookedSlotsCount = allSelectedDateSlots.filter((slot) => slot.status === "booked").length
  const cancelledSlotsCount = allSelectedDateSlots.filter((slot) => slot.status === "cancelled").length
  const availableTimeSlots = getAvailableTimeSlots(selectedDate)

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-1">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="flex items-center gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border-2 border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                        <div>
                          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
      {/* Compact Calendar */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Calendar</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs font-medium min-w-[80px] text-center">
                  {currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => !day.isPast && setSelectedDate(day.date)}
                  disabled={day.isPast}
                  className={cn(
                    "aspect-square p-1 text-xs rounded-lg relative font-medium transition-colors",
                    !day.isCurrentMonth && "text-gray-300",
                    day.isPast && "text-gray-300 cursor-not-allowed bg-gray-50",
                    day.isCurrentMonth && !day.isPast && "text-gray-700 hover:bg-blue-50 hover:text-blue-700",
                    day.isToday && !day.isSelected && "bg-blue-100 text-blue-700 ring-2 ring-blue-200",
                    day.isSelected && "bg-blue-600 text-white shadow-lg ring-2 ring-blue-300",
                    day.hasSlots &&
                      !day.isSelected &&
                      !day.isPast &&
                      "bg-green-50 text-green-700 border border-green-200",
                  )}
                >
                  {day.date.getDate()}
                  {day.hasSlots && !day.isPast && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        {day.slotsCount}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Slots Management */}
      <div className="xl:col-span-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{availableSlotsCount} Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{bookedSlotsCount} Booked</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{cancelledSlotsCount} Cancelled</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Compact Status Filter */}
                <div className="flex gap-1">
                  <Button
                    variant={slotStatusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlotStatusFilter("all")}
                    className="text-xs h-7 px-2"
                  >
                    All
                  </Button>
                  <Button
                    variant={slotStatusFilter === "available" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlotStatusFilter("available")}
                    className="text-xs h-7 px-2"
                  >
                    Available
                  </Button>
                  <Button
                    variant={slotStatusFilter === "booked" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlotStatusFilter("booked")}
                    className="text-xs h-7 px-2"
                  >
                    Booked
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleRefreshSlots}
                  disabled={slotLoading}
                  className="h-7 px-2 bg-transparent"
                  size="sm"
                >
                  <RefreshCw className={cn("w-3 h-3", slotLoading && "animate-spin")} />
                </Button>
                {isFutureDate(selectedDate) && availableTimeSlots.length > 0 && (
                  <Button onClick={() => setShowSlotModal(true)} className="h-7 px-2" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            {!isFutureDate(selectedDate) ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-1">Past Date Selected</h4>
                <p className="text-gray-500 text-sm">Cannot manage slots for past dates</p>
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="text-center py-8">
                <Timer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-1">No Available Time Slots</h4>
                <p className="text-gray-500 text-sm">All time slots for today have passed</p>
              </div>
            ) : selectedDateSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-1">
                  {slotStatusFilter === "all" ? "No Slots Created" : `No ${slotStatusFilter} Slots`}
                </h4>
                <p className="text-gray-500 mb-4 text-sm">
                  {slotStatusFilter === "all"
                    ? "Create your first slot for this date"
                    : `No ${slotStatusFilter} slots found for this date`}
                </p>
                {slotStatusFilter === "all" && (
                  <Button onClick={() => setShowSlotModal(true)} className="shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Slot
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {selectedDateSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all hover:shadow-md",
                      slot.status === "available" && "bg-green-50 border-green-200 hover:border-green-300",
                      slot.status === "booked" && "bg-blue-50 border-blue-200 hover:border-blue-300",
                      slot.status === "cancelled" && "bg-red-50 border-red-200 hover:border-red-300",
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm",
                            slot.status === "available" && "bg-green-100 text-green-600",
                            slot.status === "booked" && "bg-blue-100 text-blue-600",
                            slot.status === "cancelled" && "bg-red-100 text-red-600",
                          )}
                        >
                          {slot.status === "available" && <Clock className="w-5 h-5" />}
                          {slot.status === "booked" && <CheckCircle className="w-5 h-5" />}
                          {slot.status === "cancelled" && <Ban className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{formatTime12Hour(slot.time)}</p>
                          <p className="text-xs text-gray-600">2 hours</p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs font-medium shadow-sm capitalize",
                          slot.status === "available" && "bg-green-100 text-green-800 hover:bg-green-100",
                          slot.status === "booked" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
                          slot.status === "cancelled" && "bg-red-100 text-red-800 hover:bg-red-100",
                        )}
                      >
                        {slot.status}
                      </Badge>
                    </div>

                    {/* Clean Action Buttons */}
                    {slot.status === "available" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        onClick={() => handleDeleteSlot(slot.id)}
                        disabled={slotLoading}
                      >
                        {slotLoading ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3 mr-1" />
                        )}
                        Delete
                      </Button>
                    )}

                    {slot.status === "booked" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
                        onClick={() => setSelectedSlotDetails(slot)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}

                    {slot.status === "cancelled" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        onClick={() => handleDeleteSlot(slot.id)}
                        disabled={slotLoading}
                      >
                        {slotLoading ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3 mr-1" />
                        )}
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slot Creation Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add Time Slots</h3>
                <button
                  onClick={() => {
                    setShowSlotModal(false)
                    setSelectedTimes([])
                    setErrors({})
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
                  disabled={creating}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Time Slots ({selectedTimes.length} selected)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((time) => {
                      const isAvailable = isTimeSlotAvailable(time)
                      const isSelected = selectedTimes.includes(time)

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSelection(time)}
                          disabled={!isAvailable || creating}
                          className={cn(
                            "p-3 rounded-lg border-2 text-center relative transition-all",
                            isSelected && "border-blue-500 bg-blue-50 text-blue-700 shadow-md",
                            !isSelected && isAvailable && "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                            !isAvailable && "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed",
                            creating && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          <div className="font-bold text-base">{formatTime12Hour(time)}</div>
                          <div className="text-xs text-gray-500 mt-1">2 hours</div>
                          {!isAvailable && <div className="text-xs text-red-500 mt-1">Unavailable</div>}
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {errors.times && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {errors.times}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <AlertCircle className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Universal Booking</p>
                      <p className="text-sm text-blue-800">
                        Any service type can be booked in these slots. Customers choose their plan when booking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleAddSlots} className="flex-1" disabled={selectedTimes.length === 0 || creating}>
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create {selectedTimes.length} Slot{selectedTimes.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSlotModal(false)
                    setSelectedTimes([])
                    setErrors({})
                  }}
                  className="flex-1"
                  disabled={creating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slot Details Modal */}
      {selectedSlotDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
                <button
                  onClick={() => setSelectedSlotDetails(null)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{formatTime12Hour(selectedSlotDetails.time)}</p>
                    <p className="text-sm text-gray-600">2 hours duration</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="font-semibold text-gray-900">{selectedSlotDetails.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Vehicle</p>
                    <p className="font-mono text-gray-900">{selectedSlotDetails.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service Plan</p>
                    <Badge variant="outline" className="mt-1">
                      {selectedSlotDetails.plan}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{selectedSlotDetails.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Booking ID</p>
                    <p className="font-mono text-gray-900">{selectedSlotDetails.bookingId}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Full Details
                </Button>
                <Button variant="outline" onClick={() => setSelectedSlotDetails(null)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


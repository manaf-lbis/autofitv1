import type React from "react"
import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Ban,
  Loader2,
  AlertCircle,
  Lock,
  Settings,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type IPretripSlot, type IBlockedSchedule, SlotStatus } from "@/types/pretrip"
import { getDateString, formatTime, isTimeOverlap } from "@/utils/utilityFunctions/dateUtils"
import ScheduleManagementShimer from "../../components/shimmer/jobs/ScheduleManagementShimer"
import WorkingHoursModal from "../workingHours/WorkingHoursModal"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { useWeeklySchedulesQuery, useBlockScheduleMutation, useUnblockScheduleMutation } from "@/services/mechanicServices/pretripMechanicApi"
import PretripSlotDetailsModal from "./PretripSlotDetailsModal"
import { format } from "date-fns"

interface IApiResponse {
  status: string
  message: string
  data: {
    bookings: IPretripSlot[]
    blockings: {
      id: string
      date: string
      startMinutes: string
      endMinutes: string
      reason: string
    }[]
  }
}

const isValidDate = (date: Date, today: Date): boolean => {
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  const sevenDaysFromToday = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)
  sevenDaysFromToday.setHours(23, 59, 59, 999)
  return checkDate >= today && checkDate <= sevenDaysFromToday
}

const isSlotEffectivelyBlocked = (slot: IPretripSlot, blocks: IBlockedSchedule[]): boolean => {
  const slotStart = new Date(slot.schedule.start)
  const slotEnd = new Date(slot.schedule.end)
  return blocks.some((block) => {
    if (block.isFullDayBlock) return true
    if (block.blockedTiming) {
      const [blockFromHours, blockFromMinutes] = block.blockedTiming.from.split(":").map(Number)
      const [blockToHours, blockToMinutes] = block.blockedTiming.to.split(":").map(Number)
      const blockStart = new Date(
        new Date(block.date).getFullYear(),
        new Date(block.date).getMonth(),
        new Date(block.date).getDate(),
        blockFromHours,
        blockFromMinutes,
        0,
        0,
      )
      const blockEnd = new Date(
        new Date(block.date).getFullYear(),
        new Date(block.date).getMonth(),
        new Date(block.date).getDate(),
        blockToHours,
        blockToMinutes,
        0,
        0,
      )
      return isTimeOverlap(slotStart, slotEnd, blockStart, blockEnd)
    }
    return false
  })
}

const getSplitSlotTimes = (slot: IPretripSlot, blocks: IBlockedSchedule[]): { start: Date; end: Date; isBreak: boolean }[] => {
  const slotStart = new Date(slot.schedule.start)
  const slotEnd = new Date(slot.schedule.end)
  const times: { start: Date; end: Date; isBreak: boolean }[] = [{ start: slotStart, end: slotEnd, isBreak: false }]

  blocks.forEach((block) => {
    if (block.blockedTiming) {
      const [blockFromHours, blockFromMinutes] = block.blockedTiming.from.split(":").map(Number)
      const [blockToHours, blockToMinutes] = block.blockedTiming.to.split(":").map(Number)
      const blockStart = new Date(
        new Date(block.date).getFullYear(),
        new Date(block.date).getMonth(),
        new Date(block.date).getDate(),
        blockFromHours,
        blockFromMinutes,
        0,
        0,
      )
      const blockEnd = new Date(
        new Date(block.date).getFullYear(),
        new Date(block.date).getMonth(),
        new Date(block.date).getDate(),
        blockToHours,
        blockToMinutes,
        0,
        0,
      )

      if (isTimeOverlap(slotStart, slotEnd, blockStart, blockEnd)) {
        const newTimes = []
        if (slotStart < blockStart) newTimes.push({ start: slotStart, end: blockStart, isBreak: false })
        if (blockEnd < slotEnd) newTimes.push({ start: blockEnd, end: slotEnd, isBreak: false })
        newTimes.push({ start: blockStart, end: blockEnd, isBreak: true })
        times.splice(0, times.length, ...newTimes.filter(t => t.start < t.end))
      }
    }
  })

  return times.filter(t => t.start < t.end)
}

export default function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [blockType, setBlockType] = useState<"fullDay" | "timeRange">("fullDay")
  const [blockFrom, setBlockFrom] = useState("09:00")
  const [blockTo, setBlockTo] = useState("17:00")
  const [blockReason, setBlockReason] = useState("")
  const [errors, setErrors] = useState<{ general?: string; block?: string }>({})
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<IPretripSlot | null>(null)

  const { data, isLoading } = useWeeklySchedulesQuery() as { data: IApiResponse | undefined; isLoading: boolean }
  const [blockSchedule, { isLoading: blockLoading }] = useBlockScheduleMutation()
  const [unblockSchedule, { isLoading: unblockLoading }] = useUnblockScheduleMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const allSlots: IPretripSlot[] = data?.data.bookings || []
  const allBlockedSchedules: IBlockedSchedule[] = data?.data.blockings.map(blocking => ({
    _id: blocking.id,
    date: blocking.date,
    isFullDayBlock: blocking.startMinutes === "00:00" && blocking.endMinutes === "23:59",
    blockedTiming: blocking.startMinutes !== "00:00" || blocking.endMinutes !== "23:59" ? { from: blocking.startMinutes, to: blocking.endMinutes } : undefined,
    reason: blocking.reason,
  })) || []

  useEffect(() => {
    setErrors({})
    if (showBlockModal) {
      setBlockType("fullDay")
      setBlockFrom("09:00")
      setBlockTo("17:00")
      setBlockReason("")
    }
  }, [selectedDate,showBlockModal])

  const selectedDateSlots = allSlots.filter(
    (slot) =>
      getDateString(new Date(slot.schedule.start)) === getDateString(selectedDate) &&
      (slot.status === SlotStatus.BOOKED || slot.status === SlotStatus.CANCELLED),
  )
  const selectedDateBlockedSchedules = allBlockedSchedules.filter(
    (block) => getDateString(new Date(block.date)) === getDateString(selectedDate),
  )

  const validateBlockSchedule = (): boolean => {
    const newErrors: { block?: string } = {}
    setErrors({})

    if (!isValidDate(selectedDate, today)) {
      newErrors.block = "Cannot block schedules for past or beyond 7 days"
    } else {
      let proposedBlockStart: Date
      let proposedBlockEnd: Date

      if (blockType === "fullDay") {
        proposedBlockStart = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          0,
          0,
          0,
          0,
        )
        proposedBlockEnd = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          23,
          59,
          59,
          999,
        )
      } else {
        const [fromH, fromM] = blockFrom.split(":").map(Number)
        const [toH, toM] = blockTo.split(":").map(Number)

        if (isNaN(fromH) || isNaN(fromM) || isNaN(toH) || isNaN(toM)) {
          newErrors.block = "Please enter valid time values."
          setErrors(newErrors)
          return false
        }

        proposedBlockStart = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          fromH,
          fromM,
          0,
          0,
        )
        proposedBlockEnd = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          toH,
          toM,
          0,
          0,
        )

        if (proposedBlockStart >= proposedBlockEnd) {
          newErrors.block = "End time must be after start time."
          setErrors(newErrors)
          return false
        }
      }

      const existingBlocksOnDate = allBlockedSchedules.filter(
        (block) => getDateString(new Date(block.date)) === getDateString(selectedDate),
      )

      const hasFullDayBlock = existingBlocksOnDate.some((block) => block.isFullDayBlock)
      if (hasFullDayBlock) {
        newErrors.block = "❌ This day is already fully blocked! Cannot add additional blocks."
        setErrors(newErrors)
        return false
      }

      if (blockType === "fullDay" && existingBlocksOnDate.length > 0) {
        const existingTimeBlocks = existingBlocksOnDate
          .filter((block) => !block.isFullDayBlock)
          .map((block) => `${block.blockedTiming?.from} - ${block.blockedTiming?.to}`)
          .join(", ")
        newErrors.block = `❌ Cannot block full day! Existing time blocks: ${existingTimeBlocks}. Remove them first.`
        setErrors(newErrors)
        return false
      }

      if (blockType === "timeRange") {
        const overlappingBlocks = existingBlocksOnDate.filter((existingBlock) => {
          if (existingBlock.isFullDayBlock) return true
          if (existingBlock.blockedTiming) {
            const [existingFromH, existingFromM] = existingBlock.blockedTiming.from.split(":").map(Number)
            const [existingToH, existingToM] = existingBlock.blockedTiming.to.split(":").map(Number)
            const existingStart = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              existingFromH,
              existingFromM,
              0,
              0,
            )
            const existingEnd = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              existingToH,
              existingToM,
              0,
              0,
            )
            return isTimeOverlap(proposedBlockStart, proposedBlockEnd, existingStart, existingEnd)
          }
          return false
        })

        if (overlappingBlocks.length > 0) {
          const conflictingTimes = overlappingBlocks
            .map((block) => (block.isFullDayBlock ? "Full Day" : `${block.blockedTiming?.from} - ${block.blockedTiming?.to}`))
            .join(", ")
          newErrors.block = `❌ Time range overlaps with: ${conflictingTimes}. Adjust or remove existing blocks.`
          setErrors(newErrors)
          return false
        }
      }

      const bookedSlotsOnDate = allSlots.filter(
        (slot) =>
          getDateString(new Date(slot.schedule.start)) === getDateString(selectedDate) &&
          slot.status === SlotStatus.BOOKED,
      )

      const conflictingSlots = bookedSlotsOnDate.filter((slot) => {
        const bookedSlotStart = new Date(slot.schedule.start)
        const bookedSlotEnd = new Date(slot.schedule.end)
        return isTimeOverlap(proposedBlockStart, proposedBlockEnd, bookedSlotStart, bookedSlotEnd)
      })

      if (conflictingSlots.length > 0) {
        const conflictTimes = conflictingSlots
          .map((slot) => {
            const start = new Date(slot.schedule.start)
            const end = new Date(slot.schedule.end)
            return `${formatTime(start)} - ${formatTime(end)}`
          })
          .join(", ")
        newErrors.block = `❌ Conflicts with bookings at: ${conflictTimes}. Cancel them first.`
      }

      if (blockType === "fullDay" && bookedSlotsOnDate.length > 0) {
        const allBookedTimes = bookedSlotsOnDate
          .map((slot) => {
            const start = new Date(slot.schedule.start)
            const end = new Date(slot.schedule.end)
            return `${formatTime(start)} - ${formatTime(end)}`
          })
          .join(", ")
        newErrors.block = `❌ Cannot block full day! Bookings at: ${allBookedTimes}. Cancel or use time range.`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBlockSchedule = async () => {
    if (!validateBlockSchedule()) return

    const existingBlocksOnDate = allBlockedSchedules.filter(
      (block) => getDateString(new Date(block.date)) === getDateString(selectedDate),
    )

    if (blockType === "fullDay" && existingBlocksOnDate.length > 0) {
      setErrors({ block: "❌ Cannot create full day block with existing blocks!" })
      return
    }

    if (blockType === "timeRange") {
      const proposedStart = new Date(selectedDate)
      const [fromH, fromM] = blockFrom.split(":").map(Number)
      proposedStart.setHours(fromH, fromM, 0, 0)
      const proposedEnd = new Date(selectedDate)
      const [toH, toM] = blockTo.split(":").map(Number)
      proposedEnd.setHours(toH, toM, 0, 0)

      const hasOverlap = existingBlocksOnDate.some((existingBlock) => {
        if (existingBlock.isFullDayBlock) return true
        if (existingBlock.blockedTiming) {
          const [existingFromH, existingFromM] = existingBlock.blockedTiming.from.split(":").map(Number)
          const [existingToH, existingToM] = existingBlock.blockedTiming.to.split(":").map(Number)
          const existingStart = new Date(selectedDate)
          existingStart.setHours(existingFromH, existingFromM, 0, 0)
          const existingEnd = new Date(selectedDate)
          existingEnd.setHours(existingToH, existingToM, 0, 0)
          return isTimeOverlap(proposedStart, proposedEnd, existingStart, existingEnd)
        }
        return false
      })

      if (hasOverlap) {
        setErrors({ block: "❌ Time range overlaps with existing blocks!" })
        return
      }
    }

    try {
      console.log(selectedDate);
      
      await blockSchedule({
        date: format(selectedDate, "yyyy-MM-dd") ,
        isFullDayBlock: blockType === "fullDay",
        blockedTiming: blockType === "timeRange" ? { from: blockFrom, to: blockTo } : undefined,
        reason: blockReason,
      }).unwrap()

      setBlockReason("")
      setBlockType("fullDay")
      setBlockFrom("09:00")
      setBlockTo("17:00")
      setShowBlockModal(false)
    } catch {
      setErrors({ block: "Failed to block schedule. Please try again." })
    }
  }

  const handleDeleteBlockedSchedule = async (blockId: string) => {
    try {
      await unblockSchedule({ id: blockId }).unwrap()
    } catch (error: any) {
      setErrors({ general: error.data.message })
    }
  }

  const calendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    const days = []
    for (let i = 0; i < 42; i++) {
      const checkDate = new Date(startDate)
      checkDate.setDate(startDate.getDate() + i)
      days.push({
        date: checkDate,
        isCurrentMonth: checkDate.getMonth() === month,
        isToday: checkDate.toDateString() === today.toDateString(),
        isSelected: getDateString(checkDate) === getDateString(selectedDate),
        isValid: isValidDate(checkDate, today),
      })
    }
    return days
  }

  if (isLoading) return <ScheduleManagementShimer />

  return (
    <>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 p-2 sm:p-3 md:p-4 lg:p-6">
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
                    disabled={
                      currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()
                    }
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
                    disabled={
                      currentMonth.getMonth() === new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).getMonth() &&
                      currentMonth.getFullYear() === new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).getFullYear()
                    }
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div key={`${day}-${index}`} className="text-center text-xs font-semibold text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day.isValid && setSelectedDate(day.date)}
                    disabled={!day.isValid}
                    className={cn(
                      "aspect-square p-1 text-xs rounded-lg relative font-medium transition-colors",
                      !day.isCurrentMonth && "text-gray-300",
                      !day.isValid && "text-gray-300 cursor-not-allowed bg-gray-50",
                      day.isCurrentMonth && day.isValid && "text-gray-700 hover:bg-blue-50 hover:text-blue-700",
                      day.isToday && !day.isSelected && "bg-blue-100 text-blue-700 ring-2 ring-blue-200",
                      day.isSelected && "bg-blue-600 text-white shadow-lg ring-2 ring-blue-300",
                    )}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">
                        {selectedDateSlots.filter((slot) => slot.status === SlotStatus.BOOKED).length} Booked
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">
                        {selectedDateSlots.filter((slot) => slot.status === SlotStatus.CANCELLED).length} Cancelled
                      </span>
                    </div>
                    <div className="space-x-1 flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">{selectedDateBlockedSchedules.length} Blocked</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isValidDate(selectedDate, today) && (
                    <Button
                      onClick={() => setShowBlockModal(true)}
                      className="h-8 px-2 sm:px-3 bg-slate-700 hover:bg-slate-800 text-white text-xs"
                      size="sm"
                    >
                      <Ban className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Block Time/Day</span>
                      <span className="sm:hidden">Block</span>
                    </Button>
                  )}
                  <Button onClick={()=>setIsModalOpen(true)} variant="outline" className="h-8 px-2 sm:px-3 bg-transparent text-xs" size="sm">
                    <Settings className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">Change Working Hours</span>
                    <span className="sm:hidden">Hours</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              {!isValidDate(selectedDate, today) ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-base font-medium text-gray-900 mb-1">Invalid Date Selected</h4>
                  <p className="text-gray-500 text-sm">Cannot manage slots for past or beyond 7 days</p>
                </div>
              ) : (
                <>
                  {selectedDateBlockedSchedules.length > 0 && (
                    <div className="mb-6 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Blocked Periods:</h4>
                      {selectedDateBlockedSchedules.map((block) => (
                        <Card
                          key={block._id}
                          className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600 shadow-sm flex-shrink-0">
                              <Lock className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {block.isFullDayBlock
                                  ? "Full Day Blocked"
                                  : `Blocked: ${block.blockedTiming?.from} - ${block.blockedTiming?.to}`}
                              </p>
                              {block.reason && <p className="text-xs text-gray-600 mt-1">{block.reason}</p>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 text-xs px-2 py-1 h-auto rounded-lg"
                            onClick={() => handleDeleteBlockedSchedule(block._id)}
                            disabled={isLoading || unblockLoading}
                          >
                            {unblockLoading ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 mr-1" />
                            )}
                            Remove
                          </Button>
                        </Card>
                      ))}
                      <Separator className="my-4" />
                    </div>
                  )}

                  {selectedDateSlots.length === 0 && selectedDateBlockedSchedules.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="text-base font-medium text-gray-900 mb-1">No Bookings or Blocks for this Date</h4>
                      <p className="text-gray-500 mb-4 text-sm">Block out time if you are unavailable.</p>
                      <Button
                        onClick={() => setShowBlockModal(true)}
                        className="shadow-sm bg-slate-700 hover:bg-slate-800 text-white"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Block Time/Day
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3">
                      {selectedDateSlots.map((slot) => {
                        const splitTimes = getSplitSlotTimes(slot, selectedDateBlockedSchedules)
                        const isBlocked = isSlotEffectivelyBlocked(slot, selectedDateBlockedSchedules)

                        return (
                          <div
                            key={slot._id}
                            className={cn(
                              "p-4 rounded-xl border-2 shadow-md transition-all hover:shadow-lg",
                              slot.status === SlotStatus.BOOKED &&
                                "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-300",
                              slot.status === SlotStatus.CANCELLED &&
                                !isBlocked &&
                                "bg-gradient-to-br from-rose-50 to-red-50 border-rose-200 hover:border-rose-300",
                              isBlocked && "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300",
                            )}
                          >
                            {splitTimes.map((time, index) => (
                              <div key={index} className="mb-3">
                                {!time.isBreak ? (
                                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                    {slot.status === SlotStatus.BOOKED && <Check className="w-4 h-4 text-emerald-600" />}
                                    {`${formatTime(time.start)} - ${formatTime(time.end)}`}
                                  </p>
                                ) : (
                                  <Card className="bg-gray-100 border-gray-200 p-2 text-xs text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <Lock className="w-4 h-4 text-gray-500" />
                                      <span>Break: {`${formatTime(time.start)} - ${formatTime(time.end)}`}</span>
                                    </div>
                                  </Card>
                                )}
                              </div>
                            ))}
                            {slot.status === SlotStatus.BOOKED && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 text-xs py-1.5 rounded-lg"
                                onClick={() => {
                                  setSelectedSlot(slot)
                                  setShowDetailsModal(true)
                                }}
                              >
                                View Details
                              </Button>
                            )}
                            {slot.status === SlotStatus.CANCELLED && !isBlocked && (
                              <div className="text-center text-xs text-gray-500 mt-2">Cancelled</div>
                            )}
                            {isBlocked && (
                              <div className="text-center text-xs text-gray-500 mt-2">
                                This slot is covered by a blocked period.
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto hide-scrollbar">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-slate-700" />
                </div>
                Block Schedule
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                Block{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                to mark it as unavailable for bookings.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {errors.block && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800">Cannot Block Time</h4>
                    <p className="text-sm text-red-700 mt-1">{errors.block}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-3 block">Choose Block Type</Label>
                  <RadioGroup
                    value={blockType}
                    onValueChange={(value: "fullDay" | "timeRange") => setBlockType(value)}
                    className="grid grid-cols-1 gap-3"
                  >
                    <label
                      htmlFor="fullDay"
                      className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50",
                        blockType === "fullDay" ? "border-slate-500 bg-slate-50" : "border-gray-200",
                      )}
                    >
                      <RadioGroupItem value="fullDay" id="fullDay" disabled={blockLoading} />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Block Full Day</div>
                        <div className="text-sm text-gray-600">Mark the entire day as unavailable</div>
                      </div>
                    </label>

                    <label
                      htmlFor="timeRange"
                      className={cn(
                        "flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50",
                        blockType === "timeRange" ? "border-slate-500 bg-slate-50" : "border-gray-200",
                      )}
                    >
                      <RadioGroupItem value="timeRange" id="timeRange" disabled={blockLoading} />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Block Time Range</div>
                        <div className="text-sm text-gray-600">Block specific hours only</div>
                      </div>
                    </label>
                  </RadioGroup>
                </div>

                {blockType === "timeRange" && (
                  <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-600" />
                        Time Range
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="blockFrom" className="text-sm font-medium text-gray-700">
                            From
                          </Label>
                          <Input
                            id="blockFrom"
                            type="time"
                            value={blockFrom}
                            onChange={(e) => setBlockFrom(e.target.value)}
                            disabled={blockLoading}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="blockTo" className="text-sm font-medium text-gray-700">
                            To
                          </Label>
                          <Input
                            id="blockTo"
                            type="time"
                            value={blockTo}
                            onChange={(e) => setBlockTo(e.target.value)}
                            disabled={blockLoading}
                            className="h-11"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label htmlFor="blockReason" className="text-base font-semibold text-gray-900">
                    Reason (Optional)
                  </Label>
                  <Textarea
                    id="blockReason"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="e.g., Personal appointment, Team meeting, Equipment maintenance..."
                    disabled={blockLoading}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBlockModal(false)
                  setBlockReason("")
                  setBlockType("fullDay")
                  setBlockFrom("09:00")
                  setBlockTo("17:00")
                  setErrors({})
                }}
                disabled={blockLoading}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBlockSchedule}
                className="bg-slate-700 hover:bg-slate-800 text-white flex-1 sm:flex-none"
                disabled={blockLoading}
              >
                {blockLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Blocking Schedule...
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    Block Schedule
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showDetailsModal && selectedSlot && (
          <PretripSlotDetailsModal slot={selectedSlot} onClose={() => setShowDetailsModal(false)} />
        )}

            <WorkingHoursModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />
      </div>
    </>
  )
}

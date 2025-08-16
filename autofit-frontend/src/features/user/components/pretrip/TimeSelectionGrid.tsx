import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type React from "react"
import type { TimeWindow } from "@/types/pretrip" 
import { minutesToTime, calculateServiceCompletion } from "../../utils/timeSlotUtils" 

interface TimeSelectionGridProps {
  selectedHour: number | null
  selectedMinute: number | null
  selectedPeriod: "AM" | "PM" | null
  onSelectHour: (hour: number) => void
  onSelectMinute: (minute: number) => void
  onSelectPeriod: (period: "AM" | "PM") => void
  availableWindow: { start: string; end: string } | null
  durationMinutes: number
  selectedDate: string
  availableWindows: TimeWindow[] 
}

const generateHours = () => {
  return Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i)) 
}

const generateMinutes = () => {
  return Array.from({ length: 12 }, (_, i) => i * 5)
}

const generatePeriods = () => {
  return ["AM", "PM"]
}

export const TimeSelectionGrid: React.FC<TimeSelectionGridProps> = ({
  selectedHour,
  selectedMinute,
  selectedPeriod,
  onSelectHour,
  onSelectMinute,
  onSelectPeriod,
  availableWindow,
  durationMinutes,
  availableWindows, 
}) => {

  const isFullTimeValid = (hour: number, minute: number, period: "AM" | "PM") => {
    if (!availableWindow || availableWindows.length === 0) return false

    let h24 = hour
    if (period === "PM" && hour !== 12) h24 += 12
    if (period === "AM" && hour === 12) h24 = 0 

    const proposedTime = minutesToTime(h24 * 60 + minute)
    const completion = calculateServiceCompletion(proposedTime, durationMinutes, availableWindows)
    return completion.canComplete
  }

  const canSelectOption = (testHour: number | null, testMinute: number | null, testPeriod: "AM" | "PM" | null) => {
    if (!availableWindow || availableWindows.length === 0) return false

    const hoursToTest = testHour !== null ? [testHour] : generateHours()
    const minutesToTest = testMinute !== null ? [testMinute] : generateMinutes()
    const periodsToTest: ("AM" | "PM")[] = testPeriod !== null ? [testPeriod] : (generatePeriods() as ("AM" | "PM")[])

    for (const h of hoursToTest) {
      for (const m of minutesToTest) {
        for (const p of periodsToTest) {
          if (isFullTimeValid(h, m, p)) {
            return true 
          }
        }
      }
    }
    return false 
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3 p-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500 text-center font-medium">Hour</span>
        <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto no-scrollbar">
          {generateHours().map((hour) => {
            const isDisabled = !canSelectOption(hour, selectedMinute, selectedPeriod)
            return (
              <Button
                key={hour}
                variant={selectedHour === hour ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectHour(hour)}
                className={cn(
                  "w-16 h-10 text-base font-semibold",
                  selectedHour === hour
                    ? "bg-blue-600 text-white hover:bg-blue-500" 
                    : "text-gray-800 hover:bg-blue-100 hover:border-blue-400", 
                  isDisabled && "opacity-50 cursor-not-allowed",
                )}
                disabled={isDisabled}
              >
                {String(hour).padStart(2, "0")}
              </Button>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500 text-center font-medium">Minute</span>
        <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto no-scrollbar">
          {generateMinutes().map((minute) => {
            const isDisabled = !canSelectOption(selectedHour, minute, selectedPeriod)
            return (
              <Button
                key={minute}
                variant={selectedMinute === minute ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectMinute(minute)}
                className={cn(
                  "w-16 h-10 text-base font-semibold",
                  selectedMinute === minute
                    ? "bg-blue-600 text-white hover:bg-blue-500" 
                    : "text-gray-800 hover:bg-blue-100 hover:border-blue-400", 
                  isDisabled && "opacity-50 cursor-not-allowed",
                )}
                disabled={isDisabled}
              >
                {String(minute).padStart(2, "0")}
              </Button>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-500 text-center font-medium">Period</span>
        <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto no-scrollbar">
          {(generatePeriods() as ("AM" | "PM")[]).map((period) => {
            const isDisabled = !canSelectOption(selectedHour, selectedMinute, period)
            return (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectPeriod(period)}
                className={cn(
                  "w-16 h-10 text-base font-semibold",
                  selectedPeriod === period
                    ? "bg-blue-600 text-white hover:bg-blue-500" 
                    : "text-gray-800 hover:bg-blue-100 hover:border-blue-400",
                  isDisabled && "opacity-50 cursor-not-allowed",
                )}
                disabled={isDisabled}
              >
                {period}
              </Button>
            )
          })}
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  )
}

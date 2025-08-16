
import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimeSelectionGrid } from "./TimeSelectionGrid"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDisplayTime } from "../../utils/timeSlotUtils" 
import type { TimeWindow } from "@/types/pretrip" 

interface TimeSpinnerInputProps {
  value: string
  onChange: (time: string) => void
  min?: string
  max?: string
  className?: string
  placeholder?: string
  availableWindow: { start: string; end: string } | null
  durationMinutes: number
  selectedDate: string
  availableWindows: TimeWindow[]
}

const parseTime = (timeString: string): { hour: number | null; minute: number | null; period: "AM" | "PM" | null } => {
  if (!timeString) return { hour: null, minute: null, period: null }
  const [hours24, minutes] = timeString.split(":").map(Number)
  let hour = hours24
  let period: "AM" | "PM" = "AM" 

  if (hours24 >= 12) {
    period = "PM"
    if (hours24 > 12) hour = hours24 - 12
  } else if (hours24 === 0) {
    hour = 12 
  }

  return { hour, minute: minutes, period }
}

export const TimeSpinnerInput: React.FC<TimeSpinnerInputProps> = ({
  value,
  onChange,
  className,
  placeholder,
  availableWindow,
  durationMinutes,
  selectedDate,
  availableWindows,
}) => {

  const [selectedHour, setSelectedHour] = useState<number | null>(() => {
    const parsed = parseTime(value)
    return parsed.hour
  })
  const [selectedMinute, setSelectedMinute] = useState<number | null>(() => {
    const parsed = parseTime(value)
    return parsed.minute
  })
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM" | null>(() => {
    const parsed = parseTime(value)
    return parsed.period
  })
  const [open, setOpen] = useState(false)

  const isInternalUpdate = useRef(false)


  useEffect(() => {
    if (!isInternalUpdate.current) {
      const { hour, minute, period } = parseTime(value)
      setSelectedHour(hour)
      setSelectedMinute(minute)
      setSelectedPeriod(period)
    }
    isInternalUpdate.current = false
  }, [value])


  useEffect(() => {
    if (selectedHour !== null && selectedMinute !== null && selectedPeriod !== null) {
      let h24 = selectedHour
      if (selectedPeriod === "PM" && selectedHour !== 12) h24 += 12
      if (selectedPeriod === "AM" && selectedHour === 12) h24 = 0 

      const newTime = `${String(h24).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`
      if (newTime !== value) {
        isInternalUpdate.current = true 
        onChange(newTime)
      }
    }
  }, [selectedHour, selectedMinute, selectedPeriod, onChange, value])


  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])

  const handleSelectMinute = useCallback((minute: number) => {
    setSelectedMinute(minute)
  }, [])

  const handleSelectPeriod = useCallback((period: "AM" | "PM") => {
    setSelectedPeriod(period)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left h-12 sm:h-14 text-base sm:text-lg font-medium",
            !value && "text-gray-400",
            className,
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? formatDisplayTime(value) : placeholder || "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <TimeSelectionGrid
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          selectedPeriod={selectedPeriod}
          onSelectHour={handleSelectHour}
          onSelectMinute={handleSelectMinute}
          onSelectPeriod={handleSelectPeriod}
          availableWindow={availableWindow}
          durationMinutes={durationMinutes}
          selectedDate={selectedDate}
          availableWindows={availableWindows} 
        />
      </PopoverContent>
    </Popover>
  )
}

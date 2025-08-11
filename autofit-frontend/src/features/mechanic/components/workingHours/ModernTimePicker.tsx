import React from "react"
import { ChevronUp, ChevronDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { parse } from "date-fns"
import { formatTime12Hour } from "@/lib/dateFormater"

interface ModernTimePickerProps {
  value: string
  onChange: (time: string) => void
  label?: string
  isOpen: boolean
  onToggle: () => void
}

const ModernTimePicker: React.FC<ModernTimePickerProps> = ({ value, onChange, label, isOpen, onToggle }) => {

  const date = parse(value, "HH:mm", new Date())
  const hours = date.getHours()
  const minutes = date.getMinutes()


  const updateTime = (newHours: number, newMinutes: number) => {
    const timeString = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
    onChange(timeString)
  }

  const adjustHours = (increment: boolean) => {
    const newHours = increment ? (hours + 1) % 24 : hours === 0 ? 23 : hours - 1
    updateTime(newHours, minutes)
  }

  const adjustMinutes = (increment: boolean) => {
    const newMinutes = increment ? (minutes + 15) % 60 : minutes === 0 ? 45 : minutes - 15
    updateTime(hours, newMinutes)
  }

  const quickTimes = [
    { label: "6:00 AM", value: "06:00" },
    { label: "7:00 AM", value: "07:00" },
    { label: "8:00 AM", value: "08:00" },
    { label: "9:00 AM", value: "09:00" },
    { label: "10:00 AM", value: "10:00" },
    { label: "12:00 PM", value: "12:00" },
    { label: "1:00 PM", value: "13:00" },
    { label: "2:00 PM", value: "14:00" },
    { label: "5:00 PM", value: "17:00" },
    { label: "6:00 PM", value: "18:00" },
    { label: "8:00 PM", value: "20:00" },
    { label: "10:00 PM", value: "22:00" },
  ]

  return (
    <div className="relative">
      {label && <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>}
      <Button
        type="button"
        variant="outline"
        onClick={onToggle}
        className="w-full justify-between h-12 text-sm font-medium bg-transparent"
      >
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          {formatTime12Hour(hours, minutes)}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-[60] mt-2 p-4 shadow-lg border max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="flex flex-col items-center">
              <Button type="button" variant="ghost" size="sm" onClick={() => adjustHours(true)} className="h-8 w-8 p-0">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="text-2xl font-bold py-2 min-w-[2.5rem] text-center">
                {hours.toString().padStart(2, "0")}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => adjustHours(false)} className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="text-xs text-gray-500 mt-1">Hours</div>
            </div>
            <div className="text-2xl font-bold text-gray-400">:</div>
            <div className="flex flex-col items-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => adjustMinutes(true)}
                className="h-8 w-8 p-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="text-2xl font-bold py-2 min-w-[2.5rem] text-center">
                {minutes.toString().padStart(2, "0")}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => adjustMinutes(false)}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="text-xs text-gray-500 mt-1">Minutes</div>
            </div>
          </div>
          <div className="border-t pt-3">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Quick select:
            </p>
            <div className="grid grid-cols-4 gap-1">
              {quickTimes.map((time) => (
                <Button
                  key={time.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onChange(time.value)
                    onToggle()
                  }}
                  className="text-xs h-8 hover:bg-blue-50"
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <div className="text-xs text-gray-500">Selected: {formatTime12Hour(hours, minutes)}</div>
            <Button type="button" size="sm" onClick={onToggle} className="bg-blue-600 hover:bg-blue-700">
              Done
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ModernTimePicker
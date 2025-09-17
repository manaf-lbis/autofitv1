import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { TimeSpinnerInput } from "./TimeSpinnerInput" 
import type { TimeWindow } from "@/types/pretrip"
import { formatDisplayTime, timeToMinutes, minutesToTime, calculateServiceCompletion } from "../../utils/timeSlotUtils"

interface TimePickerProps {
  availableWindow: { start: string; end: string } | null 
  durationMinutes: number
  selectedTime: string
  onTimeSelect: (time: string) => void
  selectedDate: string
  availableWindows: TimeWindow[]
}

export const TimePicker: React.FC<TimePickerProps> = ({
  availableWindow,
  durationMinutes,
  selectedTime,
  onTimeSelect,
  selectedDate,
  availableWindows = [],
}) => {
  const [isValidTime, setIsValidTime] = useState(true)
  const [endTime, setEndTime] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [completionDetails, setCompletionDetails] = useState<ReturnType<typeof calculateServiceCompletion> | null>(null)


  const isInternalTimeSelect = useRef(false)

  useEffect(() => {
    if (availableWindow) {
      setIsValidTime(true)
      setEndTime("")
      setErrorMessage("")
      setCompletionDetails(null)

      if (selectedTime !== "") {
        onTimeSelect("")
      }
    }
  }, [availableWindow, selectedTime, onTimeSelect])

  // Memoized validation function to avoid re-creating on every render
  const validateAndSetTime = useCallback(
    (time: string) => {
      if (!availableWindow || !time || availableWindows.length === 0) {
        setIsValidTime(false)
        setErrorMessage("Please select a valid time")
        setEndTime("")
        setCompletionDetails(null)
        // Only call onTimeSelect if the time is not already empty
        if (selectedTime !== "") {
          onTimeSelect("")
        }
        return
      }

      const today = new Date()
      const selectedDateObj = new Date(selectedDate)
      const isToday = selectedDateObj.toDateString() === today.toDateString()
      const nowMinutes = isToday
        ? timeToMinutes(today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }))
        : 0

      const timeMinutes = timeToMinutes(time)

      let isValid = true
      let error = ""
      let currentCompletionDetails: ReturnType<typeof calculateServiceCompletion> | null = null

      if (isToday && timeMinutes < nowMinutes) {
        isValid = false
        error = "Cannot select a time in the past"
      } else {
        const completion = calculateServiceCompletion(time, durationMinutes, availableWindows)
        currentCompletionDetails = completion
        if (!completion.canComplete) {
          isValid = false
          error = "Service cannot be completed within available hours from this start time."
        } else {
          setEndTime(completion.endTime)
        }
      }

      setIsValidTime(isValid)
      setErrorMessage(error)
      setCompletionDetails(currentCompletionDetails)

      if (isValid) {
        // Set flag before calling onTimeSelect to prevent re-validation loop
        isInternalTimeSelect.current = true
        onTimeSelect(time)
      } else {
        setEndTime("")
        // Clear parent's selected slot if invalid
        if (selectedTime !== "") {
          onTimeSelect("")
        }
      }
    },
    [availableWindow, durationMinutes, selectedDate, selectedTime, onTimeSelect, availableWindows],
  )

  // Effect to re-validate when selectedTime (prop) changes externally
  // This handles cases where selectedTime is set by quick select or cleared by parent
  useEffect(() => {
    // Prevent re-validation if the change originated from our own onTimeSelect call
    if (isInternalTimeSelect.current) {
      isInternalTimeSelect.current = false // Reset flag
      return
    }
    // If selectedTime is empty, clear validation state
    if (selectedTime === "") {
      setIsValidTime(true) // No time selected, so no validation error
      setEndTime("")
      setErrorMessage("")
      setCompletionDetails(null)
    } else {
      // If selectedTime has a value, re-validate it
      validateAndSetTime(selectedTime)
    }
  }, [selectedTime, validateAndSetTime])

  const handleQuickSelect = useCallback(
    (time: string) => {
      validateAndSetTime(time)
    },
    [validateAndSetTime],
  )

  const generateQuickTimes = useCallback(() => {
    if (!availableWindow || availableWindows.length === 0) return []
    const quickTimes = []

    const today = new Date()
    const selectedDateObj = new Date(selectedDate)
    const isToday = selectedDateObj.toDateString() === today.toDateString()
    const nowMinutes = isToday
      ? timeToMinutes(today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }))
      : 0

    // Generate times every 30 minutes within the combined window,
    // but only if the service can actually be completed from that start time
    const windowStartMinutes = timeToMinutes(availableWindow.start)
    const windowEndMinutes = timeToMinutes(availableWindow.end)

    for (let t = windowStartMinutes; t < windowEndMinutes; t += 30) {
      if (!isToday || t >= nowMinutes) {
        const startTime = minutesToTime(t)
        const completion = calculateServiceCompletion(startTime, durationMinutes, availableWindows)
        if (completion.canComplete) {
          quickTimes.push(startTime)
        }
      }
    }
    return quickTimes.slice(0, 12)
  }, [availableWindow, durationMinutes, selectedDate, availableWindows])

  const quickTimes = generateQuickTimes()

  if (!availableWindow) {
    return (
      <div className="text-center py-8 px-4">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm sm:text-base">Please select a date first</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Time Input Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-1">Select Your Preferred Start Time</h4>
            <p className="text-xs sm:text-sm text-gray-600 break-words">
              Available: {formatDisplayTime(availableWindow.start)} - {formatDisplayTime(availableWindow.end)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <Label htmlFor="start-time" className="text-sm font-semibold text-gray-800">
              Start Time
            </Label>
            <div className="relative">
              <TimeSpinnerInput
                value={selectedTime}
                onChange={validateAndSetTime}
                className={`transition-colors ${
                  !isValidTime && selectedTime
                    ? "border-red-500 focus:border-red-500 bg-red-50"
                    : isValidTime && selectedTime
                      ? "border-green-500 focus:border-green-500 bg-green-50"
                      : "border-gray-300"
                }`}
                placeholder="Select time"
                availableWindow={availableWindow}
                durationMinutes={durationMinutes}
                selectedDate={selectedDate}
                availableWindows={availableWindows} // Pass individual windows
              />
              {!isValidTime && selectedTime && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              )}
              {isValidTime && selectedTime && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            {!isValidTime && errorMessage && (
              <p className="text-xs sm:text-sm text-red-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="break-words">{errorMessage}</span>
              </p>
            )}
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-800">Service End Time</Label>
            <div className="h-12 sm:h-14 px-4 py-3 bg-white border border-gray-300 rounded-md flex items-center text-base sm:text-lg font-medium">
              {endTime ? (
                <span className="text-gray-900">{formatDisplayTime(endTime)}</span>
              ) : (
                <span className="text-gray-400 text-sm sm:text-base">Select start time first</span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Duration: {durationMinutes / 60} hour{durationMinutes / 60 > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {selectedTime && isValidTime && completionDetails && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
            {" "}
            {/* Changed to orange background and border */}
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base text-orange-700 break-words">
                {" "}
                {/* Changed text color to orange-700 */}
                Your selected schedule is from {formatDisplayTime(selectedTime)} to {formatDisplayTime(endTime)}
              </p>
              {completionDetails.breaks.length > 0 && (
                <p className="mt-2 text-xs text-orange-700">
                  Service includes {completionDetails.breaks.length} break
                  {completionDetails.breaks.length > 1 ? "s" : ""} due to mechanic's schedule.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Quick Time Options */}
      {quickTimes.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <h5 className="font-semibold text-gray-800 text-sm sm:text-base">Quick Select Options</h5>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3">
            {quickTimes.map((time) => {
              const completion = calculateServiceCompletion(time, durationMinutes, availableWindows)
              return (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickSelect(time)}
                  className={`h-auto py-3 px-2 flex flex-col items-center justify-center text-center transition-all duration-200 ${
                    selectedTime === time
                      ? "bg-blue-600 text-white shadow-lg hover:bg-blue-500"
                      : "hover:bg-blue-100 hover:border-blue-400"
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm">{formatDisplayTime(time)}</span>
                  <span className="text-xs opacity-80 leading-tight">to {formatDisplayTime(completion.endTime)}</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

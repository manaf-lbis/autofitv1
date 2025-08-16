import type { TimeWindow } from "@/types/pretrip"

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export const minutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

export const formatDisplayTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
}

// Calculate when service will be completed given a start time and duration
export const calculateServiceCompletion = (
  startTime: string,
  serviceDurationMinutes: number,
  availableWindows: TimeWindow[],
): {
  canComplete: boolean
  endTime: string
  workPeriods: { start: string; end: string; duration: number }[]
  breaks: { start: string; end: string; duration: number }[]
  totalTimeSpan: number
} => {
  const sortedWindows = [...availableWindows].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))
  const startMinutes = timeToMinutes(startTime)

  // Check if the proposed startTime falls within any of the available windows.
  // If not, it's an invalid start time.
  let isStartTimeWithinAnyWindow = false
  for (const window of sortedWindows) {
    const windowStart = timeToMinutes(window.start)
    const windowEnd = timeToMinutes(window.end)
    if (startMinutes >= windowStart && startMinutes < windowEnd) {
      isStartTimeWithinAnyWindow = true
      break
    }
  }

  if (!isStartTimeWithinAnyWindow) {
    return {
      canComplete: false,
      endTime: "",
      workPeriods: [],
      breaks: [],
      totalTimeSpan: 0,
    }
  }

  let remainingDuration = serviceDurationMinutes
  let currentTime = startMinutes
  const workPeriods: { start: string; end: string; duration: number }[] = []
  const breaks: { start: string; end: string; duration: number }[] = []

  // Find the first window that contains the start time
  let windowIndex = -1
  for (let i = 0; i < sortedWindows.length; i++) {
    const windowStart = timeToMinutes(sortedWindows[i].start)
    const windowEnd = timeToMinutes(sortedWindows[i].end)
    if (startMinutes >= windowStart && startMinutes < windowEnd) {
      windowIndex = i
      break
    }
  }

  // This should not happen if isStartTimeWithinAnyWindow is true, but as a safeguard
  if (windowIndex === -1) {
    return {
      canComplete: false,
      endTime: "",
      workPeriods: [],
      breaks: [],
      totalTimeSpan: 0,
    }
  }

  // Process windows starting from the one containing start time
  for (let i = windowIndex; i < sortedWindows.length && remainingDuration > 0; i++) {
    const window = sortedWindows[i]
    const windowStart = timeToMinutes(window.start)
    const windowEnd = timeToMinutes(window.end)

    // If current time is before this window starts, there's a break
    if (currentTime < windowStart) {
      const breakDuration = windowStart - currentTime
      breaks.push({
        start: minutesToTime(currentTime),
        end: minutesToTime(windowStart),
        duration: breakDuration,
      })
      currentTime = windowStart // Move current time to the start of this window
    }

    // Ensure we don't start work before the window actually begins
    const effectiveStart = Math.max(currentTime, windowStart)
    const availableTimeInWindow = windowEnd - effectiveStart

    if (availableTimeInWindow <= 0) {
      // If no time available in this window, move to the next, updating current time
      currentTime = windowEnd
      continue
    }

    const timeToUseInWindow = Math.min(remainingDuration, availableTimeInWindow)
    const workEndTime = effectiveStart + timeToUseInWindow

    workPeriods.push({
      start: minutesToTime(effectiveStart),
      end: minutesToTime(workEndTime),
      duration: timeToUseInWindow,
    })

    remainingDuration -= timeToUseInWindow
    currentTime = workEndTime
  }

  const canComplete = remainingDuration === 0
  const endTime = canComplete ? minutesToTime(currentTime) : ""
  const totalTimeSpan = canComplete ? currentTime - startMinutes : 0

  return {
    canComplete,
    endTime,
    workPeriods,
    breaks,
    totalTimeSpan,
  }
}

// Generate possible start times within available windows
export const generateStartTimeOptions = (
  availableWindows: TimeWindow[],
  serviceDurationMinutes: number,
  selectedDate: string,
  intervalMinutes = 30,
): Array<{
  startTime: string
  completion: ReturnType<typeof calculateServiceCompletion>
}> => {
  if (!availableWindows || availableWindows.length === 0) {
    return []
  }

  const today = new Date()
  const selectedDateObj = new Date(selectedDate)
  const isToday = selectedDateObj.toDateString() === today.toDateString()
  const nowMinutes = isToday
    ? timeToMinutes(today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }))
    : 0

  const sortedWindows = [...availableWindows].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))
  const startTimeOptions: Array<{
    startTime: string
    completion: ReturnType<typeof calculateServiceCompletion>
  }> = []

  // Collect all possible start times at the given interval
  const potentialStartTimes: number[] = []
  sortedWindows.forEach((window) => {
    const windowStart = timeToMinutes(window.start)
    const windowEnd = timeToMinutes(window.end)
    for (let time = windowStart; time < windowEnd; time += intervalMinutes) {
      potentialStartTimes.push(time)
    }
  })

  // Remove duplicates and sort
  const uniqueSortedPotentialStartTimes = [...new Set(potentialStartTimes)].sort((a, b) => a - b)

  // Validate each potential start time
  uniqueSortedPotentialStartTimes.forEach((timeMinutes) => {
    const startTime = minutesToTime(timeMinutes)

    // Skip past times for today
    if (isToday && timeMinutes < nowMinutes) {
      return
    }

    const completion = calculateServiceCompletion(startTime, serviceDurationMinutes, availableWindows)

    if (completion.canComplete) {
      startTimeOptions.push({
        startTime,
        completion,
      })
    }
  })

  // Sort by earliest completion time (primary) then by earliest start time (secondary)
  return startTimeOptions.sort((a, b) => {
    const completionDiff = timeToMinutes(a.completion.endTime) - timeToMinutes(b.completion.endTime)
    if (completionDiff !== 0) {
      return completionDiff
    }
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  })
}

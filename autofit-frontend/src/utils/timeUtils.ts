export const formatTime12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`
}

export const isTimeSlotPast = (time24: string, date: Date): boolean => {
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  if (!isToday) return false

  const [hours, minutes] = time24.split(":").map(Number)
  const slotTime = new Date()
  slotTime.setHours(hours, minutes, 0, 0)

  return slotTime <= today
}

export const getAvailableTimeSlots = (date: Date): string[] => {
  const allSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]
  return allSlots.filter((time) => !isTimeSlotPast(time, date))
}

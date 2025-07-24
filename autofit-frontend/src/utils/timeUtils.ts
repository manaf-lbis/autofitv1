// import { format, isToday, isYesterday, isThisWeek, parseISO, isValid } from 'date-fns';

export const isTimeSlotPast = (time24: string, date: Date): boolean => {
  const today = new Date();
  const isTodayCheck = date.toDateString() === today.toDateString();
  if (!isTodayCheck) return false;
  const [hours, minutes] = time24.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  return slotTime <= today;
};

export const getAvailableTimeSlots = (date: Date): string[] => {
  const allSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
  return allSlots.filter(time => !isTimeSlotPast(time, date));
};

export const getDateString = (date: Date): string => date.toISOString().split('T')[0];
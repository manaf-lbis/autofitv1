import { addDays, differenceInHours, format, parse } from 'date-fns';

export const formatTime = (date: Date, formatStr: string = 'h:mm a'): string => {
  return format(date, formatStr); // e.g "8:00 AM"
};

export const getDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd'); // e.g "2025-07-23"
};

export const isTimeSlotPast = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString() && date <= today;
};

export const getAvailableTimeSlots = (date: Date): string[] => {
  const allSlots: string[] = import.meta.env.VITE_SLOTS_TIMINGS.split(',');
  return allSlots.filter((time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    return !isTimeSlotPast(slotDate);
  });
};

export const formatTimeRange = (startTimeDate: Date, durationMinutes: number): string => {
  const end = new Date(startTimeDate.getTime() + durationMinutes * 60 * 1000)
  return `${formatTime(startTimeDate)} - ${formatTime(end)}`
}

export const isTimeOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
  return start1 < end2 && end1 > start2
}

export const isTimeWithinRange = (time: Date, rangeStart: Date, rangeEnd: Date): boolean => {
  return time >= rangeStart && time < rangeEnd
}


export const getTimeDuration = (startTime: string, endTime: string):number => { // 8:00 AM - 10:00PM -> minute
  const start = parse(startTime, "h:mm a", new Date());
  let end = parse(endTime, "h:mm a", new Date());
  if (end < start) {
    end = addDays(end, 1);
  }
  return differenceInHours(end, start);
}
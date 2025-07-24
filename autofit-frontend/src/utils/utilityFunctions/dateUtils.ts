import { format } from 'date-fns';

export const formatTime = (date: Date, formatStr: string = 'h:mm a'): string => {
  return format(date, formatStr); // e.g., "8:00 AM"
};

export const getDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd'); // e.g., "2025-07-23"
};

export const isTimeSlotPast = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString() && date <= today;
};

export const getAvailableTimeSlots = (date: Date): string[] => {
  // const allSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
  const allSlots: string[] = import.meta.env.VITE_SLOTS_TIMINGS.split(',');
  return allSlots.filter((time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    return !isTimeSlotPast(slotDate);
  });
};
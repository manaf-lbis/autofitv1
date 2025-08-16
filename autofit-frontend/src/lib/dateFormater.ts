
import { format, isToday, isYesterday, isThisWeek, parseISO, isValid } from 'date-fns';

export const formatTimeToNow = (dateString: string): string => {
    const date = new Date(dateString);

    if (isToday(date)) {
        return format(date, 'p');
    }

    if (isYesterday(date)) {
        return 'Yesterday';
    }

    if (isThisWeek(date)) {
        return format(date, 'EEE');
    }

    return format(date, 'dd/MM/yy');
};

export const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-- -- ----";

    const parsedDate = parseISO(dateString);
    if (!isValid(parsedDate)) return "Invalid date";

    return format(parsedDate, "MMM d, yyyy, hh:mm a");
};


export function convertTo12HourFormat(isoDateTime: string) {
    const date = parseISO(isoDateTime);
    return format(date, 'h:mm a');
}

// h and m
export const formatTime12Hour = (h: number, m: number) => {
    const date = new Date()
    date.setHours(h, m)
    return format(date, "h:mm a") // e.g., "9:00 AM"
}
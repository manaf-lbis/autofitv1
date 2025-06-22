
import { format,isToday,isYesterday,isThisWeek,parseISO,formatDistanceToNowStrict,isValid} from 'date-fns';

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

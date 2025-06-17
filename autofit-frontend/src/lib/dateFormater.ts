import { formatDistanceToNowStrict, format, parseISO, isValid } from "date-fns";

export const formatTimeToNow = (dateString: string) => {
    return formatDistanceToNowStrict(new Date(dateString), {
        addSuffix: true,
    });
}


export const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "-- -- ----";

    const parsedDate = parseISO(dateString); 
    if (!isValid(parsedDate)) return "Invalid date";

    return format(parsedDate, "MMM d, yyyy, hh:mm a");
};

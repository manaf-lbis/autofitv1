import { formatDistanceToNow } from "date-fns";

export const formatTimeToNow = (dateString:string) => {
   return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
    });
}

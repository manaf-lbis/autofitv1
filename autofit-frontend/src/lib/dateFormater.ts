import { formatDistanceToNowStrict } from "date-fns";

export const formatTimeToNow = (dateString:string) => {
   return formatDistanceToNowStrict(new Date(dateString), {
        addSuffix: true,
    });
}

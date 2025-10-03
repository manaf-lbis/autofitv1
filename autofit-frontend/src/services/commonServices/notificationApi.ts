import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

interface Notification {
    _id: string;
    senderName?: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

interface NotificationData {
    notifications: Notification[];
    total: number
    hasMore: boolean
}


export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ['Notification'],

    endpoints: (builder) => ({

        getNotifications: builder.query<NotificationData, number>({
            query: (page) => ({
                url: `/notifications?page=${page}`,
                method: "GET",
            }),
            transformResponse: (response: any) => response.data,
            providesTags: ['Notification'],
        }),

        updateNotifications: builder.mutation<any, void>({
            query: () => ({
                url: "/notifications",
                method: "PATCH",
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['Notification'],
        }),


    }),

});

export const {
    useLazyGetNotificationsQuery,
    useUpdateNotificationsMutation
} = notificationApi;
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";



export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: [''],

    endpoints: (builder) => ({

        getNotitfications: builder.query<any, void>({
            query: () => ({
                url: "/notifications",
                method: "GET",
            }),
            transformResponse: (response: any) => response.data
        }),

        updateNotifications: builder.mutation<any, void>({
            query: () => ({
                url: "/notifications",
                method: "PATCH",
            }),
            transformResponse: (response: any) => response.data
        }),






    }),

});

export const {
    useGetNotitficationsQuery,
    useUpdateNotificationsMutation
} = notificationApi;
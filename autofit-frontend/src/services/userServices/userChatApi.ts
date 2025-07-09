import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { ChatData } from "@/types/chatdata";

export const userChatApi = createApi({
    reducerPath: "userChatApi",
    baseQuery: baseQueryWithRefresh,

    endpoints: (builder) => ({

        getUserChats: builder.query<ChatData, { serviceId: string; serviceType: string }>({
            query: ({ serviceId, serviceType }) => ({
                url: `chat/service/${serviceType}/${serviceId}`,
                method: "GET",
            }),
        }),

        availableRooms: builder.query({
            query: () => ({
                url: `chat/avilable-rooms`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetUserChatsQuery,
    useAvailableRoomsQuery
} = userChatApi;
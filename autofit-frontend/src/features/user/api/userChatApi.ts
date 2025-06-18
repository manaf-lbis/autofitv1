import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { ChatData } from "@/types/chatdata";


export const userChatApi = createApi({
    reducerPath: "userChatApi",
    baseQuery: baseQueryWithRefresh,

    endpoints: (builder) => ({

        getUserChats: builder.query<ChatData[], string>({
            query: (serviceId) => ({
                url: `user/chats/${serviceId}`,
                method: "GET",
            }),
        }),

    }),

});

export const {
    useGetUserChatsQuery
} = userChatApi;
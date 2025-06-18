import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { ChatData } from "@/types/chatdata";



export const mechanicChatApi = createApi({
    reducerPath: "mechanicChatApi",
    baseQuery: baseQueryWithRefresh,

    endpoints: (builder) => ({

        getMechanicChats: builder.query<ChatData[], void>({
            query: () => ({
                url: "mechanic/chats",
                method: "GET",
            }),
        }),

        sendMessage: builder.mutation<ChatData, { receiverId: string; receiverRole: string; message: string }>({
            query: (body) => ({
                url: "send",
                method: "POST",
                body,
            }),
        }),

        markMessageAsSeen: builder.mutation<void, string>({
            query: (chatId) => ({
                url: `message/${chatId}/seen`,
                method: "PUT",
            }),
        }),
    }),
});

export const {
    useGetMechanicChatsQuery,
    useSendMessageMutation,
    useMarkMessageAsSeenMutation
} = mechanicChatApi;
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { ChatData } from "@/types/chatdata";

export const adminChatApi = createApi({
    reducerPath: "adminChatApi",
    baseQuery: baseQueryWithRefresh,

    endpoints: (builder) => ({

        getAdminChats: builder.query<ChatData[], void>({
            query: () => ({
                url: "admin/chats",
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
    useGetAdminChatsQuery,
    useSendMessageMutation,
    useMarkMessageAsSeenMutation
} = adminChatApi;
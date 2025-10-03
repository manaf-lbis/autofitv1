import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";


interface SenderInfo {
  _id: string
  name: string
}

interface Message {
  _id: string
  serviceId: string
  serviceType: string
  senderId: string
  senderRole: "user" | "mechanic"
  receiverId: string
  receiverRole: "user" | "mechanic"
  message: string
  seen: boolean
  createdAt: string
  updatedAt: string
  senderInfo: SenderInfo
}

interface ChatData {
  _id: string
  name: string
  isCompleted: boolean
  messages: Message[]
}

export interface ApiResponse {
  status: string
  message: string
  data: ChatData[]
}



export const mechanicChatApi = createApi({
    reducerPath: "mechanicChatApi",
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        
        getMechanicChats: builder.query<ApiResponse, void>({
            query: () => ({
                url: "chat/mechanic",
                method: "GET",
            }),
        })
      
    }),
});

export const {
    useGetMechanicChatsQuery
} = mechanicChatApi;
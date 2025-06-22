import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  messages: Message[]
}



const initialState : ChatData[] = []

const mechanicChatSlice = createSlice({
    name: "mechanicChatSlice",
    initialState,
    reducers: {

        setMessages: (state, action: PayloadAction<ChatData[]>) => {
          return action.payload;
        },

        setNewMessage: (state, action: PayloadAction<{serviceId:string,message:Message}>) => {
          state.find((ele)=> ele._id === action.payload.serviceId )?.messages.push(action.payload.message)
        },
      
    },
});

export const {setMessages,setNewMessage  } = mechanicChatSlice.actions;

export default mechanicChatSlice.reducer;

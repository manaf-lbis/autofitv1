import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    _id: string;
    serviceId: string;
    message: string;
    senderId: string;
    senderRole: string
    senderName: string;
    seen:boolean;
    createdAt: string;
}

const initialState: Message[] = [];

const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<Message[]>) => {
            return action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            state.push(action.payload);
        },
        clearMessages: () => {
            return [];
        },
    },
});

export const { setMessages, addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;

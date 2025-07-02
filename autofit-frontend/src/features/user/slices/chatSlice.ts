import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
    _id: string;
    serviceId: string;
    message: string;
    senderId: string;
    senderRole: string
    senderName: string;
    seen: boolean;
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

        markAsSeen: (state, action: PayloadAction<{ serviceId: string }>) => {
            state.forEach((msg) => {
                if (msg.serviceId === action.payload.serviceId) {
                    msg.seen = true;
                }
            });
        },

        clearMessages: () => {
            return [];
        },
    },
});

export const { setMessages, addMessage, clearMessages,markAsSeen } = chatSlice.actions;

export default chatSlice.reducer;

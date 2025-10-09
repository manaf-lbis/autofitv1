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
  receiverRole: "user" | "mechanic"
  message: string
  seen: boolean
  createdAt: string
  senderInfo: SenderInfo
}

interface ChatData {
  _id: string
  name: string
  isCompleted: boolean
  messages: Message[]
}
interface NewMessage {
  _id: string;
  serviceId: string;
  message: string;
  senderId: string;
  senderRole: "user" | "mechanic"
  senderName: string;
  seen: boolean;
  receiverRole: "user" | "mechanic";
  serviceType: 'roadsideAssistance' | 'live'
  createdAt: string;
}


const initialState: ChatData[] = []

const mechanicChatSlice = createSlice({
  name: "mechanicChatSlice",
  initialState,
  reducers: {

    setMessages: (state, action: PayloadAction<ChatData[]>) => {
      return action.payload;
    },

    markAsSeen: (state, action: PayloadAction<{ serviceId: string }>) => {
        const chat = state.find((ele) => ele._id === action.payload.serviceId);
        if (chat) {
          chat.messages.forEach((msg) => {
            msg.seen = true;
          });
        }
    },

    setNewMessage: (state, action: PayloadAction<NewMessage>) => {

      const { serviceType, serviceId, createdAt, message, _id, receiverRole, seen, senderId, senderName, senderRole } = action.payload;
      const existingChat = state.find(chat => chat._id === serviceId);

      if (existingChat) {
        existingChat.messages.push({
          _id,
          createdAt,
          message,
          receiverRole,
          seen,
          senderId,
          senderInfo: {
            _id: senderId,
            name: senderName
          },
          senderRole,
          serviceId,
          serviceType,
        })

      } else {
        state.push({
          _id: serviceId,
          name: senderName,
          isCompleted: false,
          messages: [{
            _id,
            createdAt,
            message,
            receiverRole,
            seen,
            senderId,
            senderInfo: {
              _id: senderId,
              name: senderName
            },
            senderRole,
            serviceId,
            serviceType,
          }],
        });
      }
    }


  },
});

export const { setMessages, setNewMessage ,markAsSeen} = mechanicChatSlice.actions;

export default mechanicChatSlice.reducer;


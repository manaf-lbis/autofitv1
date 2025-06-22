export interface ChatMessage {
  _id: string;
  serviceId: string;
  serviceType: "roadside" | "pretrip" | "live";
  senderId: {
    _id:string;
    name:string;
  }
  senderRole: "user" | "mechanic";
  receiverId: string;
  receiverRole: "user" | "mechanic";
  message: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface ChatData {
  status: string;
  message: string;
  data: ChatMessage[]; 
}
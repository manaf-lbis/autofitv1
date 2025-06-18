export interface ChatData {
  _id: string; 
  serviceId: string;
  senderId: string;
  senderRole: "user" | "mechanic" | "admin";
  receiverId: string;
  receiverRole: "user" | "mechanic" | "admin";
  message: string;
  seen: boolean;
  createdAt: string; 
  updatedAt: string; 
}
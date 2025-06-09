import { Socket } from "socket.io";
import { getIO } from "./socket";
import { userSocketMap } from "./socket";


interface NotificationData {
  message: string;
  userId: string;
}


export const forceLogoutHandler = (socket:Socket)=>{

    socket.on('forceLogout',(data:NotificationData)=>{

        
    })

}
import { Socket } from "socket.io";
import { getIO } from "../socket";


interface NotificationData {
  message: string;
  userId: string;
}


export const notificationHandler = (socket:Socket)=>{

    socket.on('sendNotification',(data:NotificationData)=>{
        getIO().emit('newNotification',data)
    })

}
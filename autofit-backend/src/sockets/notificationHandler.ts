import { Socket } from "socket.io";
import { getIO } from "./socket";
import { userSocketMap } from "./socket";


interface NotificationData {
  message: string;
  userId: string;
}


export const notificationHandler = (socket:Socket)=>{

    socket.on('sendNotification',(data:NotificationData)=>{
        console.log(data);

    

        getIO().emit('newNotification',data)
    })

}
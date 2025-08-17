import { Socket } from "socket.io";
import { getIO, userSocketMap } from "../socket";


export const liveAssistanceHandler = (socket: Socket) => {

    socket.on("liveAssistance", ({ sessionId, mechanicId }) => {
        console.log('joined session', mechanicId);
        socket.join(sessionId);

        const io = getIO()
        const room = io.sockets.adapter.rooms.get(sessionId);

        if (room && room?.size <= 1) {
            const mechanicData = userSocketMap.get(mechanicId);
            mechanicData?.socketIds.forEach((id) => {
                console.log(id);

                socket.to(id).emit("liveAssistanceRequest", { message: "Waiting for mechanic to join..." });
            })
        }






    });


    socket.on("signal", ({ sessionId, data }) => {
        socket.to(sessionId).emit("signal", data);
    });



};
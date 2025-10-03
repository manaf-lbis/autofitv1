import { getIO, userSocketMap } from "../sockets/socket";

export const notifyUser = (userId: string, notification:{ _id: string, message: string, createdAt: Date, isRead: boolean }) => {

    const userData = userSocketMap.get(userId);

    if (userData && userData.socketIds.size > 0) {
        const io = getIO()
        userData.socketIds.forEach((id) => {
            io.to(id).emit('notification', {
                _id: notification._id,
                message: notification.message,
                createdAt: notification.createdAt,
                isRead: notification.isRead
            })
        })

    }
}
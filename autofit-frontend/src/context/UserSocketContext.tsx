import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { initSocket } from "@/lib/socket";
import { useAvailableRoomsQuery } from "@/features/user/api/userChatApi";
import { addMessage } from "@/features/user/slices/chatSlice";
import { useNotification } from "@/hooks/useNotification";
import { formatTimeToNow } from "@/lib/dateFormater";

const UserSocketContext = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const socketRef = useRef(initSocket());
    const notify = useNotification()

    const { data: response } = useAvailableRoomsQuery({});

    useEffect(() => {
        const socket = socketRef.current;

        if (response?.data) {
            response.data.map((id: string) => {
                const room = `roadside_${id}`;
                socket.emit("joinRoom", { room });
            });

            socket.on("roadsideMessage", (data) => {
                if (data.senderRole !== 'user') {
                    notify(data.senderName, data.message, formatTimeToNow(data.createdAt))
                }
                dispatch(addMessage(data));
            });
        }

        return () => {
            if (response?.data) {
                response.data.map((id: string) => {
                    const room = `roadside_${id}`;
                    socket.emit("leaveRoom", { room });
                });
            }
        };
    }, [dispatch, response]);

    return <>{children}</>;
};

export default UserSocketContext;

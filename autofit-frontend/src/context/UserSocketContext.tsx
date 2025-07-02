import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { initSocket } from "@/lib/socket";
import { useAvailableRoomsQuery } from "@/features/user/api/userChatApi";
import { addMessage, markAsSeen } from "@/features/user/slices/chatSlice";
import { useNotification } from "@/hooks/useNotification";
import { formatTimeToNow } from "@/lib/dateFormater";
import toast from "react-hot-toast";

const UserSocketContext = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const socketRef = useRef(initSocket());
  const notify = useNotification();

  const { data: response } = useAvailableRoomsQuery({});

  useEffect(() => {
    const socket = socketRef.current;

    if (response?.data) {
      response.data.map((id: string) => {
        const room = `roadside_${id}`;
        socket.emit("joinRoom", { room });
      });

      socket.on("roadsideMessage", (data) => {
        if (data.senderRole !== "user") {
          notify(
            data.senderName,
            data.message,
            formatTimeToNow(data.createdAt)
          );
        }
        dispatch(addMessage(data));
      });
    }
    socket.on("unauthorized", (data) => {
      toast.error(data.message);
    });

    socketRef.current.on("seen", ({ serviceId }) => {
      dispatch(markAsSeen({ serviceId }));
    });

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

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { initSocket } from "@/lib/socket";
import { useAvailableRoomsQuery } from "@/services/userServices/userChatApi";
import { addMessage, markAsSeen } from "@/features/user/slices/chatSlice";
import { useNotification } from "@/hooks/useNotification";
import { formatTimeToNow } from "@/lib/dateFormater";
import { useLazyGetCurrentUserQuery } from "@/services/authServices/authApi";

const UserSocketContext = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [trigger] = useLazyGetCurrentUserQuery();
  const socketRef = useRef(initSocket());
  const notify = useNotification();
  const { data: response } = useAvailableRoomsQuery({});

  useEffect(() => {
    const socket = socketRef.current;

    const handleJoinRoom = ({ room }: { room: string }) => {
      socket.emit("joinRoom", { room });
    };

    const handleRoadsideMessage = (data: any) => {
      if (data.senderRole !== "user") {
        notify(data.senderName, data.message, formatTimeToNow(data.createdAt));
      }
      dispatch(addMessage(data));
    };

    const handleSeen = ({ serviceId }: { serviceId: string }) => {
      dispatch(markAsSeen({ serviceId }));
    };

    const handleRefresh = () => {
      trigger();
    };

    socket.on("joinRoom", handleJoinRoom);
    socket.on("roadsideMessage", handleRoadsideMessage);
    socket.on("seen", handleSeen);
    socket.on("refresh", handleRefresh);

    if (response?.data) {
      response.data.forEach((id: string) => {
        const room = `roadside_${id}`;
        socket.emit("joinRoom", { room });
      });
    }

    return () => {
      socket.off("joinRoom", handleJoinRoom);
      socket.off("roadsideMessage", handleRoadsideMessage);
      socket.off("seen", handleSeen);
      socket.off("refresh", handleRefresh);
      if (response?.data) {
        response.data.forEach((id: string) => {
          const room = `roadside_${id}`;
          socket.emit("leaveRoom", { room });
        });
      }
    };
  }, [dispatch, response, trigger, notify]);

  return <>{children}</>;
};

export default UserSocketContext;
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setEmergencyRequest } from "@/features/mechanic/slices/mechanicSlice";
import { initSocket } from "@/lib/socket";
import { useAvailableRoomsQuery } from "@/features/user/api/userChatApi";
import { formatTimeToNow } from "@/lib/dateFormater";
import { useNotification } from "@/hooks/useNotification";
import { setNewMessage } from "@/features/mechanic/slices/mechanicChatSlice";

const MechanicSocketContext = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const socketRef = useRef(initSocket());
  const notify = useNotification()
  const { data: response } = useAvailableRoomsQuery({})

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("emergency", (data) => {
      dispatch(setEmergencyRequest(data));
    });

    if (response?.data) {

      response.data.map((id: string) => {
        const room = `roadside_${id}`;
        socket.emit("joinRoom", { room });
      });

      socket.on("roadsideMessage", (data) => {
        if (data.senderRole !== 'mechanic') {
          notify(data.senderName, data.message, formatTimeToNow(data.createdAt))
        }

        dispatch(setNewMessage(data));
      });
    }


    return () => {
      socket.off("emergency");
    };
  }, [dispatch,response]);

  return <>{children}</>;
};

export default MechanicSocketContext;

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setEmergencyRequest } from "@/features/mechanic/slices/mechanicSlice";
import { initSocket } from "@/lib/socket";

const MechanicSocketContext = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const socketRef = useRef(initSocket());

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("emergency", (data)=>{
        dispatch(setEmergencyRequest(data));
    });
    


    return () => {
      socket.off("emergency");
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default MechanicSocketContext;

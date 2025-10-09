import { useEffect, PropsWithChildren } from "react";
import { initSocket } from "@/lib/socket";
import { SocketContext } from "./SocketContext";

const SocketProvider = ({ children }: PropsWithChildren) => {
  const socket = initSocket();

  useEffect(() => {
    socket.on("connect", () => console.log("Global WS Connected"));
    socket.on("disconnect", () => console.log("Global WS Disconnected"));
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;















import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {console.log('WS connected');
    });
    socket.on("disconnect", () =>{console.log('WS disconnected ');
    });
  }
  return socket;
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};










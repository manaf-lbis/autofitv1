// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null

// export const initSocket = () => {

//     if (socket) return socket

//     if (!socket) {
//         socket = io(import.meta.env.VITE_API_URL, {
//             withCredentials: true,
//         });
//     }
//     return socket;
// }

// export const getSocket = () => {
//     return socket;
// };


// export const disconnectSocket = () => {
//     if (socket) {
//         socket.disconnect();
//         socket = null;
//         console.log("Socket disconnected");
//     }
// };


// lib/socket.ts


import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true
    });

  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

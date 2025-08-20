
// import { Socket } from "socket.io";
// import { getIO } from "../socket";
// import { verifyJwt } from "../verifyJwt";

// const roomRoles: Record<
//   string,
//   { user?: { userId: string; socketId: string }; mechanic?: { userId: string; socketId: string } }
// > = {};

// export const liveAssistanceHandler = (socket: Socket) => {
//   socket.on("liveAssistance", ({ sessionId, userId, role }) => {
//     const { id: verifiedUserId, role: verifiedRole } = verifyJwt(socket);

//     if (verifiedUserId !== userId || verifiedRole !== role) {
//       socket.emit("liveError", { message: "Invalid user or role" });
//       return;
//     }

//     console.log(`${role} ${userId} trying to join session ${sessionId}`);

//     const io = getIO();

//     if (!roomRoles[sessionId]) {
//       roomRoles[sessionId] = {};
//     }

//     if (role === "user") {
//       const existingUser = roomRoles[sessionId].user;

//       if (existingUser && existingUser.userId !== userId) {
//         socket.emit("liveError", { message: "Another customer already in this room" });
//         return;
//       }

//       if (existingUser && existingUser.socketId !== socket.id) {
//         const oldSocket = io.sockets.sockets.get(existingUser.socketId);
//         if (oldSocket) {
//           console.log(`Disconnecting old user socket ${existingUser.socketId}`);
//           oldSocket.disconnect(true);
//         }
//       }

//       roomRoles[sessionId].user = { userId, socketId: socket.id };
//     }

//     if (role === "mechanic") {
//       const existingMechanic = roomRoles[sessionId].mechanic;

//       if (existingMechanic && existingMechanic.userId !== userId) {
//         socket.emit("liveError", { message: "Another mechanic already in this room" });
//         return;
//       }

//       if (existingMechanic && existingMechanic.socketId !== socket.id) {
//         const oldSocket = io.sockets.sockets.get(existingMechanic.socketId);
//         if (oldSocket) {
//           console.log(`Disconnecting old mechanic socket ${existingMechanic.socketId}`);
//           oldSocket.disconnect(true);
//         }
//       }

//       roomRoles[sessionId].mechanic = { userId, socketId: socket.id };
//     }

//     socket.join(sessionId);
//     socket.data = { userId, role };
//     console.log(`${role} (${userId}) joined session ${sessionId}`);

//     // Ensure participants is always an array
//     const participants = Object.entries(roomRoles[sessionId] || {})
//       .filter(([_, data]) => data.userId !== userId)
//       .map(([r, data]) => ({ userId: data.userId, role: r }));

//     io.to(sessionId).emit("participantJoined", { userId, role, participants });

//     const room = io.sockets.adapter.rooms.get(sessionId);
//     if (room?.size === 1) {
//       socket.emit("waiting", { message: "Waiting for other party..." });
//     }

//     if (room?.size === 2 && role === "mechanic") {
//       console.log(`Telling mechanic ${userId} to initiate offer`);
//       socket.emit("initiateOffer");
//     }
//   });

//   socket.on("signal", ({ sessionId, data }) => {
//     socket.to(sessionId).emit("signal", { data });
//   });

//   socket.on("liveAssistanceDisconnect", ({ sessionId, userId }) => {
//     if (!roomRoles[sessionId]) return;

//     if (roomRoles[sessionId].user?.userId === userId) {
//       console.log(`User ${userId} disconnected from ${sessionId}`);
//       socket.to(sessionId).emit("participantDisconnected", { userId });
//       delete roomRoles[sessionId].user;
//     }
//     if (roomRoles[sessionId].mechanic?.userId === userId) {
//       console.log(`Mechanic ${userId} disconnected from ${sessionId}`);
//       socket.to(sessionId).emit("participantDisconnected", { userId });
//       delete roomRoles[sessionId].mechanic;
//     }

//     if (!roomRoles[sessionId].user && !roomRoles[sessionId].mechanic) {
//       delete roomRoles[sessionId];
//     }
//   });
// };




import { Socket } from "socket.io";
import { getIO } from "../socket";
import { verifyJwt } from "../verifyJwt";

const roomRoles: Record<
  string,
  { user?: { userId: string; socketId: string }; mechanic?: { userId: string; socketId: string } }
> = {};

export const liveAssistanceHandler = (socket: Socket) => {
  socket.on("liveAssistance", ({ sessionId }) => {
    const { id: userId, role } = verifyJwt(socket);

    console.log(`${role} ${userId} trying to join session ${sessionId}`);

    const io = getIO();

    if (!roomRoles[sessionId]) {
      roomRoles[sessionId] = {};
    }

    if (role === "user") {
      const existingUser = roomRoles[sessionId].user;

      if (existingUser && existingUser.userId !== userId) {
        socket.emit("liveError", { message: "Another customer already in this room" });
        return;
      }

      if (existingUser && existingUser.socketId !== socket.id) {
        const oldSocket = io.sockets.sockets.get(existingUser.socketId);
        if (oldSocket) {
          oldSocket.disconnect(true);
        }
      }

      roomRoles[sessionId].user = { userId, socketId: socket.id };
    }

    if (role === "mechanic") {
      const existingMechanic = roomRoles[sessionId].mechanic;

      if (existingMechanic && existingMechanic.userId !== userId) {
        socket.emit("liveError", { message: "Another mechanic already in this room" });
        return;
      }

      if (existingMechanic && existingMechanic.socketId !== socket.id) {
        const oldSocket = io.sockets.sockets.get(existingMechanic.socketId);
        if (oldSocket) {
          oldSocket.disconnect(true);
        }
      }

      roomRoles[sessionId].mechanic = { userId, socketId: socket.id };
    }

    socket.join(sessionId);
    socket.data = { userId, role };
    console.log(`${role} (${userId}) joined session ${sessionId}`);

    const room = io.sockets.adapter.rooms.get(sessionId);

    io.to(sessionId).emit("participantJoined", { userId, role });

    if (room?.size === 1) {
      socket.emit("waiting", { message: "Waiting for other party..." });
    }

    if (room && room.size >= 2) {
      console.log(`Telling newcomer (${role}) ${userId} to initiate offer`);
      socket.emit("initiateOffer");
    }

    console.log("Room size:", room?.size);
  });

  socket.on("signal", ({ sessionId, data }) => {
    socket.to(sessionId).emit("signal", { data }); 
  });

  socket.on("liveAssistanceDisconnect", () => {
    for (const [roomId, roles] of Object.entries(roomRoles)) {
      if (roles.user?.socketId === socket.id) {
        console.log(`User ${roles.user.userId} disconnected from ${roomId}`);
        socket.to(roomId).emit("participantDisconnected", { userId: roles.user.userId });
        delete roles.user;
      }
      if (roles.mechanic?.socketId === socket.id) {
        console.log(`Mechanic ${roles.mechanic.userId} disconnected from ${roomId}`);
        socket.to(roomId).emit("participantDisconnected", { userId: roles.mechanic.userId });
        delete roles.mechanic;
      }

      if (!roles.user && !roles.mechanic) {
        delete roomRoles[roomId];
      }
    }
  });
};






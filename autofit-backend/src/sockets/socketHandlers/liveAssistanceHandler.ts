
// import { Socket } from "socket.io";
// import { getIO } from "../socket";
// import { verifyJwt } from "../verifyJwt";

// const roomRoles: Record<string,{ user?: { userId: string; socketId: string }; mechanic?: { userId: string; socketId: string } }> = {};

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

const roomRoles: Record<string, { user?: { userId: string; socketId: string }; mechanic?: { userId: string; socketId: string } }> = {};

export const liveAssistanceHandler = (socket: Socket) => {
  socket.on("liveAssistance", ({ sessionId, userId, role }) => {
    const { id: verifiedUserId, role: verifiedRole } = verifyJwt(socket);
    if (verifiedUserId !== userId || verifiedRole !== role) {
      socket.emit("liveError", { message: "Invalid user or role" });
      return;
    }
    console.log(`${role} ${userId} trying to join session ${sessionId}`);
    const io = getIO();
    if (!roomRoles[sessionId]) roomRoles[sessionId] = {};
    if (role === "user") {
      const existingUser = roomRoles[sessionId].user;
      if (existingUser && existingUser.userId !== userId) {
        socket.emit("liveError", { message: "Another customer already in this room" });
        return;
      }
      if (existingUser && existingUser.socketId !== socket.id) {
        const oldSocket = io.sockets.sockets.get(existingUser.socketId);
        if (oldSocket) {
          console.log(`Disconnecting old user socket ${existingUser.socketId}`);
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
          console.log(`Disconnecting old mechanic socket ${existingMechanic.socketId}`);
          oldSocket.disconnect(true);
        }
      }
      roomRoles[sessionId].mechanic = { userId, socketId: socket.id };
    }
    socket.join(sessionId);
    socket.data = { userId, role };
    console.log(`${role} (${userId}) joined session ${sessionId}`);
    io.to(sessionId).emit("participantJoined", { userId, role });
    const room = io.sockets.adapter.rooms.get(sessionId);
    if (room?.size === 1) socket.emit("waiting", { message: "Waiting for other party..." });
    if (room?.size === 2) {
      const mechanic = roomRoles[sessionId].mechanic;
      if (mechanic) {
        console.log(`Telling mechanic ${mechanic.userId} to initiate offer`);
        io.to(mechanic.socketId).emit("initiateOffer");
      }
    }
  });

  socket.on("signal", ({ sessionId, data }) => {
    socket.to(sessionId).emit("signal", { data });
  });

  socket.on("mediaState", ({ sessionId, data }) => {
    socket.to(sessionId).emit("mediaState", { userId: socket.data.userId, ...data });
  });

  socket.on("liveAssistanceDisconnect", ({ sessionId, userId }) => {
    if (!roomRoles[sessionId]) return;
    if (roomRoles[sessionId].user?.userId === userId) {
      console.log(`User ${userId} disconnected from ${sessionId}`);
      socket.to(sessionId).emit("participantDisconnected", { userId });
      delete roomRoles[sessionId].user;
    }
    if (roomRoles[sessionId].mechanic?.userId === userId) {
      console.log(`Mechanic ${userId} disconnected from ${sessionId}`);
      socket.to(sessionId).emit("participantDisconnected", { userId });
      delete roomRoles[sessionId].mechanic;
    }
    if (!roomRoles[sessionId].user && !roomRoles[sessionId].mechanic) delete roomRoles[sessionId];
  });
};
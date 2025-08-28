import { Socket } from "socket.io";
import { getIO } from "../socket";
import { verifyJwt } from "../verifyJwt";

type Role = "user" | "mechanic";
type Participant = { userId: string; role: Role; socketId: string; isMuted?: boolean; isVideoOn?: boolean };
type RoomState = { participants: Participant[] };

const rooms: Record<string, RoomState> = {};

export const liveAssistanceHandler = (socket: Socket) => {

  socket.on("liveAssistance", ({ sessionId, userId, role, isMuted = true, isVideoOn = false }) => {
    const { id: verifiedUserId, role: verifiedRole } = verifyJwt(socket);

    if (verifiedUserId !== userId || verifiedRole !== role) {
      console.warn(`[Server] ❌ Invalid user or role. Provided: ${userId}/${role}, Verified: ${verifiedUserId}/${verifiedRole}`);
      socket.emit("liveError", { message: "Invalid user or role" });
      return;
    }

    const io = getIO();
    if (!rooms[sessionId]) {
      rooms[sessionId] = { participants: [] };
    }

    // Check for existing participant with same userId
    const existingParticipant = rooms[sessionId].participants.find((p) => p.userId === userId);
    if (existingParticipant) {
      // Kick the old socket
      io.to(existingParticipant.socketId).emit("sessionEnded", { message: "Session accessed from another device" });
      // Force disconnect old socket
      const oldSocket = io.sockets.sockets.get(existingParticipant.socketId);
      oldSocket?.disconnect(true);
      // Remove old participant
      rooms[sessionId].participants = rooms[sessionId].participants.filter((p) => p.userId !== userId);
      // Notify others about left
      io.to(sessionId).emit("participantLeft", { userId });
      // Broadcast updated list
      io.to(sessionId).emit(
        "participantsList",
        rooms[sessionId].participants.map(({ userId, role, isMuted, isVideoOn }) => ({
          userId,
          role,
          isMuted: !!isMuted,
          isVideoOn: !!isVideoOn,
        }))
      );
    }

    // Now add the new participant
    socket.data.sessionId = sessionId;
    socket.data.userId = userId;
    socket.data.role = role;

    socket.join(sessionId);

    // add participant
    rooms[sessionId].participants.push({ userId, role, socketId: socket.id, isMuted, isVideoOn });

    // send participants list to new joiner
    socket.emit(
      "participantsList",
      rooms[sessionId].participants.map(({ userId, role, isMuted, isVideoOn }) => ({
        userId,
        role,
        isMuted: !!isMuted,
        isVideoOn: !!isVideoOn,
      }))
    );

    // inform others
    socket.to(sessionId).emit("participantJoined", { userId, role, isMuted: !!isMuted, isVideoOn: !!isVideoOn });

    // Broadcast updated list to all
    io.to(sessionId).emit(
      "participantsList",
      rooms[sessionId].participants.map(({ userId, role, isMuted, isVideoOn }) => ({
        userId,
        role,
        isMuted: !!isMuted,
        isVideoOn: !!isVideoOn,
      }))
    );

    // If room has >=2 participants, request mechanic to create offer
    const roomState = rooms[sessionId];
    if (roomState.participants.length >= 2) {
      const mech = roomState.participants.find((p) => p.role === "mechanic");
      if (mech) {
        io.to(mech.socketId).emit("initiateOffer");
      } 
    } else {
      socket.emit("waiting", { message: "Waiting for other party..." });
    }
  });

  // signaling forwarding (with verification)
  socket.on("signal", ({ sessionId, offer, answer, candidate }) => {
    const { id: verifiedUserId } = verifyJwt(socket);
    if (verifiedUserId !== socket.data.userId) return; 

    if (offer) socket.to(sessionId).emit("offer", offer);
    if (answer) socket.to(sessionId).emit("answer", answer);
    if (candidate) socket.to(sessionId).emit("candidate", candidate);
  });


  socket.on(
    "mediaState",
    ({ sessionId, userId, isMuted, isVideoOn }: { sessionId: string; userId: string; isMuted: boolean; isVideoOn: boolean }) => {
      const { id: verifiedUserId } = verifyJwt(socket);
      if (verifiedUserId !== userId) return; 

      const state = rooms[sessionId];
      if (!state) return;
      const p = state.participants.find((x) => x.userId === userId);
      if (p) {
        p.isMuted = !!isMuted;
        p.isVideoOn = !!isVideoOn;
      }
      socket.to(sessionId).emit("participantUpdated", { userId, isMuted: !!isMuted, isVideoOn: !!isVideoOn });
    }
  );

  // manual leave (with verification)
  socket.on("liveAssistanceDisconnect", ({ sessionId, userId }: { sessionId: string; userId: string }) => {
    const { id: verifiedUserId } = verifyJwt(socket);
    if (verifiedUserId !== userId) return; // Security check

    leaveRoom(socket, sessionId, userId);
  });

  // clean up on disconnect
  socket.on("disconnect", () => {
    const sessionId = socket.data.sessionId as string | undefined;
    const userId = socket.data.userId as string | undefined;
    if (sessionId && userId) {
      leaveRoom(socket, sessionId, userId);
    }
  });
};

function leaveRoom(socket: Socket, sessionId: string, userId: string) {
  const state = rooms[sessionId];
  if (!state) {
    return;
  }


  state.participants = state.participants.filter((p) => p.socketId !== socket.id);
  socket.to(sessionId).emit("participantLeft", { userId });

  // Broadcast updated list for sync
  socket.to(sessionId).emit(
    "participantsList",
    state.participants.map(({ userId, role, isMuted, isVideoOn }) => ({
      userId,
      role,
      isMuted: !!isMuted,
      isVideoOn: !!isVideoOn,
    }))
  );

  socket.leave(sessionId);

  if (state.participants.length === 0) {
    delete rooms[sessionId];
  } else {
    if (state.participants.length >= 2) {
      const mech = state.participants.find((p) => p.role === "mechanic");
      if (mech) {
        socket.to(mech.socketId).emit("initiateOffer");
      }
    }
  }
}




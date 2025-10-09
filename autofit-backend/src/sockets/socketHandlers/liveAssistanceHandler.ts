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
      socket.emit("liveError", { message: "Invalid user or role" });
      return;
    }

    const io = getIO();
    if (!rooms[sessionId]) {
      rooms[sessionId] = { participants: [] };
    }

    const existingParticipant = rooms[sessionId].participants.find((p) => p.userId === userId);
    if (existingParticipant) {
      io.to(existingParticipant.socketId).emit("sessionEnded", { message: "Session accessed from another device" });
      const oldSocket = io.sockets.sockets.get(existingParticipant.socketId);
      oldSocket?.disconnect(true);
      rooms[sessionId].participants = rooms[sessionId].participants.filter((p) => p.userId !== userId);
      io.to(sessionId).emit("participantLeft", { userId });
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

    socket.data.sessionId = sessionId;
    socket.data.userId = userId;
    socket.data.role = role;

    socket.join(sessionId);

    rooms[sessionId].participants.push({ userId, role, socketId: socket.id, isMuted, isVideoOn });

    socket.emit(
      "participantsList",
      rooms[sessionId].participants.map(({ userId, role, isMuted, isVideoOn }) => ({
        userId,
        role,
        isMuted: !!isMuted,
        isVideoOn: !!isVideoOn,
      }))
    );

    socket.to(sessionId).emit("participantJoined", { userId, role, isMuted: !!isMuted, isVideoOn: !!isVideoOn });

    io.to(sessionId).emit(
      "participantsList",
      rooms[sessionId].participants.map(({ userId, role, isMuted, isVideoOn }) => ({
        userId,
        role,
        isMuted: !!isMuted,
        isVideoOn: !!isVideoOn,
      }))
    );

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

  socket.on("liveAssistanceDisconnect", ({ sessionId, userId }: { sessionId: string; userId: string }) => {
    const { id: verifiedUserId } = verifyJwt(socket);
    if (verifiedUserId !== userId) return; 

    leaveRoom(socket, sessionId, userId);
  });

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
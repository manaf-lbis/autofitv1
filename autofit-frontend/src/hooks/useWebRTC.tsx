
import { useEffect, useRef, useState } from "react";
import { initSocket } from "@/lib/socket";

type Role = "user" | "mechanic";

export const useWebRTC = ({
  sessionId,
  userId,
  role,
  socket: providedSocket,
}: {
  sessionId: string;
  userId: string;
  role: Role;
  socket?: any;
}) => {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null);

  const audioTransceiverRef = useRef<RTCRtpTransceiver | null>(null);
  const videoTransceiverRef = useRef<RTCRtpTransceiver | null>(null);

  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const negotiationPending = useRef<boolean>(false); // Lock for negotiation
  const initialNegotiationDone = useRef<boolean>(false); // Flag for initial setup

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const pendingReplacements = useRef<{ kind: "audio" | "video"; track: MediaStreamTrack | null }[]>([]);

  const setDirection = (kind: "audio" | "video", dir: RTCRtpTransceiverDirection) => {
    const trans = kind === "audio" ? audioTransceiverRef.current : videoTransceiverRef.current;
    if (trans && trans.direction !== dir) {
      trans.direction = dir;
    }
  };

  const replaceTrackForKind = (kind: "audio" | "video", track: MediaStreamTrack | null) => {
    const pc = peerRef.current;
    if (!pc) return false;

    const trans = kind === "audio" ? audioTransceiverRef.current : videoTransceiverRef.current;
    if (trans && trans.sender) {
      trans.sender.replaceTrack(track);
      return true;
    }

    const sender = pc.getSenders().find((s) => s.track?.kind === kind);
    if (sender) {
      sender.replaceTrack(track);
      return true;
    }

    return false;
  };

  const addOrReplaceTrack = (track: MediaStreamTrack, stream: MediaStream) => {
    const pc = peerRef.current;
    if (!pc) return;

    const existingSender = pc.getSenders().find((s) => s.track && s.track.kind === track.kind);
    if (existingSender) {
      existingSender.replaceTrack(track);
      return;
    }

    const transRef = track.kind === "audio" ? audioTransceiverRef.current : videoTransceiverRef.current;
    if (transRef && transRef.sender) {
      transRef.sender.replaceTrack(track);
      return;
    }

    pc.addTrack(track, stream);
  };

  const flushPendingCandidates = async () => {
    const pc = peerRef.current;
    if (!pc) return;
    while (pendingCandidates.current.length) {
      const c = pendingCandidates.current.shift()!;
      await pc.addIceCandidate(new RTCIceCandidate(c));
    }
  };

  const startLocalStream = async (withVideo = true, withAudio = true) => {
    const constraints: MediaStreamConstraints = {};
    if (withVideo) constraints.video = true;
    if (withAudio) constraints.audio = { echoCancellation: true, noiseSuppression: true, autoGainControl: true };

    if (!withVideo && !withAudio) return localStreamRef.current;

    const newStream = await navigator.mediaDevices.getUserMedia(constraints);

    const currentStream = localStreamRef.current ?? new MediaStream();

    // Update for audio
    if (withAudio) {
      currentStream.getAudioTracks().forEach((t) => {
        t.stop();
        currentStream.removeTrack(t);
      });
      newStream.getAudioTracks().forEach((t) => {
        t.enabled = true;
        currentStream.addTrack(t);
        addOrReplaceTrack(t, currentStream);
      });
    }

    // Update for video
    if (withVideo) {
      currentStream.getVideoTracks().forEach((t) => {
        t.stop();
        currentStream.removeTrack(t);
      });
      newStream.getVideoTracks().forEach((t) => {
        t.enabled = true;
        currentStream.addTrack(t);
        addOrReplaceTrack(t, currentStream);
      });
    }

    // Set direction to sendrecv if enabling (keep after initial)
    if (withAudio && audioTransceiverRef.current?.direction !== "sendrecv") setDirection("audio", "sendrecv");
    if (withVideo && videoTransceiverRef.current?.direction !== "sendrecv") setDirection("video", "sendrecv");

    localStreamRef.current = currentStream;
    setLocalStream(currentStream);
    return currentStream;
  };

  const setSendingKind = async (kind: "audio" | "video", enable: boolean) => {
    const pc = peerRef.current;
    if (!pc || negotiationPending.current) {
      // Queue if negotiating
      pendingReplacements.current.push({ kind, track: enable ? await getNewTrack(kind) : null });
      return;
    }

    const trans = kind === "audio" ? audioTransceiverRef.current : videoTransceiverRef.current;
    let track = localStreamRef.current?.getTracks().find((t) => t.kind === kind && t.readyState === "live");

    if (enable) {
      if (!track) {
        track = await getNewTrack(kind);
        if (localStreamRef.current) localStreamRef.current.addTrack(track);
      }
      track.enabled = true;
      replaceTrackForKind(kind, track);
      if (trans?.direction !== "sendrecv") {
        setDirection(kind, "sendrecv");
        triggerNegotiationIfNeeded();
      }
    } else {
      if (track) {
        track.enabled = false;
        track.stop();
        replaceTrackForKind(kind, null);
        if (localStreamRef.current) localStreamRef.current.removeTrack(track);
      }
      // Keep direction sendrecv to avoid order changes; inactive m-line is fine
    }
  };

  const getNewTrack = async (kind: "audio" | "video") => {
    const constraints = kind === "audio" ? { audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } } : { video: true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream.getTracks()[0];
  };

  const triggerNegotiationIfNeeded = () => {
    const pc = peerRef.current;
    if (pc && pc.signalingState === "stable" && !negotiationPending.current) {
      negotiationPending.current = true;
      pc.createOffer().then((offer) => pc.setLocalDescription(offer)).then(() => {
        socketRef.current.emit("signal", { sessionId, offer: pc.localDescription });
      }).catch((err) => console.error("[WebRTC] Negotiation error", err))
        .finally(() => negotiationPending.current = false);
    }
  };

  const endConnection = () => {
    socketRef.current?.emit("liveAssistanceDisconnect", { sessionId, userId });

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    remoteStreamRef.current?.getTracks().forEach((t) => t.stop());

    setLocalStream(null);
    setRemoteStream(null);
    localStreamRef.current = null;
    remoteStreamRef.current = null;

    if (peerRef.current) {
      peerRef.current.ontrack = null;
      peerRef.current.onicecandidate = null;
      peerRef.current.onnegotiationneeded = null;
      peerRef.current.onsignalingstatechange = null;
      peerRef.current.getSenders().forEach((s) => s.replaceTrack(null));
      peerRef.current.close();
    }

    peerRef.current = null;
    audioTransceiverRef.current = null;
    videoTransceiverRef.current = null;
    pendingCandidates.current = [];
    pendingReplacements.current = [];
    negotiationPending.current = false;
    initialNegotiationDone.current = false;
  };

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, 
        {
          urls: [
            "turn:turn.manaf.live:3478?transport=udp",
            "turn:turn.manaf.live:3478?transport=tcp",
            "turns:turn.manaf.live:5349?transport=tcp"
          ],
          username: "webrtcuser",
          credential: "webrtcpass"
        }
      ]
    });

    peerRef.current = pc;

    audioTransceiverRef.current = pc.addTransceiver("audio", { direction: "recvonly" });
    videoTransceiverRef.current = pc.addTransceiver("video", { direction: "recvonly" });

    const sock = providedSocket ?? initSocket();
    socketRef.current = sock;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sock.emit("signal", { sessionId, candidate: event.candidate.toJSON() });
      }
    };

    pc.ontrack = (event: RTCTrackEvent) => {
      let s = remoteStreamRef.current ?? new MediaStream();
      if (event.streams && event.streams.length > 0) {
        s = event.streams[0];
      } else if (!s.getTracks().some((t) => t.id === event.track.id)) {
        s.addTrack(event.track);
      }

      remoteStreamRef.current = s;
      setRemoteStream(s);

      event.track.addEventListener('mute', () => console.debug("[ontrack] remote track muted", event.track.kind));
      event.track.addEventListener('unmute', () => console.debug("[ontrack] remote track unmuted", event.track.kind));
      event.track.addEventListener('ended', () => {
        s.removeTrack(event.track);
        setRemoteStream(new MediaStream(s.getTracks()));
      });
    };

    pc.onconnectionstatechange = () => {
      console.debug("[WebRTC] connectionState", pc.connectionState);
      if (pc.connectionState === "failed") {
        endConnection();
      }
    };

    pc.onsignalingstatechange = () => {
      console.debug("[WebRTC] signalingState", pc.signalingState);
      if (pc.signalingState === "stable") {
        negotiationPending.current = false;
        // Flush pending replacements after stable
        pendingReplacements.current.forEach(({ kind, track }) => replaceTrackForKind(kind, track));
        pendingReplacements.current = [];
        initialNegotiationDone.current = true;
      }
    };

    pc.onnegotiationneeded = async () => {
      console.debug("[WebRTC] onnegotiationneeded, signalingState:", pc.signalingState);
      if (pc.signalingState !== "stable" || negotiationPending.current) return;
      negotiationPending.current = true;
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sock.emit("signal", { sessionId, offer: pc.localDescription });
      } catch (err) {
        console.error("[WebRTC] onnegotiationneeded error:", err);
      } finally {
        negotiationPending.current = false;
      }
    };

    const handleInitiateOffer = async () => {
      if (role !== "mechanic") return;

      // Mechanic starts with stream if needed
      if (!localStreamRef.current) {
        await startLocalStream(true, true);
        sock.emit("mediaState", { sessionId, userId, isMuted: false, isVideoOn: true });
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sock.emit("signal", { sessionId, offer: pc.localDescription });
      console.debug("[useWebRTC] Offer sent (mechanic)");
    };

    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
      const pcNow = peerRef.current;
      if (!pcNow || negotiationPending.current) return;
      negotiationPending.current = true;
      console.debug("[WebRTC] Handling offer, signalingState:", pcNow.signalingState);

      try {
        if (pcNow.signalingState === "have-local-offer") {
          console.debug("[WebRTC] Glare: rolling back");
          await pcNow.setLocalDescription({ type: "rollback" });
        }

        await pcNow.setRemoteDescription(new RTCSessionDescription(offer));
        await flushPendingCandidates();

        pcNow.getTransceivers().forEach((tx) => {
          if (tx.direction === "inactive") tx.direction = "recvonly";
        });

        const answer = await pcNow.createAnswer();
        await pcNow.setLocalDescription(answer);
        sock.emit("signal", { sessionId, answer: pcNow.localDescription });
        console.debug("[WebRTC] Answer sent");
      } catch (err) {
        console.error("[WebRTC] handleOffer error:", err);
      } finally {
        negotiationPending.current = false;
      }
    };

    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
      const pcNow = peerRef.current;
      if (!pcNow || negotiationPending.current) return;
      negotiationPending.current = true;
      console.debug("[WebRTC] Handling answer, signalingState:", pcNow.signalingState);

      if (pcNow.signalingState === "have-local-offer") {
        try {
          await pcNow.setRemoteDescription(new RTCSessionDescription(answer));
          await flushPendingCandidates();
          console.debug("[WebRTC] Answer applied");
        } catch (err) {
          console.error("[WebRTC] handleAnswer error:", err);
        } finally {
          negotiationPending.current = false;
        }
      } else {
        console.debug("[WebRTC] Ignored answer (wrong state)");
      }
    };

    const handleCandidate = async (candidate: RTCIceCandidateInit) => {
      const pcNow = peerRef.current;
      if (!pcNow || !pcNow.remoteDescription) {
        pendingCandidates.current.push(candidate);
        return;
      }
      try {
        await pcNow.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {
        pendingCandidates.current.push(candidate);
      }
    };

    sock.on("initiateOffer", handleInitiateOffer);
    sock.on("offer", handleOffer);
    sock.on("answer", handleAnswer);
    sock.on("candidate", handleCandidate);

    // Join with initial media flags
    const initialMuted = true;
    const initialVideoOn = false;
    sock.emit("liveAssistance", { sessionId, userId, role, isMuted: initialMuted, isVideoOn: initialVideoOn });

    // For user role, delay initial stream until initial negotiation done
    if (role === "user") {
      const waitForInitial = setInterval(() => {
        if (initialNegotiationDone.current && !localStreamRef.current) {
          startLocalStream(true, true);
          sock.emit("mediaState", { sessionId, userId, isMuted: false, isVideoOn: true });
          clearInterval(waitForInitial);
        }
      }, 500);
      return () => clearInterval(waitForInitial);
    }

    return () => {
      sock.off("initiateOffer", handleInitiateOffer);
      sock.off("offer", handleOffer);
      sock.off("answer", handleAnswer);
      sock.off("candidate", handleCandidate);
      if (!providedSocket) sock.disconnect?.();
      pendingReplacements.current = [];
    };
  }, [sessionId, userId, role, providedSocket]);

  return {
    localStream,
    remoteStream,
    startLocalStream,
    endConnection,
    setSendingKind,
  };
};
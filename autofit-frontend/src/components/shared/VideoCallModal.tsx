import { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Settings,
  Copy,
  Shield,
  ArrowLeft,
  Grid3x3,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useWebRTC } from "@/hooks/useWebRTC";
import { SocketContext } from "@/context/SocketContext"; 

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  mechanicName: string;
  bookingTime: string;
  sessionId: string;
  userId: string;
  role: "user" | "mechanic";
}

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isYou: boolean;
  stream?: MediaStream;
}

export function VideoCallModal({
  isOpen,
  onClose,
  mechanicName,
  bookingTime,
  sessionId,
  userId,
  role,
}: VideoCallModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [layoutMode, setLayoutMode] = useState<"spotlight" | "grid">("spotlight");
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [videoPermissionDenied, setVideoPermissionDenied] = useState(false);
  const [duplicateSessionWarning, setDuplicateSessionWarning] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: userId,
      name: role === "user" ? "You" : mechanicName,
      isHost: role === "mechanic",
      isMuted: true,
      isVideoOn: false,
      isYou: true,
      stream: undefined,
    },
  ]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const socket = useContext(SocketContext); // Use global socket

  const remoteAudioMuted = false;

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const { localStream, remoteStream, startLocalStream, endConnection, setSendingKind } = useWebRTC({
    sessionId,
    userId,
    role,
    socket,
  });

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);
  useEffect(() => {
    remoteStreamRef.current = remoteStream;
  }, [remoteStream]);

  const hasVideoTrack = (s?: MediaStream | null) =>
    !!s && s.getVideoTracks().some((t) => t.readyState === "live" && t.enabled && !t.muted);
  const hasAudioTrack = (s?: MediaStream | null) =>
    !!s && s.getAudioTracks().some((t) => t.readyState === "live" && t.enabled && !t.muted);

  const assignLocalVideoEl = useCallback(
    (el: HTMLVideoElement | null) => {
      localVideoRef.current = el;
      if (el) {
        el.muted = true;
        el.playsInline = true;
        el.autoplay = true;
        el.srcObject = localStream ?? null;
        if (localStream) {
          const playVideo = () => el.play().catch((err) => {
            if (err.name !== 'AbortError') {
              console.warn("[VideoCallModal] Local play error", err);
              toast.error("Failed to play local video.");
            }
          });
          if (el.readyState >= 2) {
            playVideo();
          } else {
            el.addEventListener('loadedmetadata', playVideo, { once: true });
          }
        }
      }
    },
    [localStream]
  );

  const assignRemoteVideoEl = useCallback(
    (el: HTMLVideoElement | null) => {
      remoteVideoRef.current = el;
      if (el) {
        el.muted = remoteAudioMuted;
        el.playsInline = true;
        el.autoplay = true;
        el.srcObject = remoteStream ?? null;
        if (remoteStream) {
          const playVideo = () => el.play().catch((err) => {
            if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
              console.warn("[VideoCallModal] Remote play error", err);
              toast.error("Failed to play remote video.");
            } else if (err.name === 'NotAllowedError') {
              toast.error("Browser blocked audio playback. Interact with page to enable.");
            }
          });
          if (el.readyState >= 2) {
            playVideo();
          } else {
            el.addEventListener('loadedmetadata', playVideo, { once: true });
          }
        }
      }
    },
    [remoteStream, remoteAudioMuted]
  );

  useEffect(() => {
    const hasVid = hasVideoTrack(localStream);
    const hasAud = hasAudioTrack(localStream);
    setIsVideoOn(hasVid);
    setIsMuted(!hasAud);

    setParticipants((prev) =>
      prev.map((p) => (p.isYou ? { ...p, stream: localStream ?? undefined, isVideoOn: hasVid, isMuted: !hasAud } : p))
    );

    socket?.emit("mediaState", { sessionId, userId, isMuted: !hasAud, isVideoOn: hasVid });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream ?? null;
    }
  }, [localStream]);

  useEffect(() => {

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream ?? null;
      remoteVideoRef.current.muted = remoteAudioMuted;
    }

    const updateRemoteFlags = () => {
      const hasVid = hasVideoTrack(remoteStream);
      const hasAud = hasAudioTrack(remoteStream);
      setParticipants((prev) =>
        prev.map((p) => (!p.isYou ? { ...p, isVideoOn: hasVid, isMuted: !hasAud } : p))
      );
    };

    if (remoteStream) {
      setIsConnected(true);
      setParticipants((prev) => {
        const self = prev.find((p) => p.isYou) ?? {
          id: userId,
          name: role === "user" ? "You" : mechanicName,
          isHost: role === "mechanic",
          isMuted: !hasAudioTrack(localStream),
          isVideoOn: hasVideoTrack(localStream),
          isYou: true,
          stream: localStream ?? undefined,
        };

        const remote: Participant = {
          id: "remote",
          name: role === "user" ? mechanicName ?? "Mechanic" : "Customer",
          isHost: role === "user",
          isMuted: !hasAudioTrack(remoteStream),
          isVideoOn: hasVideoTrack(remoteStream),
          isYou: false,
          stream: remoteStream,
        };

        return [self, remote];
      });

      // Track listeners for remote
      remoteStream.getTracks().forEach((track) => {
        const handleMute = () => updateRemoteFlags();
        const handleUnmute = () => updateRemoteFlags();
        const handleEnded = () => {
          remoteStream.removeTrack(track);
          updateRemoteFlags();
        };
        track.addEventListener('mute', handleMute);
        track.addEventListener('unmute', handleUnmute);
        track.addEventListener('ended', handleEnded);
        return () => {
          track.removeEventListener('mute', handleMute);
          track.removeEventListener('unmute', handleUnmute);
          track.removeEventListener('ended', handleEnded);
        };
      });

      updateRemoteFlags();
    } else {
      setIsConnected(false);
      setParticipants((prev) => prev.filter((p) => p.isYou));
    }
  }, [remoteStream]);

  useEffect(() => {
    if (!isOpen || !socket) return;

    const handleParticipantsList = (list: { userId: string; role: "user" | "mechanic"; isMuted?: boolean; isVideoOn?: boolean }[]) => {
      const remoteEntry = list.find((item) => item.userId !== userId);
      const baseSelf: Participant = {
        id: userId,
        name: role === "user" ? "You" : mechanicName,
        isHost: role === "mechanic",
        isMuted: !hasAudioTrack(localStreamRef.current),
        isVideoOn: hasVideoTrack(localStreamRef.current),
        isYou: true,
        stream: localStreamRef.current ?? undefined,
      };

      if (!remoteEntry) {
        setParticipants([baseSelf]);
        setIsConnected(false);
        return;
      }

      const remoteName = remoteEntry.role === "mechanic" ? mechanicName ?? "Mechanic" : "Customer";
      const remoteParticipant: Participant = {
        id: remoteEntry.userId,
        name: remoteName,
        isHost: remoteEntry.role === "mechanic",
        isMuted: !!remoteEntry.isMuted,
        isVideoOn: !!remoteEntry.isVideoOn,
        isYou: false,
        stream: remoteStreamRef.current ?? undefined,
      };

      setParticipants([baseSelf, remoteParticipant]);
      setIsConnected(!!remoteStreamRef.current);
    };

    const handleParticipantJoined = ({ userId: joinedUserId, role: joinedRole, isMuted, isVideoOn }: { userId: string; role: "user" | "mechanic"; isMuted?: boolean; isVideoOn?: boolean }) => {
      setParticipants((prev) => {
        if (prev.some((p) => p.id === joinedUserId)) return prev;
        const name = joinedRole === "mechanic" ? mechanicName ?? "Mechanic" : "Customer";
        return [
          ...prev,
          {
            id: joinedUserId,
            name,
            isHost: joinedRole === "mechanic",
            isMuted: !!isMuted,
            isVideoOn: !!isVideoOn,
            isYou: false,
            stream: remoteStreamRef.current ?? undefined,
          },
        ];
      });
      setIsConnected(true);
    };

    const handleParticipantUpdated = ({ userId: uid, isMuted, isVideoOn }: { userId: string; isMuted?: boolean; isVideoOn?: boolean }) => {
      setParticipants((prev) => prev.map((p) => (p.id === uid ? { ...p, isMuted: !!isMuted, isVideoOn: !!isVideoOn } : p)));
    };

    const handleParticipantLeft = ({ userId: leftUserId }: { userId: string }) => {
      setParticipants((prev) => {
        const next = prev.filter((p) => p.id !== leftUserId);
        setIsConnected(!!next.find((p) => !p.isYou));
        return next;
      });
    };

    const handleWaiting = () => {
    };

    const handleSessionEnded = (payload: { message: string }) => {
      toast.error(payload.message || "Session ended");
      if (payload.message.includes("another device")) {
        setDuplicateSessionWarning(true);
      }
      endConnection(); 
      onClose(); 
    };

    socket.on("participantsList", handleParticipantsList);
    socket.on("participantJoined", handleParticipantJoined);
    socket.on("participantUpdated", handleParticipantUpdated);
    socket.on("participantLeft", handleParticipantLeft);
    socket.on("waiting", handleWaiting);
    socket.on("sessionEnded", handleSessionEnded);

    return () => {
      socket.off("participantsList", handleParticipantsList);
      socket.off("participantJoined", handleParticipantJoined);
      socket.off("participantUpdated", handleParticipantUpdated);
      socket.off("participantLeft", handleParticipantLeft);
      socket.off("waiting", handleWaiting);
      socket.off("sessionEnded", handleSessionEnded);

      // Full cleanup on unmount/close
      endConnection();
      // Remove socket.disconnect to keep global socket connected
    };
  }, [isOpen]);

  // Toggle mic
  const handleToggleMic = async () => {
    try {
      if (isMuted) {
        await startLocalStream(isVideoOn, true);
        setIsMuted(false);
        setMicPermissionDenied(false);
        socket?.emit("mediaState", { sessionId, userId, isMuted: false, isVideoOn });
        setParticipants((prev) => prev.map((p) => (p.isYou ? { ...p, isMuted: false } : p)));
      } else {
        setSendingKind("audio", false);
        setIsMuted(true);
        socket?.emit("mediaState", { sessionId, userId, isMuted: true, isVideoOn });
        setParticipants((prev) => prev.map((p) => (p.isYou ? { ...p, isMuted: true } : p)));
      }
    } catch (err: any) {
      setMicPermissionDenied(true);
      toast.error(err.name === "NotAllowedError" ? "Microphone access denied" : "Error toggling mic");
      setError("Microphone access denied");
    }
  };

  // Toggle video
  const handleToggleVideo = async () => {
    if (!isVideoOn) {
      setIsVideoLoading(true);
      try {
        await startLocalStream(true, !isMuted);
        setIsVideoOn(true);
        setVideoPermissionDenied(false);
        socket?.emit("mediaState", { sessionId, userId, isMuted, isVideoOn: true });
        setParticipants((prev) => prev.map((p) => (p.isYou ? { ...p, isVideoOn: true } : p)));
      } catch (err: any) {
        setVideoPermissionDenied(true);
        toast.error(err.name === "NotAllowedError" ? "Camera access denied" : "Error toggling camera");
        setError("Camera access denied");
      } finally {
        setIsVideoLoading(false);
      }
    } else {
      setSendingKind("video", false);
      setIsVideoOn(false);
      socket?.emit("mediaState", { sessionId, userId, isMuted, isVideoOn: false });
      setParticipants((prev) => prev.map((p) => (p.isYou ? { ...p, isVideoOn: false } : p)));
    }
  };

  const handleEndCall = () => {
    endConnection();
    socket?.emit("liveAssistanceDisconnect", { sessionId, userId });
    setIsMuted(true);
    setIsVideoOn(false);
    setCallDuration(0);
    setLayoutMode("spotlight");
    setError(null);
    setIsConnected(false);
    setIsVideoLoading(false);
    setMicPermissionDenied(false);
    setVideoPermissionDenied(false);
    setDuplicateSessionWarning(false);
    setParticipants([{
      id: userId,
      name: role === "user" ? "You" : mechanicName,
      isHost: role === "mechanic",
      isMuted: true,
      isVideoOn: false,
      isYou: true,
      stream: undefined,
    }]);
    onClose();
  };

  const getSelfParticipant = () => participants.find((p) => p.isYou);
  const getRemoteParticipant = () => participants.find((p) => !p.isYou);
  const formatDuration = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    if (isOpen) {
      const bookingStartTime = new Date(bookingTime).getTime();
      const timer = setInterval(() => {
        setCallDuration(Math.max(0, Math.floor((Date.now() - bookingStartTime) / 1000)));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, bookingTime]);

  const renderParticipantVideo = (participant: Participant, isMainVideo = false) => {
    const gradientClass = participant.isYou
      ? "bg-gradient-to-br from-blue-600 to-purple-700"
      : participant.isHost
      ? "bg-gradient-to-br from-green-600 to-emerald-700"
      : "bg-gradient-to-br from-orange-600 to-red-700";

    const getAvatarSize = () =>
      isMainVideo ? "w-20 sm:w-24 md:w-32 lg:w-40 h-20 sm:h-24 md:h-32 lg:h-40" : "w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20";

    const getTextSize = () => (isMainVideo ? "text-2xl sm:text-3xl md:text-4xl" : "text-base sm:text-lg md:text-xl");

    const streamHasVideo = participant.stream ? hasVideoTrack(participant.stream) : false;
    const streamHasAudio = participant.stream ? hasAudioTrack(participant.stream) : false;

    if (participant.stream && !streamHasVideo && streamHasAudio) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <div className={`${getAvatarSize()} bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3`}>
              <span className={`text-gray-400 ${getTextSize()} font-semibold`}>{participant.name.charAt(0).toUpperCase()}</span>
            </div>
            <Mic className={`${isMainVideo ? "w-8 sm:w-10" : "w-5 sm:w-6"} text-green-500 mx-auto mb-2`} />
            <span className="text-gray-300 text-sm sm:text-base">Audio only</span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-black/90 text-white text-xs font-medium backdrop-blur-md px-2 py-1">
              <span className="truncate max-w-20 sm:max-w-32">{participant.name}</span>
              {participant.isMuted ? <MicOff className="w-4 h-4 ml-1 text-red-400" /> : <Mic className="w-4 h-4 ml-1 text-green-400" />}
            </Badge>
            {participant.isHost && <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">Host</Badge>}
            {participant.isYou && <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">You</Badge>}
          </div>
        </div>
      );
    }

    if (participant.stream && !streamHasVideo && !streamHasAudio) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <div className={`${getAvatarSize()} bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3`}>
              <span className={`text-gray-400 ${getTextSize()} font-semibold`}>{participant.name.charAt(0).toUpperCase()}</span>
            </div>
            <AlertCircle className={`${isMainVideo ? "w-8 sm:w-10" : "w-5 sm:w-6"} text-red-500 mx-auto mb-2`} />
            <span className="text-gray-300 text-sm sm:text-base">No media</span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-black/90 text-white text-xs font-medium backdrop-blur-md px-2 py-1">
              <span className="truncate max-w-20 sm:max-w-32">{participant.name}</span>
              <MicOff className="w-4 h-4 ml-1 text-red-400" />
            </Badge>
            {participant.isHost && <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">Host</Badge>}
            {participant.isYou && <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">You</Badge>}
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {participant.stream && streamHasVideo && !isVideoLoading ? (
          participant.isYou ? (
            <video ref={assignLocalVideoEl} autoPlay muted playsInline className="w-full h-full object-contain rounded-xl transform scale-x-[-1]" />
          ) : (
            <video ref={assignRemoteVideoEl} autoPlay playsInline className="w-full h-full object-contain rounded-xl" />
          )
        ) : participant.isYou && isVideoLoading ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
            <div className="text-center text-white p-4">
              <Loader2 className="w-8 sm:w-10 mx-auto mb-2 text-blue-400 animate-spin" />
              <p className="text-sm sm:text-base">Loading camera...</p>
            </div>
          </div>
        ) : participant.isYou && error ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
            <div className="text-center text-white p-4">
              <AlertCircle className="w-8 sm:w-10 mx-auto mb-2 text-red-400" />
              <p className="text-sm sm:text-base">Camera error: {error}</p>
            </div>
          </div>
        ) : participant.isYou && !participant.isVideoOn ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
            <div className="text-center">
              <div className={`${getAvatarSize()} bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className={`text-gray-400 ${getTextSize()} font-semibold`}>{participant.name.charAt(0).toUpperCase()}</span>
              </div>
              <VideoOff className={`${isMainVideo ? "w-8 sm:w-10" : "w-5 sm:w-6"} text-gray-500 mx-auto mb-2`} />
              <span className="text-gray-400 text-sm sm:text-base">Camera off</span>
            </div>
          </div>
        ) : (
          <div className={`w-full h-full ${gradientClass} flex items-center justify-center rounded-xl relative`}>
            <div className={`${getAvatarSize()} bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20`}>
              <span className={`text-white ${getTextSize()} font-semibold drop-shadow-lg`}>{participant.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge variant="secondary" className="bg-black/90 text-white text-xs font-medium backdrop-blur-md px-2 py-1">
            <span className="truncate max-w-20 sm:max-w-32">{participant.name}</span>
            {participant.isMuted ? <MicOff className="w-4 h-4 ml-1 text-red-400" /> : <Mic className="w-4 h-4 ml-1 text-green-400" />}
          </Badge>
          {participant.isHost && <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">Host</Badge>}
          {participant.isYou && <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">You</Badge>}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const selfParticipant = getSelfParticipant();
  const remoteParticipant = getRemoteParticipant();
  const mainParticipant = remoteParticipant ?? selfParticipant;
  const overlayParticipant = remoteParticipant ? selfParticipant : null;
  const totalParticipants = participants.length;

  return (
    <div className="fixed inset-0 z-[10000] bg-gray-950 flex flex-col touch-none" style={{ height: "100vh" }}>
      {/* header */}
      <div className="flex-shrink-0 bg-black/60 backdrop-blur-md border-b border-gray-800/50 z-10">
        <div className="flex items-center justify-between p-4 min-h-[64px]">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 font-medium p-2" onClick={handleEndCall}>
              <ArrowLeft className="w-5 h-5" />
              <span className="ml-2">Back</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">{formatDuration(callDuration)}</span>
              </div>
              <Badge variant="secondary" className="bg-green-600/90 text-white text-xs font-medium px-2 py-1">
                <Shield className="w-4 h-4 mr-1" />
                {isConnected ? "Connected" : "Connecting"}
              </Badge>
              <div className="flex items-center gap-1 text-gray-300">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{totalParticipants}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2" onClick={() => setLayoutMode(layoutMode === "spotlight" ? "grid" : "spotlight")}>
              <Grid3x3 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <Copy className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 relative p-4 min-h-0 overflow-auto" style={{ paddingBottom: "96px" }}>
        {duplicateSessionWarning && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
            Session accessed from another device. This session has been ended.
          </div>
        )}
        {layoutMode === "grid" || totalParticipants === 1 ? (
          <div className={`h-full grid gap-4 transition-all duration-300 min-h-0 ${totalParticipants === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {participants.map((participant) => (
              <div key={participant.id} className="video-tile overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl min-h-[300px]">
                {renderParticipantVideo(participant, true)}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full relative transition-all duration-300 min-h-0">
            {mainParticipant && (
              <div className="video-tile h-full overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl min-h-[300px]">
                {renderParticipantVideo(mainParticipant, true)}
              </div>
            )}
            {overlayParticipant && (
              <div className="absolute bottom-4 right-4 w-32 sm:w-40 md:w-48 lg:w-64 h-24 sm:h-32 md:h-40 lg:h-48 z-10">
                <div className="video-tile h-full overflow-hidden bg-black border-2 border-blue-500/50 shadow-2xl rounded-xl">
                  {renderParticipantVideo(overlayParticipant, false)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-gray-800/50 z-10">
        <div className="flex items-center justify-center p-6 min-h-[96px]">
          <div className="flex items-center gap-4">
            <Button size="lg" className={cn("w-14 h-14 rounded-full font-semibold shadow-lg relative", isMuted ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400" : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500")} onClick={handleToggleMic}>
              {micPermissionDenied ? <AlertCircle className="w-6 h-6 text-red-400" /> : isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>

            <Button size="lg" className={cn("w-14 h-14 rounded-full font-semibold shadow-lg relative", !isVideoOn ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400" : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500")} onClick={handleToggleVideo}>
              {videoPermissionDenied ? <AlertCircle className="w-6 h-6 text-red-400" /> : isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            <Button size="lg" className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-red-400 shadow-lg" onClick={handleEndCall}>
              <Phone className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
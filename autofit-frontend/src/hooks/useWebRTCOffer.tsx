import { useState, useEffect, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";

interface UseWebRTCOfferProps {
  socket: Socket;
  sessionId: string;
  stream: MediaStream | null;
  onRemoteStream: (stream: MediaStream) => void;
}

export function useWebRTCOffer({
  socket,
  sessionId,
  stream,
  onRemoteStream,
}: UseWebRTCOfferProps) {
  const [isConnected, setIsConnected] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

  const resetPeerConnection = useCallback(() => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    iceCandidatesQueue.current = [];
    setIsConnected(false);
  }, []);

  useEffect(() => {
    resetPeerConnection();

    if (stream) {
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });
    }

    const pc = peerConnection.current!;

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      console.log("Received remote stream:", remoteStream.id);
      onRemoteStream(remoteStream);
      setIsConnected(true);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate.candidate);
        socket.emit("signal", {
          sessionId,
          data: { type: "iceCandidate", candidate: event.candidate },
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("WebRTC connection state:", pc.connectionState);
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        setIsConnected(false);
        onRemoteStream(new MediaStream());
      }
    };

    socket.on("signal", async ({ data }) => {
      if (!peerConnection.current) return;
      try {
        if (data.type === "offer") {
          console.log("Received offer:", data.offer);
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          console.log("Sending answer:", answer);
          socket.emit("signal", {
            sessionId,
            data: { type: "answer", answer },
          });
          while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            if (candidate) {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(candidate)
              );
              console.log("Added queued ICE candidate:", candidate);
            }
          }
        } else if (data.type === "answer") {
          console.log("Received answer:", data.answer);
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        } else if (data.type === "iceCandidate") {
          if (peerConnection.current.remoteDescription) {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
            console.log("Added ICE candidate:", data.candidate);
          } else {
            iceCandidatesQueue.current.push(data.candidate);
            console.log("Queued ICE candidate:", data.candidate);
          }
        }
      } catch (error) {
        console.error("Error handling signal:", error);
      }
    });

    socket.on("initiateOffer", async () => {
      if (!peerConnection.current) return;
      try {
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        console.log("Sending offer:", offer);
        socket.emit("signal", { sessionId, data: { type: "offer", offer } });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    });

    return () => {
      socket.off("signal");
      socket.off("initiateOffer");
      resetPeerConnection();
    };
  }, [socket, sessionId, stream, onRemoteStream, resetPeerConnection]);

  return { isConnected, resetPeerConnection };
}
// useGetMedia.ts
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface MediaState {
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoOn: boolean;
  isVideoLoading: boolean;
  micPermissionDenied: boolean;
  videoPermissionDenied: boolean;
  error: string | null;
  isConnected: boolean;
}

interface UseGetMediaReturn extends MediaState {
  toggleMic: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  cleanup: () => void;
}

export const useGetMedia = (isOpen: boolean): UseGetMediaReturn => {
  const [mediaState, setMediaState] = useState<MediaState>({
    stream: null,
    isMuted: true,
    isVideoOn: false,
    isVideoLoading: false,
    micPermissionDenied: false,
    videoPermissionDenied: false,
    error: null,
    isConnected: false,
  });

  const streamRef = useRef<MediaStream | null>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const updateState = (updates: Partial<MediaState>) => {
    setMediaState((prev) => ({ ...prev, ...updates }));
  };

  const toggleMic = async () => {
    if (!streamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isOpenRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        stream.getAudioTracks().forEach((track) => (track.enabled = true));
        updateState({ stream, isMuted: false, error: null, micPermissionDenied: false, isConnected: true });
      } catch {
        if (isOpenRef.current) {
          toast.error("Microphone access denied");
          updateState({ error: "Microphone access denied", micPermissionDenied: true });
        }
      }
    } else {
      const newMuted = !mediaState.isMuted;
      streamRef.current.getAudioTracks().forEach((track) => (track.enabled = !newMuted));
      updateState({ isMuted: newMuted, micPermissionDenied: false });
    }
  };

  const toggleVideo = async () => {
    if (!mediaState.isVideoOn) {
      updateState({ isVideoLoading: true });
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: !mediaState.isMuted,
        });
        if (!isOpenRef.current) {
          videoStream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = videoStream;
        videoStream.getVideoTracks().forEach((track) => (track.enabled = true));
        if (!mediaState.isMuted) videoStream.getAudioTracks().forEach((track) => (track.enabled = true));
        console.log("Video stream active:", videoStream.active); // Debug
        updateState({
          stream: videoStream,
          isVideoOn: true,
          error: null,
          videoPermissionDenied: false,
          isConnected: true,
        });
      } catch {
        if (isOpenRef.current) {
          toast.error("Camera access denied");
          updateState({ error: "Camera access denied", videoPermissionDenied: true });
        }
      } finally {
        updateState({ isVideoLoading: false });
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((track) => track.stop());
        const audioTracks = streamRef.current.getAudioTracks();
        streamRef.current = audioTracks.length > 0 ? new MediaStream(audioTracks) : null;
        updateState({ stream: streamRef.current, isVideoOn: false, videoPermissionDenied: false });
      }
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setMediaState({
      stream: null,
      isMuted: true,
      isVideoOn: false,
      isVideoLoading: false,
      micPermissionDenied: false,
      videoPermissionDenied: false,
      error: null,
      isConnected: false,
    });
  };

  return {
    ...mediaState,
    toggleMic,
    toggleVideo,
    cleanup,
  };
};
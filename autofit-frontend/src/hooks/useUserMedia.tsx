


import { useState, useEffect } from "react";

export function useUserMedia(constraints: MediaStreamConstraints) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isMounted) {
          setStream(mediaStream);
          setError(null);
          console.log("Stream acquired:", mediaStream.active, mediaStream.getVideoTracks());
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
          setStream(null);
          console.log("Stream error:", err.message);
        }
      }
    };

    getMedia();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        console.log("Stream cleanup");
      }
    };
  }, [constraints.video, constraints.audio]);

  return { stream, error };
}
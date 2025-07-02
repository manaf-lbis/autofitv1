import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export function useGeolocation() {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported. GPS may be unavailable.");
      setGeolocation((prev) => ({ ...prev, error: "Geolocation not supported." }));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000,
    };

    let isGpsCheckComplete = false;

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      if (!isGpsCheckComplete && accuracy > 1000) {
        toast.error("Inaccurate location due to missing GPS.");
        setGeolocation((prev) => ({ ...prev, error: "Inaccurate location (GPS may be missing)." }));
      } else {
        setGeolocation({ latitude, longitude, error: null });
      }
      isGpsCheckComplete = true;
    };

    const handleError = (error: GeolocationPositionError) => {
      if (!isGpsCheckComplete) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeolocation((prev) => ({ ...prev, error: "Permission denied for location access." }));
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Inaccurate location due to missing GPS.");
            setGeolocation((prev) => ({ ...prev, error: "Location unavailable (GPS may be missing)." }));
            break;
          case error.TIMEOUT:
            setGeolocation((prev) => ({ ...prev, error: "Location request timed out." }));
            break;
          default:
            setGeolocation((prev) => ({ ...prev, error: "Unknown error occurred." }));
            break;
        }
        isGpsCheckComplete = true;
      }
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return geolocation;
}
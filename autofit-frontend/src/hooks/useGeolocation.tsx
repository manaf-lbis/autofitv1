// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";

// interface GeolocationState {
//   latitude: number | null;
//   longitude: number | null;
//   error: string | null;
// }

// export function useGeolocation() {
//   const [geolocation, setGeolocation] = useState<GeolocationState>({
//     latitude: null,
//     longitude: null,
//     error: null,
//   });

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation not supported. GPS may be unavailable.");
//       setGeolocation((prev) => ({ ...prev, error: "Geolocation not supported." }));
//       return;
//     }

//     const options = {
//       enableHighAccuracy: true,
//       maximumAge: 10000,
//       timeout: 5000,
//     };

//     let isGpsCheckComplete = false;

//     const handleSuccess = (position: GeolocationPosition) => {
//       const { latitude, longitude, accuracy } = position.coords;
//       if (!isGpsCheckComplete && accuracy > 1000) {
//         toast.error("Inaccurate location due to missing GPS");
//         setGeolocation((prev) => ({ ...prev, error: "Inaccurate location (GPS may be missing)." }));
//       } else {
//         setGeolocation({ latitude, longitude, error: null });
//       }
//       isGpsCheckComplete = true;
//     };

//     const handleError = (error: GeolocationPositionError) => {
//       if (!isGpsCheckComplete) {
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             setGeolocation((prev) => ({ ...prev, error: "Permission denied for location access." }));
//             break;
//           case error.POSITION_UNAVAILABLE:
//             toast.error("Inaccurate location due to missing GPS.");
//             setGeolocation((prev) => ({ ...prev, error: "Location unavailable (GPS may be missing)." }));
//             break;
//           case error.TIMEOUT:
//             setGeolocation((prev) => ({ ...prev, error: "Location request timed out." }));
//             break;
//           default:
//             setGeolocation((prev) => ({ ...prev, error: "Unknown error occurred." }));
//             break;
//         }
//         isGpsCheckComplete = true;
//       }
//     };

//     const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

//     navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

//     return () => {
//       if (watchId) navigator.geolocation.clearWatch(watchId);
//     };
//   }, []);

//   return geolocation;
// }



import { useState, useEffect } from "react";

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
      setGeolocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 2000,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      if (accuracy > 1000) {
        setGeolocation({ latitude, longitude, error: "Inaccurate location due to missing GPS." });
      } else {
        setGeolocation({ latitude, longitude, error: null });
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage: string;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permission denied for location access.";
          setGeolocation({ latitude: null, longitude: null, error: errorMessage });
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location unavailable (GPS may be missing).";
          setGeolocation({ latitude: null, longitude: null, error: errorMessage });
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out, using approximate location.";
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setGeolocation({ latitude, longitude, error: "Inaccurate location due to missing GPS." });
            },
            () => {
              setGeolocation({ latitude: null, longitude: null, error: "Unable to get location." });
            },
            { enableHighAccuracy: false, timeout: 1000 }
          );
          break;
        default:
          errorMessage = "An unknown error occurred.";
          setGeolocation({ latitude: null, longitude: null, error: errorMessage });
          break;
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
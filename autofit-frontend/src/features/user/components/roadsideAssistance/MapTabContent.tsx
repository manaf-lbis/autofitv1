import { useEffect, useState } from "react";
import {APIProvider,Map,AdvancedMarker,useMap } from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import { initSocket } from "@/lib/socket";
import { AlertTriangle } from "lucide-react";
import navigation_car from '@/assets/common/navigation_car.png'

interface LocationData {
  bookingId: string;
  latitude: number;
  longitude: number;
}

interface MapTabContentProps {
  serviceLocation: { coordinates: [number, number] };
  mechanic: { name: string; avatar: string; _id: string };
  bookingId: string;
}

function RouteRenderer({
  startLat,
  startLng,
  endLat,
  endLng,
  setEta,
}: {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  setEta: (eta: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#3B82F6",
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
    });
    directionsRenderer.setMap(map);

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: endLat, lng: endLng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
          const duration = result.routes[0].legs.reduce(
            (total, leg) => total + (leg.duration?.value || 0),
            0
          );
          setEta(`${Math.ceil(duration / 60)} min`);
        } else {
          setEta("N/A");
        }
      }
    );

    return () => directionsRenderer.setMap(null);
  }, [map, startLat, startLng, endLat, endLng, setEta]);

  return null;
}

export function MapTabContent({
  serviceLocation,
  mechanic,
  bookingId,
}: MapTabContentProps) {
  const [mechanicLocation, setMechanicLocation] = useState<{
    lat: number;
    lng: number;
    timestamp?: number;
  } | null>(null);
  const [eta, setEta] = useState<string>("Calculating...");
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    const socket = initSocket();
    const room = `live_tracking_${bookingId}`;
    socket.emit("joinRoom", { room });

    // Request last known location
    socket.emit(
      "requestLastLocation",
      { bookingId },
      (response: { lat: number; lng: number; timestamp: number } | null) => {
        if (response && Date.now() - response.timestamp < 24 * 60 * 60 * 1000) {
          setMechanicLocation({
            lat: response.lat,
            lng: response.lng,
            timestamp: response.timestamp,
          });
          setIsDelayed(false);
        }
      }
    );

    const handleLocationUpdate = (data: LocationData) => {
      if (data.bookingId === bookingId) {
        setMechanicLocation({
          lat: data.latitude,
          lng: data.longitude,
          timestamp: Date.now(),
        });
        setIsDelayed(false);
      }
    };

    socket.on("mechanicLocationUpdate", handleLocationUpdate);

    const timeout = setTimeout(
      () => !mechanicLocation?.timestamp && setIsDelayed(true),
      10000
    );
    return () => {
      socket.emit("leaveRoom", { room });
      socket.off("mechanicLocationUpdate", handleLocationUpdate);
      clearTimeout(timeout);
    };
  }, [bookingId]);

  const center = mechanicLocation || {
    lat: serviceLocation.coordinates[1],
    lng: serviceLocation.coordinates[0],
  };
  const lastUpdated = mechanicLocation?.timestamp
    ? new Date(mechanicLocation.timestamp).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  return (
    <div className="bg-white/90 rounded-xl shadow-md border overflow-hidden relative">
      <div className="p-3 border-b bg-gradient-to-r from-gray-50 via-blue-50/50 to-indigo-50/30">
        <h3 className="text-sm font-medium text-gray-700">Track Mechanic</h3>
      </div>
      <div className="px-4 py-2 bg-slate-50 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm font-medium text-gray-700">ETA</span>
        </div>
        <span className="text-lg font-bold text-gray-900">{eta}</span>
      </div>
      <div className="p-4">
        <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden relative">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={center}
              defaultZoom={15}
              gestureHandling="greedy"
              disableDefaultUI
              mapId={import.meta.env.VITE_MAP_ID}
              style={{ width: "100%", height: "100%" }}
            >
              {mechanicLocation && (
                <AdvancedMarker position={mechanicLocation}>
                  <img
                    src={navigation_car}
                    alt="Mechanic"
                    className="w-8 h-8 drop-shadow-md"
                  />
                </AdvancedMarker>
              )}
              <AdvancedMarker
                position={{
                  lat: serviceLocation.coordinates[1],
                  lng: serviceLocation.coordinates[0],
                }}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </AdvancedMarker>
              {mechanicLocation && (
                <RouteRenderer
                  startLat={mechanicLocation.lat}
                  startLng={mechanicLocation.lng}
                  endLat={serviceLocation.coordinates[1]}
                  endLng={serviceLocation.coordinates[0]}
                  setEta={setEta}
                />
              )}
            </Map>
          </APIProvider>
          {isDelayed && mechanicLocation && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-3 rounded-lg shadow-lg text-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">
                  Last Updated: {lastUpdated}
                </p>
                <p className="text-xs text-gray-500">
                  Location update delayed.
                </p>
              </div>
            </div>
          )}
        </div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 bg-white rounded-lg shadow-md p-2 flex items-center gap-2"
        >
          <img
            src={mechanic.avatar || "/placeholder.svg"}
            alt={mechanic.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-xs font-medium">{mechanic.name}</p>
            <p className="text-[10px] text-gray-600">On the way</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

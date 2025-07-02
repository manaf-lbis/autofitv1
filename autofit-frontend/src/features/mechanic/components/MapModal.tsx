import { X } from "lucide-react";
import { APIProvider,Map,AdvancedMarker,useMapsLibrary,useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState, useRef } from "react";
import navigation_car from '@/assets/common/navigation_car.png'

declare global {
  interface Window {
    google: typeof google;
  }
}

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

interface RouteRendererProps extends MapModalProps {
  setEta: (eta: string) => void;
}

function RouteRenderer({ startLat, startLng, endLat, endLng, setEta }: RouteRendererProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [vehicleMarker, setVehicleMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const [routePath, setRoutePath] = useState<google.maps.LatLng[]>([]);
  const animationRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);

  const calculateBearing = (start: google.maps.LatLng, end: google.maps.LatLng) => {
    const lat1 = (start.lat() * Math.PI) / 180;
    const lat2 = (end.lat() * Math.PI) / 180;
    const dLon = ((end.lng() - start.lng()) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  useEffect(() => {
    if (!routesLibrary || !map) return;

    const directionsRenderer = new routesLibrary.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#3B82F6",
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
    });

    directionsRenderer.setMap(map);

    const directionsService = new routesLibrary.DirectionsService();

    directionsService.route(
      {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: endLat, lng: endLng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
          const path: google.maps.LatLng[] = [];
          result.routes[0].legs.forEach((leg) =>
            leg.steps.forEach((s) => path.push(...s.path))
          );
          setRoutePath(path);

          const duration = result.routes[0].legs.reduce((total, leg) => total + (leg.duration?.value || 0), 0);
          const minutes = Math.ceil(duration / 60);
          setEta(`${minutes} min`);

          const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            content: document.createElement("img") as HTMLImageElement,
            position: path[0],
          });
          (marker.content as HTMLImageElement).src = navigation_car;
          (marker.content as HTMLImageElement).style.width = "32px";
          (marker.content as HTMLImageElement).style.height = "32px";
          (marker.content as HTMLImageElement).style.transformOrigin = "center";
          (marker.content as HTMLImageElement).style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";
          setVehicleMarker(marker);

          const animate = () => {
            if (progress < 1 && vehicleMarker && routePath.length > 1) {
              const steps = routePath.length - 1;
              const idx = Math.floor(progress * steps);
              const nextIdx = Math.min(idx + 1, steps);
              const lerp = (progress * steps) % 1;

              const currentPos = routePath[idx];
              const nextPos = routePath[nextIdx];
              const lat = currentPos.lat() + (nextPos.lat() - currentPos.lat()) * lerp;
              const lng = currentPos.lng() + (nextPos.lng() - currentPos.lng()) * lerp;
              const position = new google.maps.LatLng(lat, lng);

              vehicleMarker.position = position;

              if (idx < steps) {
                const bearing = calculateBearing(currentPos, nextPos);
                (vehicleMarker.content as HTMLImageElement).style.transform = `rotate(${bearing}deg)`;
              }

              setProgress((p) => Math.min(p + 0.005, 1));
              animationRef.current = requestAnimationFrame(animate);
            }
          };
          animate();
        } else {
          console.error("Directions request failed with status:", status);
        }
      }
    );

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (vehicleMarker) vehicleMarker.map = null;
    };
  }, [routesLibrary, map]);

  return null;
}

export default function MapModal({ isOpen, onClose, startLat, startLng, endLat, endLng }: MapModalProps) {
  const [eta, setEta] = useState<string>("Calculating...");

  if (!isOpen) return null;

  const center = { lat: (startLat + endLat) / 2, lng: (startLng + endLng) / 2 };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full h-full sm:max-w-2xl sm:max-h-[85vh] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Route Map</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* ETA Display */}
        <div className="px-6 py-4 bg-slate-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Estimated Arrival</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">{eta}</span>
              <p className="text-xs text-gray-500">Based on current traffic</p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 h-[calc(100%-8rem)]">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["routes"]}>
            <Map
              style={{ width: "100%", height: "100%" }}
              defaultCenter={center}
              defaultZoom={12}
              gestureHandling="greedy"
              disableDefaultUI
              mapId={import.meta.env.VITE_MAP_ID}
            >
              {/* Destination Marker */}
              <AdvancedMarker position={{ lat: endLat, lng: endLng }}>
                <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </AdvancedMarker>

              <RouteRenderer
                startLat={startLat}
                startLng={startLng}
                endLat={endLat}
                endLng={endLng}
                isOpen={isOpen}
                onClose={onClose}
                setEta={setEta}
              />
            </Map>
          </APIProvider>
        </div>
      </div>
    </div>
  );
}

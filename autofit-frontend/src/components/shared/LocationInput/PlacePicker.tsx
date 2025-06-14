import React, { useState, useCallback, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, MapMouseEvent } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LocateFixed,  Navigation } from "lucide-react";
import toast from "react-hot-toast";

const containerStyle = { width: "100%", height: "400px" };
const center = { lat: 20.5937, lng: 78.9629 };

interface PlacePickerProps {
  onChange: (coords: { lat: number; lng: number }) => void;
  value: { lat: number; lng: number } | null;
  className? :string
}

const PlacePicker: React.FC<PlacePickerProps> = ({ onChange, value ,className}) => {
  const [open, setOpen] = useState(false);
  const [hasPermissionBeenDenied, setHasPermissionBeenDenied] = useState(false);

  const onMapClick = useCallback((event: MapMouseEvent) => {
    const clickData = event.detail as { latLng: { lat: number; lng: number } | null; placeId: string | null };
    if (clickData.latLng) {
      const { lat, lng } = clickData.latLng;
      onChange({ lat, lng });
    }
  }, [onChange]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.", {
        id: "geolocation-unsupported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onChange({ lat, lng });
        setHasPermissionBeenDenied(false);
      },
      () => {
        if (!hasPermissionBeenDenied) {
          toast.error("Permission denied or location unavailable.", {
            id: "location-permission-denied",
          });
          setHasPermissionBeenDenied(true);
        }
      },{
        enableHighAccuracy:true
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button className={`${className}`} type="button">
            <Navigation className="w-4 h-4 mr-2" />
            Choose Location
          </Button>
        </div>
    
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Pick a Location</DialogTitle>
        </DialogHeader>

        <div className="h-[400px] w-full">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
            <Map
              style={containerStyle}
              defaultCenter={value || center}
              defaultZoom={value ? 15 : 5}
              mapId={import.meta.env.VITE_MAP_ID}
              onClick={onMapClick}
              zoomControl={true}
              fullscreenControl={true}
              gestureHandling='greedy'
            >
              {value && <AdvancedMarker position={value} />}
            </Map>
          </APIProvider>
        </div>

        <DialogFooter className="p-4 border-t justify-end">
          <Button variant="outline" size="sm" onClick={getCurrentLocation} className="gap-1 text-sm">
            <LocateFixed className="h-4 w-4" />
            Use My Location
          </Button>
          <Button className={`${className}`} onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlacePicker;
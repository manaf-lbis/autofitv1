import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LocateFixed } from "lucide-react";

const containerStyle = { width: "100%", height: "400px" };
const center = { lat: 20.5937, lng: 78.9629 };

interface PlacePickerProps {
  onChange: (coords: { lat: number; lng: number }) => void;
  value: { lat: number; lng: number } | null;
}

const PlacePicker: React.FC<PlacePickerProps> = ({ onChange, value }) => {
  const [open, setOpen] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onChange({ lat, lng });
    }
  }, [onChange]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onChange({ lat, lng });
      },
      () => {
        alert("Permission denied or location unavailable");
      }
    );
  };

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Choose Location</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Pick a Location</DialogTitle>
        </DialogHeader>

        <div className="h-[400px] w-full">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={value||center}
            zoom={value ? 15 : 5}
            onClick={onMapClick}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              fullscreenControl: true,
            }}
          >
            {value && <Marker position={value} />}
          </GoogleMap>
        </div>

        <DialogFooter className="p-4 border-t justify-end">
          <Button variant="outline" size="sm" onClick={getCurrentLocation} className="gap-1 text-sm">
            <LocateFixed className="h-4 w-4" />
            Use My Location
          </Button>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlacePicker;
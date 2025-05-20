import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "../ui/button";

interface PickLocationProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number) => void;
  location: { lat: number; lng: number } | null;
}

const PickLocation: React.FC<PickLocationProps> = ({ isOpen, onClose, onLocationSelect }) => {
  const defaultCenter: L.LatLngExpression = [9.9312, 76.2673]; 
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [mapStyle, setMapStyle] = useState("streets-v2");

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedPosition([lat, lng]);
      },
    });
    return null;
  };

  const MapInvalidator = () => {
    const map = useMap();
    useEffect(() => {
      if (isOpen) {
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    }, [map, isOpen]);
    return null;
  };

  useEffect(() => {
  }, [selectedPosition]);

  const handleConfirm = () => {
    if (selectedPosition) {
      const [lat, lng] = selectedPosition;
      onLocationSelect(lat, lng);
      onClose();
    }
  };

  const selectedLocationIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mb-4">
          <div className="flex space-x-2">
            <Select onValueChange={setMapStyle} defaultValue={mapStyle}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Map Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="streets-v2">Streets</SelectItem>
                <SelectItem value="basic-v2">Basic</SelectItem>
                <SelectItem value="darkmatter">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div style={{ height: "400px", width: "100%" }}>
          <MapContainer center={defaultCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url={`https://api.maptiler.com/maps/${mapStyle}/256/{z}/{x}/{y}.png?key=djyTkM94nJ23NtITs0La`}
              attribution='© <a href="https://www.maptiler.com/copyright/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {selectedPosition && (
              <Marker position={selectedPosition} icon={selectedLocationIcon} />
            )}
            <MapClickHandler />
            <MapInvalidator />
          </MapContainer>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleConfirm} disabled={!selectedPosition}>
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PickLocation;



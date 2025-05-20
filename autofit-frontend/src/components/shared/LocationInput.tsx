import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import PickLocation from "./PickLocation";
import { UseFormSetValue, UseFormRegister, FieldError } from "react-hook-form";

interface LocationInputProps {
  setValue: UseFormSetValue<any>; 
  register: UseFormRegister<any>;
  error?: FieldError;
  defaultValue?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ setValue, register, error, defaultValue }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [localError, setLocalError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Set state from defaultValue on mount
  useEffect(() => {
    if (defaultValue) {
      const [latStr, lngStr] = defaultValue.split(",");
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation({ lat, lng });
      }
    }
  }, [defaultValue]);
  
  useEffect(() => {
    if (location) {
      const value = `${location.lat},${location.lng}`;
      setValue("location", value); 
    }
  }, [location, setValue]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocalError("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocalError("");
      },
      () => {
        setLocalError("Permission denied or location unavailable");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex w-full items-center space-x-2">
        <Input
          {...register("location", {
            required: "Location is required",
            pattern: {
              value: /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, 
              message: "Invalid location format. Use lat,lng",
            },
          })}
          className="w-full"
          type="text"
          placeholder="Latitude,Longitude"
          readOnly
          value={location ? `${location.lat},${location.lng}` : ""}
        />
        <Button onClick={getLocation} type="button">
          Use Current Location
        </Button>
      </div>
      <p
        className="text-blue-600 text-xs mb-2 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        Pick From Map?
      </p>
      {(error?.message || localError) && (
        <p className="text-red-500 text-xs">{error?.message || localError}</p>
      )}
      <PickLocation
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLocationSelect={handleLocationSelect}
        location={location}
      />
    </>
  );
};

export default LocationInput;
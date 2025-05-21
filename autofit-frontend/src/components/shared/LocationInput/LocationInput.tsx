// import React, { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
// import PlacePicker from "./PlacePicker";
// import LatLngToAddress from "./LatLngToAddress";

// interface LocationInputProps {
//   id: string;
//   label: string;
//   name: string;
//   register: UseFormRegister<any>;
//   setValue: UseFormSetValue<any>;
//   error?: FieldError;
//   defaultValue?:string

// }

// const LocationInput: React.FC<LocationInputProps> = ({
//   id,
//   label,
//   name,
//   register,
//   setValue,
//   error,
//   defaultValue
// }) => {
//   const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

//   useEffect(() => {
//     if (coords) {
//       setValue(name, `${coords.lat},${coords.lng}`, { shouldValidate: false });
//     } else {
//       setValue(name, "", { shouldValidate: false });
//     }
//   }, [coords, name, setValue]);


//   const validationRules = register(name, {
//     required: "Location is required",
//     validate: (value: string) => {
//       const parts = value.split(",");
//       if (parts.length !== 2) return "Invalid location format. Use lat,lng";
//       const lat = parseFloat(parts[0]);
//       const lng = parseFloat(parts[1]);
//       if (isNaN(lat) || isNaN(lng)) return "Latitude and Longitude must be numbers";
//       if (lat < -90 || lat > 90) return "Latitude must be between -90 and 90";
//       if (lng < -180 || lng > 180) return "Longitude must be between -180 and 180";
//       return true;
//     },
//   });

//   return (
//     <div className="flex flex-col gap-1">
//       <Label htmlFor={id}>{label}</Label>

//       <div className="flex items-center space-x-2">
//         <Input
//           id={id}
//           type="text"
//           placeholder="Latitude, Longitude"
//           readOnly
//           {...validationRules}
//           value={coords ? `${coords.lat.toFixed(5)},${coords.lng.toFixed(5)}` : ""}
//         />
//         <PlacePicker value={coords} onChange={setCoords} />
//       </div>

//       {coords && <LatLngToAddress lat={coords.lat} lng={coords.lng} />}

//       {error && <p className="text-red-500 text-xs">{error.message}</p>}
//     </div>
//   );
// };

// export default LocationInput;



import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegister, UseFormSetValue } from "react-hook-form";
import PlacePicker from "./PlacePicker";
import LatLngToAddress from "./LatLngToAddress";

interface LocationInputProps {
  id: string;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  error?: FieldError;
  defaultValue?: string;  // e.g. "12.34567,67.89012"
}

const LocationInput: React.FC<LocationInputProps> = ({
  id,
  label,
  name,
  register,
  setValue,
  error,
  defaultValue
}) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Parse defaultValue and set coords on mount or when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      const parts = defaultValue.split(",");
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          setCoords({ lat, lng });
          // Also update react-hook-form value initially
          setValue(name, defaultValue, { shouldValidate: false });
          return;
        }
      }
    }
    // If no valid defaultValue, clear coords and form value
    setCoords(null);
    setValue(name, "", { shouldValidate: false });
  }, [defaultValue, name, setValue]);

  // Update form value whenever coords changes (like when user picks a new place)
  useEffect(() => {
    if (coords) {
      setValue(name, `${coords.lat},${coords.lng}`, { shouldValidate: false });
    } else {
      setValue(name, "", { shouldValidate: false });
    }
  }, [coords, name, setValue]);

  const validationRules = register(name, {
    required: "Location is required",
    validate: (value: string) => {
      const parts = value.split(",");
      if (parts.length !== 2) return "Invalid location format. Use lat,lng";
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (isNaN(lat) || isNaN(lng)) return "Latitude and Longitude must be numbers";
      if (lat < -90 || lat > 90) return "Latitude must be between -90 and 90";
      if (lng < -180 || lng > 180) return "Longitude must be between -180 and 180";
      return true;
    },
  });

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex items-center space-x-2">
        <Input
          id={id}
          type="text"
          placeholder="Latitude, Longitude"
          readOnly
          {...validationRules}
          value={coords ? `${coords.lat.toFixed(5)},${coords.lng.toFixed(5)}` : ""}
        />
        <PlacePicker value={coords} onChange={setCoords} />
      </div>

      {coords && <LatLngToAddress lat={coords.lat} lng={coords.lng} />}

      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
};

export default LocationInput;

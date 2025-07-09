import React from "react";
import { useReverseGeocodeQuery } from "@/services/commonServices/mapsApi"; 

interface LatLngToAddressProps {
  lat: number;
  lng: number;
  className?:string
}

const LatLngToAddress: React.FC<LatLngToAddressProps> = ({ lat, lng ,className }) => {
  const { data, isLoading, isError } = useReverseGeocodeQuery({ lat, lng });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground mt-1">Loading address…</p>;
  }

  if (isError || !data || data.status !== "OK" || !data.results.length) {
    return <p className="text-sm text-muted-foreground mt-1">Unable to fetch address</p>;
  }

  return (
    <p className={`${className ? className : 'text-sm text-muted-foreground mt-1' }`}>
      {data.results[0].formatted_address}
    </p>
  );

};

export default LatLngToAddress;
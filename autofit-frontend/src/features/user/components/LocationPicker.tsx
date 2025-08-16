import LatLngToAddress from "@/components/shared/LocationInput/LatLngToAddress";
import PlacePicker from "@/components/shared/LocationInput/PlacePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import React from "react";

interface Props{
    coords: { lat: number; lng: number } | null;
    setCoord: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
}

const LocationPicker:React.FC<Props> = ({ coords, setCoord }) => {

  return (
    <>
      <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            Your Location
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <PlacePicker
                onChange={setCoord}
                value={coords}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              />
              {coords && (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  <LatLngToAddress lat={coords.lat} lng={coords.lng} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LocationPicker;

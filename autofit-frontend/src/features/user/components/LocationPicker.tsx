import LatLngToAddress from "@/components/shared/LocationInput/LatLngToAddress";
import PlacePicker from "@/components/shared/LocationInput/PlacePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import React from "react";

interface Props{
    coords: { lat: number; lng: number } | null;
    setCoord: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
}

const LocationPicker:React.FC<Props> = ({ coords, setCoord }) => {

  return (
    <>
      <Card className="bg-white shadow-sm border-0 rounded-lg mb-6 sm:mb-8 sm:mx-0">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            Your Location
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-4">
            <div className="pb-4 border-b">
              <PlacePicker
                onChange={setCoord}
                value={coords}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              />
            </div>
            
            {coords && (
              <div className="p-4 rounded-lg border-2 border-gray-100 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Selected Location</h4>
                    <LatLngToAddress 
                      lat={coords.lat} 
                      lng={coords.lng} 
                      className="text-xs text-gray-600 leading-relaxed"
                    />
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Lat: {coords.lat.toFixed(6)}</span>
                      <span>Lng: {coords.lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!coords && (
              <div className="text-center py-6">
                <Navigation className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No location selected</p>
                <p className="text-gray-400 text-xs mt-1">Choose your location to continue</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LocationPicker;
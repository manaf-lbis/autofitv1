// import React, { useState, useCallback, useEffect } from "react";
// import { APIProvider, Map, AdvancedMarker, MapMouseEvent } from "@vis.gl/react-google-maps";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { LocateFixed,  Navigation } from "lucide-react";
// import toast from "react-hot-toast";

// const containerStyle = { width: "100%", height: "400px" };
// const center = { lat: 20.5937, lng: 78.9629 };

// interface PlacePickerProps {
//   onChange: (coords: { lat: number; lng: number }) => void;
//   value: { lat: number; lng: number } | null;
//   className? :string
// }

// const PlacePicker: React.FC<PlacePickerProps> = ({ onChange, value ,className}) => {
//   const [open, setOpen] = useState(false);
//   const [hasPermissionBeenDenied, setHasPermissionBeenDenied] = useState(false);

//   const onMapClick = useCallback((event: MapMouseEvent) => {
//     const clickData = event.detail as { latLng: { lat: number; lng: number } | null; placeId: string | null };
//     if (clickData.latLng) {
//       const { lat, lng } = clickData.latLng;
//       onChange({ lat, lng });
//     }
//   }, [onChange]);

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by your browser.", {
//         id: "geolocation-unsupported",
//       });
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;
//         onChange({ lat, lng });
//         setHasPermissionBeenDenied(false);
//       },
//       () => {
//         if (!hasPermissionBeenDenied) {
//           toast.error("Permission denied or location unavailable.", {
//             id: "location-permission-denied",
//           });
//           setHasPermissionBeenDenied(true);
//         }
//       },{
//         enableHighAccuracy:true
//       }
//     );
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <div>
//           <Button className={`${className}`} type="button">
//             <Navigation className="w-4 h-4 mr-2" />
//             Choose Location
//           </Button>
//         </div>
    
//       </DialogTrigger>
//       <DialogContent className="max-w-3xl w-full p-0 rounded-2xl overflow-hidden">
//         <DialogHeader className="p-4 border-b">
//           <DialogTitle>Pick a Location</DialogTitle>
//         </DialogHeader>

//         <div className="h-[400px] w-full">
//           <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
//             <Map
//               style={containerStyle}
//               defaultCenter={value || center}
//               defaultZoom={value ? 15 : 5}
//               mapId={import.meta.env.VITE_MAP_ID}
//               onClick={onMapClick}
//               zoomControl={true}
//               fullscreenControl={true}
//               gestureHandling='greedy'
//             >
//               {value && <AdvancedMarker position={value} />}
//             </Map>
//           </APIProvider>
//         </div>

//         <DialogFooter className="p-4 border-t justify-end">
//           <Button variant="outline" size="sm" onClick={getCurrentLocation} className="gap-1 text-sm">
//             <LocateFixed className="h-4 w-4" />
//             Use My Location
//           </Button>
//           <Button className={`${className}`} onClick={() => setOpen(false)}>Done</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PlacePicker;





import React, { useState, useCallback, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, MapMouseEvent } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LocateFixed, Navigation, MapPin, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 20.5937, lng: 78.9629 };

interface PlacePickerProps {
  onChange: (coords: { lat: number; lng: number }) => void;
  value: { lat: number; lng: number } | null;
  className?: string;
}

const PlacePicker: React.FC<PlacePickerProps> = ({ onChange, value, className }) => {
  const [open, setOpen] = useState(false);
  const [hasPermissionBeenDenied, setHasPermissionBeenDenied] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onChange({ lat, lng });
        setHasPermissionBeenDenied(false);
        setIsGettingLocation(false);
      },
      () => {
        setIsGettingLocation(false);
        if (!hasPermissionBeenDenied) {
          toast.error("Permission denied or location unavailable.", {
            id: "location-permission-denied",
          });
          setHasPermissionBeenDenied(true);
        }
      },
      {
        enableHighAccuracy: true
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
            <span className="hidden sm:inline">Choose Location</span>
            <span className="sm:hidden">Location</span>
          </Button>
        </div>
      </DialogTrigger>
      
      <DialogContent className="w-[98vw] h-[95vh] max-w-none sm:max-w-6xl sm:h-[80vh] p-0 rounded-lg overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 sm:p-6 border-b bg-white flex-shrink-0 z-10">
            <DialogTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              Pick a Location
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-2 sm:hidden">Tap on the map to select location</p>
          </DialogHeader>

          <div className="flex-1 relative min-h-0">
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
              <div className="absolute inset-0">
                <Map
                  style={containerStyle}
                  defaultCenter={value || center}
                  defaultZoom={value ? 15 : 5}
                  mapId={import.meta.env.VITE_MAP_ID}
                  onClick={onMapClick}
                  zoomControl={true}
                  fullscreenControl={true}
                  gestureHandling="greedy"
                >
                  {value && <AdvancedMarker position={value} />}
                </Map>
              </div>
            </APIProvider>
          </div>

          <DialogFooter className="p-4 sm:p-6 border-t bg-white flex-shrink-0 z-10">
            <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-end">
              <Button 
                className={`w-full sm:w-auto text-lg py-4 sm:py-2 sm:text-base font-medium ${className}`} 
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
              
              <Button 
                variant="outline" 
                onClick={getCurrentLocation} 
                disabled={isGettingLocation}
                className="w-full sm:w-auto gap-2 text-lg py-4 sm:py-2 sm:text-base font-medium border-2"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <LocateFixed className="h-5 w-5" />
                    Use My Location
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlacePicker;
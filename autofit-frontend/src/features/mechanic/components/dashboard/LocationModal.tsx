import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { MapPin, Navigation } from "lucide-react";
import React from "react";


const LocationModal:React.FC = () => {
  return (
    <>
      <Dialog  >
        <DialogContent className="sm:max-w-lg rounded-lg mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-4 h-4 text-blue-600" />
              </div>
              Navigation to Location
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Interactive Map</p>
                <p className="text-gray-400 text-sm">
                  Location: {'location'}
                </p>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600 font-medium">
                  Destination:
                </p>
              </div>
              <p className="font-semibold text-gray-900">{'selectedLocation'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Navigation className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
              <Button variant="outline" className="flex-1">
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationModal;




// import React from "react";

// const LocationModal = () => {
//   return (
//     <>
//       <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
//         <DialogContent className="sm:max-w-lg rounded-lg mx-4">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <Navigation className="w-4 h-4 text-blue-600" />
//               </div>
//               Navigation to Location
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-6">
//             {/* Map Placeholder */}
//             <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
//               <div className="text-center">
//                 <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//                 <p className="text-gray-500 font-medium">Interactive Map</p>
//                 <p className="text-gray-400 text-sm">
//                   Location: {selectedLocation}
//                 </p>
//               </div>
//             </div>

//             {/* Location Details */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <div className="flex items-center gap-2 mb-2">
//                 <MapPin className="w-4 h-4 text-gray-600" />
//                 <p className="text-sm text-gray-600 font-medium">
//                   Destination:
//                 </p>
//               </div>
//               <p className="font-semibold text-gray-900">{selectedLocation}</p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
//                 <Navigation className="w-4 h-4 mr-2" />
//                 Open in Google Maps
//               </Button>
//               <Button variant="outline" className="flex-1">
//                 <MapPin className="w-4 h-4 mr-2" />
//                 Get Directions
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default LocationModal;

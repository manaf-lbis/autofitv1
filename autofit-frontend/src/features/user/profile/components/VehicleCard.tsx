import React, { useState } from "react";
import { Car, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import VehicleModal from "./VehicleModal";


export interface Vehicle {
  id: number;
  registration: string;
  owner: string;
  model: string;
  image: string;
}

const VehicleCard: React.FC = () => {
  const vehicles: Vehicle[] = [
    {
      id: 1,
      registration: "KL 00 AA 000",
      owner: "Owner Name",
      model: "Vehicle Model",
      image: "https://via.placeholder.com/100x60",
    },
    {
      id: 2,
      registration: "KL 00 BB 111",
      owner: "Another Owner",
      model: "Another Model",
      image: "https://via.placeholder.com/100x60",
    },
  ];

  const  [isOpen,setIsOpen] = useState(false)
  const [vehicle,setVehicle] = useState<Vehicle | null>(null)

  const handleOpenModal = (vehicle: Vehicle | null = null) => {
    setVehicle(null); 
  
    setTimeout(() => {
      if (vehicle) {
        setVehicle(vehicle);
      }
      setIsOpen(true); 
    }, 0); 
  };

  return (
    <Card className="w-full bg-white shadow-sm rounded-lg border border-gray-200 mt-4 mb-36 md:mb-20">
      <CardHeader className="bg-gray-100 p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-gray-800">
            <Car className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-2xl font-semibold">My Vehicle</CardTitle>
          </div>

          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0"
            onClick={()=>setIsOpen(true)}
          >
            Add new Vehicle
          </Button>

        </div>
      </CardHeader>

      <CardContent className="p-8">
        <ScrollArea className="h-48 rounded-md border border-gray-200">
          {vehicles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No vehicles added yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.model} image`}
                    className="w-24 h-14 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold text-lg">{vehicle.registration}</p>
                    <p className="text-gray-600 text-sm">{vehicle.owner}</p>
                    <p className="text-gray-600 text-sm">{vehicle.model}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleOpenModal(vehicle)}
                    >
                      <Pencil size={18} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleOpenModal(vehicle)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <VehicleModal isOpen={isOpen} setIsOpen={setIsOpen} vehicle={vehicle} />
    </Card>
  );
};

export default VehicleCard;





// import React from "react";
// import { Car, Pencil, Trash2 } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";


// interface Vehicle {
//   id: number;
//   registration: string;
//   owner: string;
//   model: string;
//   image: string;
// }

// const VehicleCard: React.FC = () => {
//   const vehicles: Vehicle[] = [
//     {
//       id: 1,
//       registration: "KL 00 AA 000",
//       owner: "Owner Name",
//       model: "Vehicle Model",
//       image: "https://via.placeholder.com/100x60",
//     },
//     {
//       id: 2,
//       registration: "KL 00 BB 111",
//       owner: "Another Owner",
//       model: "Another Model",
//       image: "https://via.placeholder.com/100x60",
//     },
//   ];

//   return (
//     <Card className="w-full bg-white shadow-sm rounded-lg border border-gray-200 mt-4 mb-36 md:mb-20">
//       <CardHeader className="bg-gray-100 p-6 border-b border-gray-200">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-3 text-gray-800">
//             <Car className="w-6 h-6 text-blue-500" />
//             <CardTitle className="text-2xl font-semibold">My Vehicle</CardTitle>
//           </div>
//           <Button
//             variant="link"
//             className="text-blue-600 hover:text-blue-800 text-sm font-medium p-0"
//             onClick={() => alert("Add new vehicle clicked!")}
//           >
//             Add new Vehicle
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent className="p-8">
//         <ScrollArea className="h-48 rounded-md border border-gray-200">
//           {vehicles.length === 0 ? (
//             <p className="text-gray-500 text-center py-4">No vehicles added yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               {vehicles.map((vehicle) => (
//                 <div
//                   key={vehicle.id}
//                   className="bg-white p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors duration-200 flex items-center"
//                 >
//                   <img
//                     src={vehicle.image}
//                     alt={`${vehicle.model} image`}
//                     className="w-24 h-14 object-cover rounded mr-4"
//                   />
//                   <div className="flex-1">
//                     <p className="text-gray-800 font-semibold text-lg">{vehicle.registration}</p>
//                     <p className="text-gray-600 text-sm">{vehicle.owner}</p>
//                     <p className="text-gray-600 text-sm">{vehicle.model}</p>
//                   </div>
//                   <div className="flex flex-col items-end gap-2">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="text-blue-600 hover:text-blue-800"
//                       onClick={() => alert(`Edit vehicle ${vehicle.id}`)}
//                     >
//                       <Pencil size={18} />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="text-red-600 hover:text-red-800"
//                       onClick={() => alert(`Delete vehicle ${vehicle.id}`)}
//                     >
//                       <Trash2 size={18} />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// };

// export default VehicleCard;
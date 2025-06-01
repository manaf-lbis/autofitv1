import React, { useState } from "react";
import { Car, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import VehicleModal from "./modal/VehicleModal";
import { useDeleteVehicleMutation, useGetMyVehiclesQuery } from "../../api/vehicleApi";
import { Vehicle } from "@/types/vehicle";
import ConfirmationAlert from "@/components/shared/ConfirmationAlert";
import { motion } from "framer-motion";
import { Plus,Loader } from "lucide-react";


const VehicleCard: React.FC = () => {
  const { data: response, refetch ,isLoading:loading} = useGetMyVehiclesQuery({});
  const [deleteVehicle,{isLoading}] = useDeleteVehicleMutation();

  const vehicles: Vehicle[] = response?.data ?? [];
  const [isOpen, setIsOpen] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const handleOpenModal = (selectedVehicle: Vehicle | null = null) => {
    setVehicle(selectedVehicle);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteVehicle(id);
    refetch();
  };

  return (
    <Card className="w-full bg-white shadow-sm rounded-lg border border-gray-100 mt-4 mb-36 md:mb-20">
      <CardHeader className="bg-gray-50 p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Car className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle className="text-xl font-medium text-gray-800">My Vehicles</CardTitle>
          </div>

           <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenModal()}
              >
                <Plus size={16} />
                Add New Vehicle
            </motion.button>
        </div>
      </CardHeader>

      { loading ?
        ( <div className="h-64 flex items-center justify-center">
            <Loader className="animate-spin text-blue-700"/>
          </div>
        ) :
        ( <CardContent className="p-4 sm:p-6">
          <ScrollArea className="h-64 rounded-md">
            {vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Car className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-600 font-medium mb-2">No vehicles added yet.</p>
                <p className="text-gray-400 text-sm text-center max-w-md mb-4">
                  Add your vehicles to get personalized service
                </p>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => handleOpenModal()}
                >
                  Add Your First Vehicle
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-2">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all flex items-center group"
                  >
                    <div className="bg-gray-50 p-2 rounded-lg mr-4">
                      <img
                        src="https://png.pngtree.com/png-vector/20220711/ourmid/pngtree-automotive-car-logo-png-image_5837187.png"
                        alt={`${vehicle.modelName} image`}
                        className="w-20 h-12 object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-semibold">{vehicle.regNo}</p>
                      <p className="text-gray-500 text-sm">{vehicle.owner}</p>
                      <p className="text-gray-500 text-sm">{`${vehicle.brand} - ${vehicle.modelName}`}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 opacity-80 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                        onClick={() => handleOpenModal(vehicle)}
                      >
                        <Pencil size={16} />
                      </Button>

                      <ConfirmationAlert
                        description={`Are you sure you want to delete vehicle ${vehicle.regNo}?`}
                        onConfirm={() => handleDelete(vehicle._id)}
                        isLoading={isLoading}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                        { isLoading ? <Loader size={16} className="animate-spin" /> :  <Trash2 size={16} /> }
                        </Button>
                      </ConfirmationAlert>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>)
      }

      <VehicleModal isOpen={isOpen} setIsOpen={setIsOpen} vehicle={vehicle} refetchVehicles={refetch} />
    </Card>
  );
};

export default VehicleCard;
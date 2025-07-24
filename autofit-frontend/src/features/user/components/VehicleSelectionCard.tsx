import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetMyVehiclesQuery } from '@/services/userServices/vehicleApi'
import { Car, CheckCircle, Plus } from 'lucide-react'
import React, { useState } from 'react'
import VehicleModal from './profile/modal/VehicleModal'

interface Props {
  selectedVehicle: string;
  setSelectedVehicle: React.Dispatch<React.SetStateAction<string>>
}

const VehicleSelectionCard:React.FC<Props> = ({selectedVehicle, setSelectedVehicle}) => {
    const [isOpen, setIsOpen] = useState(false)
    const { data: vehicleData } = useGetMyVehiclesQuery({});

  return (
    <>
            <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-purple-600" />
                  </div>
                  Select Your Vehicle
                </div>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Plus size={16} />
                  Add New Vehicle
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="max-h-80 overflow-y-auto space-y-4">
                {vehicleData &&
                  vehicleData.data.map((vehicle: any) => (
                    <div
                      key={vehicle._id}
                      onClick={() => setSelectedVehicle(vehicle._id)}
                      className={`bg-gray-50 p-6 rounded-lg border-2 transition-all cursor-pointer relative ${
                        selectedVehicle === vehicle._id
                          ? "border-blue-600 bg-blue-50"
                          : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      {selectedVehicle === vehicle._id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {vehicle.brand} {vehicle.modelName}
                          </h3>
                          <div className="space-y-1">
                            <p className="text-gray-600">
                              <span className="font-medium">Registration:</span>{" "}
                              {vehicle.regNo}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Owner:</span>{" "}
                              {vehicle.owner}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border">
                            {vehicle.fuelType}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

           <VehicleModal  isOpen={isOpen}  setIsOpen={setIsOpen} vehicle={null} />

           </>
  )
}

export default VehicleSelectionCard
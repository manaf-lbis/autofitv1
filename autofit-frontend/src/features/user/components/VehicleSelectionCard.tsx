import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGetMyVehiclesQuery } from '@/services/userServices/vehicleApi'
import { Car, Plus, Loader2, User, Hash } from 'lucide-react'
import React, { useState, Component } from 'react'
import VehicleModal from './profile/modal/VehicleModal'

interface Props {
  selectedVehicle: string;
  setSelectedVehicle: React.Dispatch<React.SetStateAction<string>>
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  render() {
    if (this.state.hasError) {
      return <p className="text-red-600 text-sm p-4 text-center">Something went wrong. Please try again.</p>;
    }
    return this.props.children;
  }
}

const VehicleSelectionCard: React.FC<Props> = ({ selectedVehicle, setSelectedVehicle }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: vehicleData, isLoading, error } = useGetMyVehiclesQuery({});

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  return (
    <ErrorBoundary>
      <Card className="bg-white shadow-sm border-0 rounded-lg mb-6 sm:mb-8 sm:mx-0">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              Select Your Vehicle
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
              onClick={() => setIsOpen(true)}
            >
              <Plus size={16} className="mr-2" />
              <span className="hidden sm:inline">Add New Vehicle</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-3 mt-4 max-h-80 overflow-y-auto">
            {isLoading && (
              <div className="text-center py-6">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600 text-sm">Loading vehicles...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <p className="text-red-600 text-sm">Failed to load vehicles. Try again.</p>
              </div>
            )}

            {!isLoading && !error && (!vehicleData?.data || vehicleData.data.length === 0) && (
              <div className="text-center py-6">
                <Car className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No vehicles found</p>
                <p className="text-gray-400 text-xs mt-1">Add your first vehicle to get started</p>
              </div>
            )}

            {vehicleData?.data?.map((vehicle: any) => (
              <div
                key={vehicle._id}
                onClick={() => handleVehicleSelect(vehicle._id)}
                className={`p-5 sm:p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedVehicle === vehicle._id
                    ? "border-blue-400 bg-blue-50/50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {vehicle.brand} {vehicle.modelName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-white text-gray-700 text-xs px-2 py-0.5 h-auto border">
                            {vehicle.fuelType}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Hash className="w-3 h-3" />
                          <span className="text-xs font-medium">{vehicle.regNo}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <User className="w-3 h-3" />
                          <span className="text-xs font-medium">{vehicle.owner}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <VehicleModal isOpen={isOpen} setIsOpen={setIsOpen} vehicle={null} />
    </ErrorBoundary>
  )
}

export default VehicleSelectionCard
import {  useState } from "react"
import {CheckCircle,Loader2,Shield,ArrowLeft} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"
import {  useCreateBookingMutation, useGetPlanForBookingQuery } from "@/services/userServices/pretripUserApi"
import { useNavigate, useParams } from "react-router-dom"
import VehicleSelectionCard from "../../components/VehicleSelectionCard"
import LocationPicker from "../../components/LocationPicker"
import SlotBooking from "../../components/pretrip/SlotBooking"
import toast from "react-hot-toast"
import { ServiceType } from "@/types/user"



export default function PretripCheckupBooking() {
  const [selectedMechanic, setSelectedMechanic] = useState<string>("")
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const params = useParams();
  const navigate = useNavigate()

  const { data: selectedPlan } = useGetPlanForBookingQuery(params.id);
  const [createBooking,isLoading] = useCreateBookingMutation()



  const handleBooking = async () => {
    try {
        if(coords){
          const response = await createBooking({
            mechanicId:selectedMechanic,
            vehicleId:selectedVehicle,
            slotId:selectedSlot,
            coords,
            planId:params.id!
          }).unwrap()

          navigate(`/user/${ServiceType.PRETRIP}/checkout/${response.data.bookingId}`)

        }else{
          toast.error("Please select a location")
        }
     } catch (error:any) {
      toast.error(error?.message || 'Invalid Booking')
    }
  }



  const handleGoBack = () => {
    window.history.back()
  }

  const isBookingEnabled = selectedMechanic && selectedVehicle && selectedSlot && coords 


  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Go Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm border mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Professional Pre-Trip Inspection Available</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pre-Trip <span className="text-gray-900">Vehicle Checkup</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Ensure your vehicle is road-ready with our comprehensive pre-trip inspection. Professional mechanics,
            detailed reports, and peace of mind for your journey.
          </p>
        </div>

        {/* Selected Plan Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Plan Info */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-sm border-0 rounded-lg h-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPlan && selectedPlan.name}</h3>
                    <p className="text-gray-600 text-sm">Complete vehicle inspection with detailed digital report</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Inspection Includes:</h4>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {selectedPlan && selectedPlan.features.length} services
                    </span>
                  </div>

                  {/* Features Grid - Responsive based on number of features */}
                  <div
                    className={`grid gap-3 ${selectedPlan && selectedPlan.features.length <= 8
                        ? "grid-cols-1 md:grid-cols-2"
                        : selectedPlan && selectedPlan.features.length <= 16
                          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      } ${selectedPlan && selectedPlan.features.length > 12 ? "max-h-80 overflow-y-auto pr-2" : ""}`}
                  >
                    {selectedPlan && selectedPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {selectedPlan && selectedPlan.features.length > 12 && (
                    <p className="text-xs text-gray-500 italic">
                      Scroll to see all {selectedPlan && selectedPlan.features.length} services included
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <Card className="bg-white shadow-sm border-0 rounded-lg">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">₹{selectedPlan && selectedPlan.price}</div>
                    <div className="text-gray-500 line-through text-lg">₹{selectedPlan && selectedPlan.originalPrice}</div>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block mt-2">
                      Save ₹{selectedPlan?.originalPrice && selectedPlan?.originalPrice - selectedPlan.price || 0}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">2 Hours</div>
                    <div className="text-sm text-gray-600">Inspection Duration</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-sm border-0 rounded-md">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">2 Hours</div>
              <div className="text-sm text-gray-600">Average Duration</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0 rounded-md">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Check Points</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0 rounded-md">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">★4.9</div>
              <div className="text-sm text-gray-600">Service Rating</div>
            </CardContent>
          </Card>
        </div>

        <LocationPicker coords={coords} setCoord={setCoords} />

        {/* Available Service Centers */}
        {coords && (
          <SlotBooking
          selectedMechanic={selectedMechanic}
          selectedSlot={selectedSlot}
          setSelectedMechanic={setSelectedMechanic}
          setSelectedSlot={setSelectedSlot}
          coords={coords}
           />
        )}



        <VehicleSelectionCard selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} />

        {/* Book Service Button */}
        <div className="text-center">
          <Button
            onClick={handleBooking}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-md shadow-sm"
            disabled={!isBookingEnabled || !isLoading}
          >
            {!isLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Book Pre-Trip Checkup - ₹{selectedPlan && selectedPlan.price}
              </>
            )}
          </Button>
        </div>
        {isBookingEnabled && (
          <div className="text-center mt-3">
            <p className="text-sm text-gray-600">Your appointment will be confirmed within 5 minutes</p>
          </div>
        )}
      </div>
    </div>
  )
}

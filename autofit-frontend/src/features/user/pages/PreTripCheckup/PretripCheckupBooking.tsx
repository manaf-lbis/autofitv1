import { useState } from "react"
import { CheckCircle, Loader2, Shield, ArrowLeft, Clock, Star} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"
import { useCreateBookingMutation, useGetPlanForBookingQuery } from "@/services/userServices/pretripUserApi"
import { useNavigate, useParams } from "react-router-dom"
import VehicleSelectionCard from "../../components/VehicleSelectionCard"
import LocationPicker from "../../components/LocationPicker"
import SlotBooking from "../../components/pretrip/SlotBooking"
import toast from "react-hot-toast"
import { ServiceType } from "@/types/user"

export default function PretripCheckupBooking() {
  const [selectedMechanic, setSelectedMechanic] = useState<string>("")
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const params = useParams();
  const navigate = useNavigate()

  const { data: selectedPlan } = useGetPlanForBookingQuery(params.id);
  const [createBooking, { isLoading }] = useCreateBookingMutation()

  const handleBooking = async () => {
    try {
      if (coords) {
        const response = await createBooking({
          coords,
          mechanicId: selectedMechanic,
          planId: params.id!,
          slot: {
            date: selectedDate,
            time: selectedSlot,
          },
          vehicleId: selectedVehicle,
        }).unwrap()

        navigate(`/user/${ServiceType.PRETRIP}/checkout/${response.data.bookingId}`)
      } else {
        toast.error("Please select a location")
      }
    } catch (error: any) {
      toast.error(error?.data?.message ?? 'Invalid Booking')
    }
  }

  const handleGoBack = () => {
    window.history.back()
  }

  const isBookingEnabled = selectedMechanic && selectedVehicle && selectedSlot && coords

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className=" border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-start mb-8">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 border-slate-300 hover:border-slate-400 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <div className="inline-flex items-center gap-1.5 sm:gap-2  px-3 sm:px-4 py-2 rounded-full shadow-sm border mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                Professional Pre-Trip Inspection Available
              </span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
              Pre-Trip <span className="text-blue-600 block xs:inline">Vehicle Inspection</span>
            </h1>
            <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
              Professional vehicle checkup to ensure your journey is safe and worry-free. 
              Get detailed inspection reports from certified mechanics.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Plan Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Plan Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-sm border-slate-200 rounded-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                      {selectedPlan?.name || "Professional Inspection"}
                    </h2>
                    <p className="text-slate-600">
                      Comprehensive vehicle assessment with detailed digital report and safety recommendations
                    </p>
                  </div>
                </div>

                {/* Features Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-semibold text-slate-900">What's Included</h3>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                      {selectedPlan?.features?.length || 0} checks
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto pr-2">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      {selectedPlan?.features?.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing & Stats Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="bg-white shadow-sm border-slate-200 rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-slate-900">
                      ₹{selectedPlan?.price || 0}
                    </div>
                    {selectedPlan?.originalPrice && selectedPlan.originalPrice > selectedPlan.price && (
                      <>
                        <div className="text-slate-500 line-through text-lg">
                          ₹{selectedPlan.originalPrice}
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-medium inline-block">
                          Save ₹{selectedPlan.originalPrice - selectedPlan.price}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {selectedPlan ? Math.floor(selectedPlan.duration / 60) : 0} hour
                        {selectedPlan && Math.floor(selectedPlan.duration / 60) !== 1 ? 's' : ''} duration
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-white shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {selectedPlan?.features?.length ? selectedPlan.features.length - 1 : 0}+
                  </div>
                  <div className="text-sm text-slate-600">Check Points</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border-slate-200 rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-amber-500 mb-1">
                    <Star className="w-5 h-5 fill-current" />
                    4.9
                  </div>
                  <div className="text-sm text-slate-600">Service Rating</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Booking Steps */}
        <div className="space-y-8">
          {/* Location */}
          <LocationPicker coords={coords} setCoord={setCoords} />

          {/* Schedule */}
          {coords && (
            <SlotBooking
              setSelectedSlot={setSelectedSlot}
              coords={coords}
              durationMinutes={selectedPlan?.duration || 0}
              selectedMechanic={selectedMechanic}
              setSelectedMechanic={setSelectedMechanic}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          )}

          {/* Vehicle */}
          <VehicleSelectionCard 
            selectedVehicle={selectedVehicle} 
            setSelectedVehicle={setSelectedVehicle} 
          />
        </div>

        {/* Booking Button */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <Button
              onClick={handleBooking}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isBookingEnabled || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-3" />
                  Book Inspection - ₹{selectedPlan?.price || 0}
                </>
              )}
            </Button>
            
            {isBookingEnabled && !isLoading && (
              <p className="text-slate-600 text-sm mt-4">
                ✓ Instant confirmation • ✓ Professional mechanics • ✓ Detailed report
              </p>
            )}
            
            {!isBookingEnabled && (
              <p className="text-slate-500 text-sm mt-4">
                Please complete all steps above to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
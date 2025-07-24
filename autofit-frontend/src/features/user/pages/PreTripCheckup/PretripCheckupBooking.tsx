// import {  useEffect, useState } from "react"
// import {
//   MapPin,
//   Calendar,
//   Clock,
//   CheckCircle,
//   Loader2,
//   Shield,
//   Wrench,
//   Star,
//   ArrowLeft,
//   AlertCircle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useGetNearbyMechanicShopsQuery, useGetPlanForBookingQuery } from "@/services/userServices/pretripUserApi"
// import { useParams } from "react-router-dom"
// import VehicleSelectionCard from "../../components/VehicleSelectionCard"
// import LocationPicker from "../../components/LocationPicker"



// const mockMechanics = [
//   {
//     id: "1",
//     name: "AutoCare Service Center",
//     rating: 4.8,
//     distance: "2.3 km",
//     experience: "8+ years",
//     specialization: "Pre-trip Inspection",
//     hasSlots: true,
//   },
//   {
//     id: "2",
//     name: "QuickFix Garage",
//     rating: 4.6,
//     distance: "3.1 km",
//     experience: "5+ years",
//     specialization: "Vehicle Diagnostics",
//     hasSlots: false,
//   },
//   {
//     id: "3",
//     name: "Express Auto Service",
//     rating: 4.5,
//     distance: "4.2 km",
//     experience: "6+ years",
//     specialization: "Quick Inspection",
//     hasSlots: false,
//   },
// ]


// const mockSlots = [
//   {
//     _id: "6881d5bcedba665e64d7f857",
//     status: "available",
//     mechanicId: "1",
//     date: "2025-07-30T02:30:00.000Z",
//   },
//   {
//     _id: "6881d5bcedba665e64d7f85a",
//     status: "available",
//     mechanicId: "1",
//     date: "2025-07-30T12:30:00.000Z",
//   },
//   {
//     _id: "6881d5bcedba665e64d7f859",
//     status: "available",
//     mechanicId: "1",
//     date: "2025-07-30T10:30:00.000Z",
//   },
//   {
//     _id: "6881d5d0edba665e64d7f862",
//     status: "available",
//     mechanicId: "1",
//     date: "2025-07-28T06:30:00.000Z",
//   },
//   {
//     _id: "6881d5fbedba665e64d7f870",
//     status: "available",
//     mechanicId: "1",
//     date: "2025-07-26T02:30:00.000Z",
//   },
// ]

// const groupSlotsByDate = (slots:any, selectedMechanic:any) => {
//   return slots
//     .filter((slot:any) => slot.mechanicId === selectedMechanic && slot.status === "available")
//     .reduce((groups :any, slot:any) => {
//       const date = slot.date.split("T")[0]
//       if (!groups[date]) {
//         groups[date] = []
//       }
//       groups[date].push(slot)
//       return groups
//     }, {})
// }


// const formatTime = (dateString:any) => {
//   const date = new Date(dateString)
//   return date.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   })
// }

// export default function PretripCheckupBooking() {
//   const [selectedMechanic, setSelectedMechanic] = useState<string>("")
//   const [selectedVehicle, setSelectedVehicle] = useState<string>("")
//   const [selectedSlot, setSelectedSlot] = useState<string>("")
//   const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const params = useParams();

//   const {data:selectedPlan} = useGetPlanForBookingQuery(params.id)


//   // Generate next 7 days
//   const getNext7Days = () => {
//     const days = []
//     const today = new Date()

//     for (let i = 0; i < 7; i++) {
//       const date = new Date(today)
//       date.setDate(today.getDate() + i)
//       days.push({
//         date: date.toISOString().split("T")[0],
//         day: date.toLocaleDateString("en-US", { weekday: "short" }),
//         dayNum: date.getDate(),
//         month: date.toLocaleDateString("en-US", { month: "short" }),
//       })
//     }
//     return days
//   }

//   const next7Days = getNext7Days()

//   const handleBooking = async () => {
//     setIsLoading(true)
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false)
//       // Handle booking logic here
//       console.log("Booking confirmed!")
//     }, 2000)
//   }

//   const { data, refetch } = useGetNearbyMechanicShopsQuery(coords as { lat: number; lng: number } | undefined, {
//     skip: !coords, // Skip when coords is null
//   });
//   console.log("Data:", data);

//   // Refetch when coords changes
//   useEffect(() => {
//     if (coords) refetch();
//   }, [coords, refetch]);




//   const handleGoBack = () => {
//     window.history.back()
//   }

//   const isBookingEnabled = selectedMechanic && selectedVehicle && selectedSlot && coords && selectedDate

//   const mechanicsWithSlots = mockMechanics.filter((mechanic) => mechanic.hasSlots)
//   const hasAnySlots = mechanicsWithSlots.length > 0

//   return (
//     <div className="min-h-screen bg-gray-50 mt-10">
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Go Back Button */}
//         <div className="mb-6">
//           <Button
//             onClick={handleGoBack}
//             variant="outline"
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-transparent"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Go Back
//           </Button>
//         </div>

//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm border mb-6">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span className="text-sm font-medium text-gray-700">Professional Pre-Trip Inspection Available</span>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Pre-Trip <span className="text-gray-900">Vehicle Checkup</span>
//           </h1>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
//             Ensure your vehicle is road-ready with our comprehensive pre-trip inspection. Professional mechanics,
//             detailed reports, and peace of mind for your journey.
//           </p>
//         </div>

//         {/* Selected Plan Details */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
//           {/* Plan Info */}
//           <div className="lg:col-span-3">
//             <Card className="bg-white shadow-sm border-0 rounded-lg h-full">
//               <CardContent className="p-6">
//                 <div className="flex items-start gap-4 mb-6">
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <Shield className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedPlan && selectedPlan.name}</h3>
//                     <p className="text-gray-600 text-sm">Complete vehicle inspection with detailed digital report</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-medium text-gray-900">Inspection Includes:</h4>
//                     <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
//                       {selectedPlan && selectedPlan.features.length} services
//                     </span>
//                   </div>

//                   {/* Features Grid - Responsive based on number of features */}
//                   <div
//                     className={`grid gap-3 ${
//                       selectedPlan && selectedPlan.features.length <= 8
//                         ? "grid-cols-1 md:grid-cols-2"
//                         : selectedPlan && selectedPlan.features.length <= 16
//                           ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
//                           : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
//                     } ${selectedPlan && selectedPlan.features.length > 12 ? "max-h-80 overflow-y-auto pr-2" : ""}`}
//                   >
//                     {selectedPlan && selectedPlan.features.map((feature, index) => (
//                       <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                         <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
//                         <span className="text-sm font-medium text-gray-700">{feature}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {selectedPlan && selectedPlan.features.length > 12 && (
//                     <p className="text-xs text-gray-500 italic">
//                       Scroll to see all {selectedPlan && selectedPlan.features.length} services included
//                     </p>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Pricing & Duration */}
//           <div className="space-y-4">
//             <Card className="bg-white shadow-sm border-0 rounded-lg">
//               <CardContent className="p-6">
//                 <div className="text-center space-y-4">
//                   <div>
//                     <div className="text-3xl font-bold text-gray-900 mb-1">₹{selectedPlan && selectedPlan.price}</div>
//                     <div className="text-gray-500 line-through text-lg">₹{selectedPlan && selectedPlan.originalPrice}</div>
//                     <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block mt-2">
//                       Save ₹{selectedPlan?.originalPrice && selectedPlan?.originalPrice - selectedPlan.price || 0}
//                     </div>
//                   </div>
//                   <div className="border-t pt-4">
//                     <div className="text-2xl font-bold text-gray-900 mb-1">2 Hours</div>
//                     <div className="text-sm text-gray-600">Inspection Duration</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           <Card className="bg-white shadow-sm border-0 rounded-md">
//             <CardContent className="p-6 text-center">
//               <div className="text-3xl font-bold text-gray-900 mb-2">2 Hours</div>
//               <div className="text-sm text-gray-600">Average Duration</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white shadow-sm border-0 rounded-md">
//             <CardContent className="p-6 text-center">
//               <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
//               <div className="text-sm text-gray-600">Check Points</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white shadow-sm border-0 rounded-md">
//             <CardContent className="p-6 text-center">
//               <div className="text-3xl font-bold text-yellow-500 mb-2">★4.9</div>
//               <div className="text-sm text-gray-600">Service Rating</div>
//             </CardContent>
//           </Card>
//         </div>

//         <LocationPicker coords={coords} setCoord={setCoords} />

//         {/* Available Service Centers */}
//         {coords && (
//           <Card className="bg-white shadow-sm border-0 rounded-md mb-8">
//             <CardHeader className="pb-4">
//               <CardTitle className="flex items-center justify-between">
//                 <div className="flex items-center gap-3 text-xl">
//                   <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
//                     <Wrench className="w-5 h-5 text-green-600" />
//                   </div>
//                   Available Service Centers
//                 </div>
//                 {hasAnySlots && (
//                   <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
//                     {mechanicsWithSlots.length} centers available
//                   </span>
//                 )}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {!hasAnySlots ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <AlertCircle className="w-8 h-8 text-red-500" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No Slots Available</h3>
//                   <p className="text-gray-600 mb-4">
//                     Unfortunately, no service centers have available slots at this location right now.
//                   </p>
//                   <div className="space-y-2 text-sm text-gray-500">
//                     <p>• Try selecting a different location</p>
//                     <p>• Check back later for new availability</p>
//                     <p>• Contact us for urgent assistance</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {mockMechanics.map((mechanic) => (
//                     <div
//                       key={mechanic.id}
//                       onClick={() => mechanic.hasSlots && setSelectedMechanic(mechanic.id)}
//                       className={`p-6 rounded-lg border-2 transition-all relative ${
//                         !mechanic.hasSlots
//                           ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
//                           : selectedMechanic === mechanic.id
//                             ? "border-blue-600 bg-blue-50 shadow-md cursor-pointer"
//                             : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm cursor-pointer"
//                       }`}
//                     >
//                       {selectedMechanic === mechanic.id && mechanic.hasSlots && (
//                         <div className="absolute top-4 right-4">
//                           <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
//                             <CheckCircle className="w-4 h-4 text-white" />
//                           </div>
//                         </div>
//                       )}

//                       {!mechanic.hasSlots && (
//                         <div className="absolute top-4 right-4">
//                           <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">No Slots</div>
//                         </div>
//                       )}

//                       <div className="space-y-3">
//                         <div>
//                           <h3
//                             className={`font-bold text-lg mb-2 ${mechanic.hasSlots ? "text-gray-900" : "text-gray-500"}`}
//                           >
//                             {mechanic.name}
//                           </h3>
//                           <p className={`font-medium text-sm ${mechanic.hasSlots ? "text-blue-600" : "text-gray-400"}`}>
//                             {mechanic.specialization}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`flex items-center gap-1 px-2 py-1 rounded ${
//                               mechanic.hasSlots ? "bg-yellow-50" : "bg-gray-100"
//                             }`}
//                           >
//                             <Star
//                               className={`w-4 h-4 ${
//                                 mechanic.hasSlots ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
//                               }`}
//                             />
//                             <span
//                               className={`text-sm font-medium ${mechanic.hasSlots ? "text-gray-900" : "text-gray-400"}`}
//                             >
//                               {mechanic.rating}
//                             </span>
//                           </div>
//                           <div
//                             className={`flex items-center gap-1 px-2 py-1 rounded ${
//                               mechanic.hasSlots ? "bg-gray-50" : "bg-gray-100"
//                             }`}
//                           >
//                             <MapPin className={`w-4 h-4 ${mechanic.hasSlots ? "text-gray-500" : "text-gray-300"}`} />
//                             <span
//                               className={`text-sm font-medium ${mechanic.hasSlots ? "text-gray-900" : "text-gray-400"}`}
//                             >
//                               {mechanic.distance}
//                             </span>
//                           </div>
//                           <div
//                             className={`px-2 py-1 rounded text-sm font-medium ${
//                               mechanic.hasSlots ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-400"
//                             }`}
//                           >
//                             {mechanic.experience}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* Date & Time Selection */}
//         {selectedMechanic && (
//           <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
//             <CardHeader className="pb-4">
//               <CardTitle className="flex items-center gap-3 text-xl">
//                 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <Calendar className="w-5 h-5 text-purple-600" />
//                 </div>
//                 Select Date & Time
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {Object.keys(groupSlotsByDate(mockSlots, selectedMechanic)).length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Calendar className="w-8 h-8 text-red-500" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No Time Slots Available</h3>
//                   <p className="text-gray-600 mb-4">
//                     This service center doesn't have any available time slots at the moment.
//                   </p>
//                   <div className="space-y-2 text-sm text-gray-500">
//                     <p>• Try selecting a different service center</p>
//                     <p>• Check back later for new slots</p>
//                     <p>• Contact the service center directly</p>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   {/* Date Selection */}
//                   <div className="space-y-3">
//                     <h4 className="text-base font-medium text-gray-900">Choose Date</h4>
//                     <div className="grid grid-cols-7 gap-2">
//                       {(() => {
//                         const availableDates = [
//                           ...new Set(
//                             mockSlots
//                               .filter((slot) => slot.mechanicId === selectedMechanic && slot.status === "available")
//                               .map((slot) => slot.date.split("T")[0]),
//                           ),
//                         ]

//                         return next7Days.map((day) => {
//                           const hasSlots = availableDates.includes(day.date)
//                           return (
//                             <div
//                               key={day.date}
//                               onClick={() => hasSlots && setSelectedDate(day.date)}
//                               className={`p-3 rounded-lg border-2 text-center transition-all ${
//                                 !hasSlots
//                                   ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
//                                   : selectedDate === day.date
//                                     ? "border-blue-600 bg-blue-50 cursor-pointer"
//                                     : "border-gray-200 hover:border-blue-300 bg-white cursor-pointer"
//                               }`}
//                             >
//                               <div className="text-xs text-gray-600 mb-1">{day.day}</div>
//                               <div className={`font-semibold ${hasSlots ? "text-gray-900" : "text-gray-400"}`}>
//                                 {day.dayNum}
//                               </div>
//                               <div className="text-xs text-gray-600">{day.month}</div>
//                               {hasSlots && (
//                                 <div className="text-xs text-blue-600 mt-1">
//                                   {
//                                     mockSlots.filter(
//                                       (slot) =>
//                                         slot.mechanicId === selectedMechanic &&
//                                         slot.date.split("T")[0] === day.date &&
//                                         slot.status === "available",
//                                     ).length
//                                   }{" "}
//                                   slots
//                                 </div>
//                               )}
//                             </div>
//                           )
//                         })
//                       })()}
//                     </div>
//                   </div>

//                   {/* Time Selection */}
//                   {selectedDate && (
//                     <div className="space-y-3">
//                       <h4 className="text-base font-medium text-gray-900">Available Time Slots</h4>
//                       {(() => {
//                         const daySlots = mockSlots.filter(
//                           (slot) =>
//                             slot.mechanicId === selectedMechanic &&
//                             slot.date.split("T")[0] === selectedDate &&
//                             slot.status === "available",
//                         )

//                         if (daySlots.length === 0) {
//                           return (
//                             <div className="text-center py-8">
//                               <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                               <p className="text-gray-500">No slots available for this date</p>
//                             </div>
//                           )
//                         }

//                         return (
//                           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
//                             {daySlots.map((slot) => (
//                               <div
//                                 key={slot._id}
//                                 onClick={() => setSelectedSlot(slot._id)}
//                                 className={`p-4 rounded-lg border-2 cursor-pointer text-center transition-all hover:shadow-sm ${
//                                   selectedSlot === slot._id
//                                     ? "border-blue-600 bg-blue-50 shadow-md"
//                                     : "border-gray-200 hover:border-blue-300 bg-white"
//                                 }`}
//                               >
//                                 <div className="flex flex-col items-center gap-2">
//                                   <div
//                                     className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                                       selectedSlot === slot._id ? "bg-blue-600" : "bg-gray-100"
//                                     }`}
//                                   >
//                                     <Clock
//                                       className={`w-4 h-4 ${selectedSlot === slot._id ? "text-white" : "text-gray-500"}`}
//                                     />
//                                   </div>
//                                   <span className="font-semibold text-sm">{formatTime(slot.date)}</span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )
//                       })()}
//                     </div>
//                   )}
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         <VehicleSelectionCard selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} />

//         {/* Book Service Button */}
//         <div className="text-center">
//           <Button
//             onClick={handleBooking}
//             size="lg"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-md shadow-sm"
//             disabled={!isBookingEnabled || isLoading}
//           >
//             {isLoading ? (
//               <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//             ) : (
//               <>
//                 <CheckCircle className="w-5 h-5 mr-2" />
//                 Book Pre-Trip Checkup - ₹{selectedPlan && selectedPlan.price}
//               </>
//             )}
//           </Button>
//         </div>
//         {isBookingEnabled && (
//           <div className="text-center mt-3">
//             <p className="text-sm text-gray-600">Your appointment will be confirmed within 5 minutes</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



import {  useState } from "react"
import {CheckCircle,Loader2,Shield,ArrowLeft} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"
import {  useGetPlanForBookingQuery } from "@/services/userServices/pretripUserApi"
import { useParams } from "react-router-dom"
import VehicleSelectionCard from "../../components/VehicleSelectionCard"
import LocationPicker from "../../components/LocationPicker"
import SlotBooking from "../../components/pretrip/SlotBooking"




export default function PretripCheckupBooking() {
  const [selectedMechanic, setSelectedMechanic] = useState<string>("")
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams();

  const { data: selectedPlan } = useGetPlanForBookingQuery(params.id)


  // Generate next 7 days


  const handleBooking = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Handle booking logic here
      console.log("Booking confirmed!")
    }, 2000)
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
            disabled={!isBookingEnabled || isLoading}
          >
            {isLoading ? (
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

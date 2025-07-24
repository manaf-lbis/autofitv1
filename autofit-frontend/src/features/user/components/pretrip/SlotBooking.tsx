// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetNearbyMechanicShopsQuery } from "@/services/userServices/pretripUserApi";
// import { AlertCircle, Calendar, CheckCircle, Clock, MapPin, Star, Wrench } from "lucide-react";
// import React, { useState } from "react";



// const mockMechanics = [
//     {
//         mechanicId: "1",
//         name: "AutoCare Service Center",
//         distance: "2.3 km",
//         place: "8+ years",
//         specialization: "Pre-trip Inspection",
//         hasSlots: true,
//     },
//     {
//         mechanicId: "2",
//         name: "QuickFix Garage",
//         distance: "3.1 km",
//         place: "5+ years",
//         specialization: "Vehicle Diagnostics",
//         hasSlots: false,
//     },
//     {
//         mechanicId: "3",
//         name: "Express Auto Service",
//         distance: "4.2 km",
//         place: "6+ years",
//         specialization: "Quick Inspection",
//         hasSlots: false,
//     },
// ]


// const mockSlots = [
//     {
//         _id: "6881d5bcedba665e64d7f857",
//         status: "available",
//         mechanicId: "1",
//         date: "2025-07-30T02:30:00.000Z",
//     },
//     {
//         _id: "6881d5bcedba665e64d7f85a",
//         status: "available",
//         mechanicId: "1",
//         date: "2025-07-30T12:30:00.000Z",
//     },
//     {
//         _id: "6881d5bcedba665e64d7f859",
//         status: "available",
//         mechanicId: "1",
//         date: "2025-07-30T10:30:00.000Z",
//     },
//     {
//         _id: "6881d5d0edba665e64d7f862",
//         status: "available",
//         mechanicId: "1",
//         date: "2025-07-28T06:30:00.000Z",
//     },
//     {
//         _id: "6881d5fbedba665e64d7f870",
//         status: "available",
//         mechanicId: "1",
//         date: "2025-07-26T02:30:00.000Z",
//     },
// ]

// const groupSlotsByDate = (slots: any, selectedMechanic: any) => {
//     return slots
//         .filter((slot: any) => slot.mechanicId === selectedMechanic && slot.status === "available")
//         .reduce((groups: any, slot: any) => {
//             const date = slot.date.split("T")[0]
//             if (!groups[date]) {
//                 groups[date] = []
//             }
//             groups[date].push(slot)
//             return groups
//         }, {})
// }


// const formatTime = (dateString: any) => {
//     const date = new Date(dateString)
//     return date.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//     })
// }


// const getNext7Days = () => {
//     const days = []
//     const today = new Date()

//     for (let i = 0; i < 7; i++) {
//         const date = new Date(today)
//         date.setDate(today.getDate() + i)
//         days.push({
//             date: date.toISOString().split("T")[0],
//             day: date.toLocaleDateString("en-US", { weekday: "short" }),
//             dayNum: date.getDate(),
//             month: date.toLocaleDateString("en-US", { month: "short" }),
//         })
//     }
//     return days
// }
// const next7Days = getNext7Days()

// interface Props {
//     selectedMechanic: string,
//     setSelectedMechanic: React.Dispatch<React.SetStateAction<string>>,
//     selectedSlot: string,
//     setSelectedSlot: React.Dispatch<React.SetStateAction<string>>,
//     coords:{ lat: number; lng: number }
// }

// const SlotBooking: React.FC<Props> = ({ selectedMechanic, setSelectedMechanic, selectedSlot, setSelectedSlot, coords }) => {
//     const [selectedDate, setSelectedDate] = useState<string>("");

//     const mechanicsWithSlots = mockMechanics.filter((mechanic) => mechanic.hasSlots)
//     const hasAnySlots = mechanicsWithSlots.length > 0

//    const {data} = useGetNearbyMechanicShopsQuery(coords)
 
   


//     return (
//         <>
//             <Card className="bg-white shadow-sm border-0 rounded-md mb-8">
//                 <CardHeader className="pb-4">
//                     <CardTitle className="flex items-center justify-between">
//                         <div className="flex items-center gap-3 text-xl">
//                             <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
//                                 <Wrench className="w-5 h-5 text-green-600" />
//                             </div>
//                             Available Service Centers
//                         </div>
//                         {hasAnySlots && (
//                             <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
//                                 {mechanicsWithSlots.length} centers available
//                             </span>
//                         )}
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {!hasAnySlots ? (
//                         <div className="text-center py-12">
//                             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <AlertCircle className="w-8 h-8 text-red-500" />
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                                 No Slots Available
//                             </h3>
//                             <p className="text-gray-600 mb-4">
//                                 Unfortunately, no service centers have available slots at this
//                                 location right now.
//                             </p>
//                             <div className="space-y-2 text-sm text-gray-500">
//                                 <p>• Try selecting a different location</p>
//                                 <p>• Check back later for new availability</p>
//                                 <p>• Contact us for urgent assistance</p>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             {mockMechanics.map((mechanic) => (
//                                 <div
//                                     key={mechanic.id}
//                                     onClick={() =>
//                                         mechanic.hasSlots && setSelectedMechanic(mechanic.id)
//                                     }
//                                     className={`p-6 rounded-lg border-2 transition-all relative ${!mechanic.hasSlots
//                                             ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
//                                             : selectedMechanic === mechanic.id
//                                                 ? "border-blue-600 bg-blue-50 shadow-md cursor-pointer"
//                                                 : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm cursor-pointer"
//                                         }`}
//                                 >
//                                     {selectedMechanic === mechanic.id && mechanic.hasSlots && (
//                                         <div className="absolute top-4 right-4">
//                                             <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
//                                                 <CheckCircle className="w-4 h-4 text-white" />
//                                             </div>
//                                         </div>
//                                     )}

//                                     {!mechanic.hasSlots && (
//                                         <div className="absolute top-4 right-4">
//                                             <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
//                                                 No Slots
//                                             </div>
//                                         </div>
//                                     )}

//                                     <div className="space-y-3">
//                                         <div>
//                                             <h3
//                                                 className={`font-bold text-lg mb-2 ${mechanic.hasSlots ? "text-gray-900" : "text-gray-500"
//                                                     }`}
//                                             >
//                                                 {mechanic.name}
//                                             </h3>
//                                             <p
//                                                 className={`font-medium text-sm ${mechanic.hasSlots ? "text-blue-600" : "text-gray-400"
//                                                     }`}
//                                             >
//                                                 {mechanic.specialization}
//                                             </p>
//                                         </div>
//                                         <div className="flex items-center gap-3">
//                                             <div
//                                                 className={`flex items-center gap-1 px-2 py-1 rounded ${mechanic.hasSlots ? "bg-yellow-50" : "bg-gray-100"
//                                                     }`}
//                                             >
//                                                 <Star
//                                                     className={`w-4 h-4 ${mechanic.hasSlots
//                                                             ? "fill-yellow-400 text-yellow-400"
//                                                             : "fill-gray-300 text-gray-300"
//                                                         }`}
//                                                 />
//                                                 <span
//                                                     className={`text-sm font-medium ${mechanic.hasSlots
//                                                             ? "text-gray-900"
//                                                             : "text-gray-400"
//                                                         }`}
//                                                 >
//                                                     {mechanic.rating}
//                                                 </span>
//                                             </div>
//                                             <div
//                                                 className={`flex items-center gap-1 px-2 py-1 rounded ${mechanic.hasSlots ? "bg-gray-50" : "bg-gray-100"
//                                                     }`}
//                                             >
//                                                 <MapPin
//                                                     className={`w-4 h-4 ${mechanic.hasSlots
//                                                             ? "text-gray-500"
//                                                             : "text-gray-300"
//                                                         }`}
//                                                 />
//                                                 <span
//                                                     className={`text-sm font-medium ${mechanic.hasSlots
//                                                             ? "text-gray-900"
//                                                             : "text-gray-400"
//                                                         }`}
//                                                 >
//                                                     {mechanic.distance}
//                                                 </span>
//                                             </div>
//                                             <div
//                                                 className={`px-2 py-1 rounded text-sm font-medium ${mechanic.hasSlots
//                                                         ? "bg-blue-50 text-blue-700"
//                                                         : "bg-gray-100 text-gray-400"
//                                                     }`}
//                                             >
//                                                 {mechanic.experience}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             {selectedMechanic && (
//                 <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
//                     <CardHeader className="pb-4">
//                         <CardTitle className="flex items-center gap-3 text-xl">
//                             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                                 <Calendar className="w-5 h-5 text-purple-600" />
//                             </div>
//                             Select Date & Time
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                         {Object.keys(groupSlotsByDate(mockSlots, selectedMechanic))
//                             .length === 0 ? (
//                             <div className="text-center py-12">
//                                 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <Calendar className="w-8 h-8 text-red-500" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                                     No Time Slots Available
//                                 </h3>
//                                 <p className="text-gray-600 mb-4">
//                                     This service center doesn't have any available time slots at
//                                     the moment.
//                                 </p>
//                                 <div className="space-y-2 text-sm text-gray-500">
//                                     <p>• Try selecting a different service center</p>
//                                     <p>• Check back later for new slots</p>
//                                     <p>• Contact the service center directly</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             <>
//                                 {/* Date Selection */}
//                                 <div className="space-y-3">
//                                     <h4 className="text-base font-medium text-gray-900">
//                                         Choose Date
//                                     </h4>
//                                     <div className="grid grid-cols-7 gap-2">
//                                         {(() => {
//                                             const availableDates = [
//                                                 ...new Set(
//                                                     mockSlots
//                                                         .filter(
//                                                             (slot) =>
//                                                                 slot.mechanicId === selectedMechanic &&
//                                                                 slot.status === "available"
//                                                         )
//                                                         .map((slot) => slot.date.split("T")[0])
//                                                 ),
//                                             ];

//                                             return next7Days.map((day) => {
//                                                 const hasSlots = availableDates.includes(day.date);
//                                                 return (
//                                                     <div
//                                                         key={day.date}
//                                                         onClick={() =>
//                                                             hasSlots && setSelectedDate(day.date)
//                                                         }
//                                                         className={`p-3 rounded-lg border-2 text-center transition-all ${!hasSlots
//                                                                 ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
//                                                                 : selectedDate === day.date
//                                                                     ? "border-blue-600 bg-blue-50 cursor-pointer"
//                                                                     : "border-gray-200 hover:border-blue-300 bg-white cursor-pointer"
//                                                             }`}
//                                                     >
//                                                         <div className="text-xs text-gray-600 mb-1">
//                                                             {day.day}
//                                                         </div>
//                                                         <div
//                                                             className={`font-semibold ${hasSlots ? "text-gray-900" : "text-gray-400"
//                                                                 }`}
//                                                         >
//                                                             {day.dayNum}
//                                                         </div>
//                                                         <div className="text-xs text-gray-600">
//                                                             {day.month}
//                                                         </div>
//                                                         {hasSlots && (
//                                                             <div className="text-xs text-blue-600 mt-1">
//                                                                 {
//                                                                     mockSlots.filter(
//                                                                         (slot) =>
//                                                                             slot.mechanicId === selectedMechanic &&
//                                                                             slot.date.split("T")[0] === day.date &&
//                                                                             slot.status === "available"
//                                                                     ).length
//                                                                 }{" "}
//                                                                 slots
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 );
//                                             });
//                                         })()}
//                                     </div>
//                                 </div>

//                                 {/* Time Selection */}
//                                 {selectedDate && (
//                                     <div className="space-y-3">
//                                         <h4 className="text-base font-medium text-gray-900">
//                                             Available Time Slots
//                                         </h4>
//                                         {(() => {
//                                             const daySlots = mockSlots.filter(
//                                                 (slot) =>
//                                                     slot.mechanicId === selectedMechanic &&
//                                                     slot.date.split("T")[0] === selectedDate &&
//                                                     slot.status === "available"
//                                             );

//                                             if (daySlots.length === 0) {
//                                                 return (
//                                                     <div className="text-center py-8">
//                                                         <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                                                         <p className="text-gray-500">
//                                                             No slots available for this date
//                                                         </p>
//                                                     </div>
//                                                 );
//                                             }

//                                             return (
//                                                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
//                                                     {daySlots.map((slot) => (
//                                                         <div
//                                                             key={slot._id}
//                                                             onClick={() => setSelectedSlot(slot._id)}
//                                                             className={`p-4 rounded-lg border-2 cursor-pointer text-center transition-all hover:shadow-sm ${selectedSlot === slot._id
//                                                                     ? "border-blue-600 bg-blue-50 shadow-md"
//                                                                     : "border-gray-200 hover:border-blue-300 bg-white"
//                                                                 }`}
//                                                         >
//                                                             <div className="flex flex-col items-center gap-2">
//                                                                 <div
//                                                                     className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedSlot === slot._id
//                                                                             ? "bg-blue-600"
//                                                                             : "bg-gray-100"
//                                                                         }`}
//                                                                 >
//                                                                     <Clock
//                                                                         className={`w-4 h-4 ${selectedSlot === slot._id
//                                                                                 ? "text-white"
//                                                                                 : "text-gray-500"
//                                                                             }`}
//                                                                     />
//                                                                 </div>
//                                                                 <span className="font-semibold text-sm">
//                                                                     {formatTime(slot.date)}
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             );
//                                         })()}
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </CardContent>
//                 </Card>
//             )}
//         </>
//     );
// };

// export default SlotBooking;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetNearbyMechanicShopsQuery } from "@/services/userServices/pretripUserApi";
import { AlertCircle, Calendar, CheckCircle, Clock, MapPin, Star, Wrench } from "lucide-react";
import React, { useState } from "react";

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return days;
};
const next7Days = getNext7Days();

interface Props {
  selectedMechanic: string;
  setSelectedMechanic: React.Dispatch<React.SetStateAction<string>>;
  selectedSlot: string;
  setSelectedSlot: React.Dispatch<React.SetStateAction<string>>;
  coords: { lat: number; lng: number };
}

const SlotBooking: React.FC<Props> = ({ selectedMechanic, setSelectedMechanic, selectedSlot, setSelectedSlot, coords }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { data, isLoading } = useGetNearbyMechanicShopsQuery(coords);


  const mechanics = data?.data?.mechanics.map((mechanic: any) => ({
    mechanicId: mechanic.mechanicId,
    name: mechanic.shopName,
    distance: `${(mechanic.distanceInMeters / 1000).toFixed(1)} km`, 
    place: mechanic.place,
    specialization: mechanic.specialised,
    hasSlots: mechanic.hasSlots,
  })) || [];

  const slots = data?.data?.slots || [];

  const groupSlotsByDate = (slots: any[], selectedMechanic: string) =>
    slots
      .filter((slot: any) => slot.mechanicId === selectedMechanic && slot.status === "available")
      .reduce((groups: any, slot: any) => {
        const date = slot.date.split("T")[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(slot);
        return groups;
      }, {});

  const mechanicsWithSlots = mechanics.filter((mechanic:any) => mechanic.hasSlots);
  const hasAnySlots = mechanicsWithSlots.length > 0;

  return (
    <>
      <Card className="bg-white shadow-sm border-0 rounded-md mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
                <Wrench className="w-5 h-5 text-green-600" />
              </div>
              Available Service Centers
            </div>
            {hasAnySlots && (
              <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {mechanicsWithSlots.length} centers available
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : !hasAnySlots ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Slots Available</h3>
              <p className="text-gray-600 mb-4">No service centers have available slots at this location right now.</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Try a different location</p>
                <p>• Check back later</p>
                <p>• Contact support</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {mechanics.map((mechanic:any) => (
                <div
                  key={mechanic.mechanicId}
                  onClick={() => mechanic.hasSlots && setSelectedMechanic(mechanic.mechanicId)}
                  className={`p-6 rounded-lg border-2 transition-all relative ${!mechanic.hasSlots
                      ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                      : selectedMechanic === mechanic.mechanicId
                      ? "border-blue-600 bg-blue-50 shadow-md cursor-pointer"
                      : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm cursor-pointer"
                    }`}
                >
                  {selectedMechanic === mechanic.mechanicId && mechanic.hasSlots && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  {!mechanic.hasSlots && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">No Slots</div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h3 className={`font-bold text-lg mb-2 ${mechanic.hasSlots ? "text-gray-900" : "text-gray-500"}`}>
                        {mechanic.name}
                      </h3>
                      <p className={`font-medium text-sm ${mechanic.hasSlots ? "text-blue-600" : "text-gray-400"}`}>
                        {mechanic.specialization}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded ${mechanic.hasSlots ? "bg-yellow-50" : "bg-gray-100"}`}>
                        <Star className={`w-4 h-4 ${mechanic.hasSlots ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"}`} />
                        <span className={`text-sm font-medium ${mechanic.hasSlots ? "text-gray-900" : "text-gray-400"}`}>4.8</span> {/* Placeholder rating */}
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded ${mechanic.hasSlots ? "bg-gray-50" : "bg-gray-100"}`}>
                        <MapPin className={`w-4 h-4 ${mechanic.hasSlots ? "text-gray-500" : "text-gray-300"}`} />
                        <span className={`text-sm font-medium ${mechanic.hasSlots ? "text-gray-900" : "text-gray-400"}`}>{mechanic.distance}</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-sm font-medium ${mechanic.hasSlots ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
                        {mechanic.place}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMechanic && (
        <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              Select Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.keys(groupSlotsByDate(slots, selectedMechanic)).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Time Slots Available</h3>
                <p className="text-gray-600 mb-4">This service center doesn't have any available time slots at the moment.</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Try a different service center</p>
                  <p>• Check back later</p>
                  <p>• Contact support</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <h4 className="text-base font-medium text-gray-900">Choose Date</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {next7Days.map((day) => {
                      const hasSlots = Object.keys(groupSlotsByDate(slots, selectedMechanic)).includes(day.date);
                      return (
                        <div
                          key={day.date}
                          onClick={() => hasSlots && setSelectedDate(day.date)}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${!hasSlots
                              ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
                              : selectedDate === day.date
                              ? "border-blue-600 bg-blue-50 cursor-pointer"
                              : "border-gray-200 hover:border-blue-300 bg-white cursor-pointer"
                            }`}
                        >
                          <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                          <div className={`font-semibold ${hasSlots ? "text-gray-900" : "text-gray-400"}`}>{day.dayNum}</div>
                          <div className="text-xs text-gray-600">{day.month}</div>
                          {hasSlots && (
                            <div className="text-xs text-blue-600 mt-1">{groupSlotsByDate(slots, selectedMechanic)[day.date].length} slots</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="space-y-3">
                    <h4 className="text-base font-medium text-gray-900">Available Time Slots</h4>
                    {groupSlotsByDate(slots, selectedMechanic)[selectedDate].length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No slots available for this date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {groupSlotsByDate(slots, selectedMechanic)[selectedDate].map((slot: any) => (
                          <div
                            key={slot._id}
                            onClick={() => setSelectedSlot(slot._id)}
                            className={`p-4 rounded-lg border-2 cursor-pointer text-center transition-all hover:shadow-sm ${selectedSlot === slot._id
                                ? "border-blue-600 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-blue-300 bg-white"
                              }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedSlot === slot._id ? "bg-blue-600" : "bg-gray-100"}`}
                              >
                                <Clock className={`w-4 h-4 ${selectedSlot === slot._id ? "text-white" : "text-gray-500"}`} />
                              </div>
                              <span className="font-semibold text-sm">{formatTime(slot.date)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SlotBooking;
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Video, Clock, MapPin, AlertCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { LiveAssistanceStatus } from "@/types/liveAssistance";
// import { useGetActiveCallsQuery } from "@/services/mechanicServices/mechanicLiveAssistanceApi";
// // import { VideoCallModal } from "./VideoCallModal"; 


// interface Call {
//   id: number;
//   name: string;
//   vehicle: string;
//   location: string;
//   startTime: string;
//   endTime: string;
//   status: string;
//   issue: string;
//   service: string;
//   amount: string;
// }

// export function LiveAssistance() {
//   const {data,isFetching} = useGetActiveCallsQuery({})
  
//   const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
//   console.log(isVideoCallOpen);
  
//   const navigate = useNavigate();


//   const callHistory: Call[] = [
//     {
//       id: 1,
//       name: "Rajesh Kumar",
//       vehicle: "KL 07 AB 1234",
//       location: "Downtown Area, Kollam",
//       startTime: "Jan 22, 1:30 PM",
//       endTime: "Jan 22, 2:15 PM",
//       status: "Completed",
//       issue: "Brake system diagnostic - Customer reports squeaking noise when braking",
//       service: "Premium",
//       amount: "₹2500",
//     },
//     // ... other call history entries (unchanged)
//     {
//       id: 6,
//       name: "Suresh Kumar",
//       vehicle: "KL 12 F 7654",
//       location: "Industrial Area, Kollam",
//       startTime: "Jan 26, 9:30 AM",
//       endTime: "Jan 26, 11:00 AM",
//       status: "In Progress",
//       issue: "Engine overheating - Coolant leak detected, needs immediate attention",
//       service: "Premium",
//       amount: "₹3200",
//     },
//   ];

//   const activeCall = data?.data?.status === LiveAssistanceStatus.ONGOING ? data.data : null;

//   return (
//     <div className="p-6 w-full bg-gray-50">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 mb-1">Live Assistance</h1>
//         <p className="text-gray-600 text-sm">Manage your live video calls and assistance requests</p>
//       </div>

//       <div className="mb-8">
//         <Card className="border-2 border-blue-200 bg-blue-50 rounded-xl">
//           <CardContent className="p-8">
//             {isFetching ? (
//               <div className="flex items-center justify-center h-24">
//                 <p className="text-gray-600">Loading active call...</p>
//               </div>
//             ) : activeCall ? (
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-6">
//                   <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
//                     <Video className="w-8 h-8 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-semibold text-gray-900 mb-1">{activeCall.mechanicId.name}</h3>
//                     <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
//                       <div className="flex items-center gap-2">
//                         <Clock className="w-4 h-4" />
//                         <span>Started: {new Date(activeCall.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Clock className="w-4 h-4" />
//                         <span>End: {new Date(activeCall.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <MapPin className="w-4 h-4" />
//                         <span>{activeCall.location || "Kollam"}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <Button
//                     size="lg"
//                     className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8"
//                     onClick={() => setIsVideoCallOpen(true)}
//                   >
//                     <Video className="w-5 h-5 mr-3" />
//                     Join Call
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="rounded-xl"
//                     onClick={() => navigate(`/booking-details/${activeCall._id}`)}
//                   >
//                     View Details
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center h-24">
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <AlertCircle className="w-6 h-6" />
//                   <p>No active call at the moment</p>
//                 </div>
//               </div>
//             )}
//             {activeCall && (
//               <div className="mt-6 p-6 bg-white rounded-xl">
//                 <h4 className="font-medium text-gray-900 mb-3">Issue Description</h4>
//                 <p className="text-gray-600 leading-relaxed">{activeCall.description}</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* <VideoCallModal
//         isOpen={isVideoCallOpen}
//         onClose={() => setIsVideoCallOpen(false)}
//         mechanicName={activeCall?.mechanicId.name || ""}
//         bookingTime={activeCall?.startTime || ""}
//       /> */}

//       <div>
//         <h2 className="text-xl font-medium text-gray-900 mb-6">Call History</h2>
//         <div className="h-96 overflow-y-auto rounded-xl border border-gray-200 p-4 bg-white">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {callHistory.map((call) => (
//               <Card key={call.id} className="rounded-xl hover:shadow-md transition-shadow">
//                 <CardContent className="p-4">
//                   <div className="flex justify-between items-start mb-3">
//                     <div>
//                       <h3 className="font-semibold text-gray-900 text-base mb-1">{call.name}</h3>
//                       <p className="text-xs text-gray-500">{call.vehicle}</p>
//                     </div>
//                     <Badge
//                       className={`${call.status === "Completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"} rounded-lg text-xs px-2 py-1`}
//                     >
//                       {call.status}
//                     </Badge>
//                   </div>

//                   <div className="flex justify-between text-xs text-gray-600 mb-3">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       <span>{call.startTime.split(", ")[1]}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <MapPin className="w-3 h-3" />
//                       <span className="truncate max-w-20">{call.location.split(", ")[0]}</span>
//                     </div>
//                   </div>

//                   <div className="p-3 bg-gray-50 rounded-lg mb-3">
//                     <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{call.issue}</p>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-medium text-gray-700">{call.service}</span>
//                     <span className="text-sm font-semibold text-gray-900">{call.amount}</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Clock, AlertCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LiveAssistanceStatus } from "@/types/liveAssistance";
import { useGetActiveCallsQuery } from "@/services/mechanicServices/mechanicLiveAssistanceApi";
// import { VideoCallModal } from "./VideoCallModal";

interface Call {
  id: number;
  name: string;
  vehicle: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string;
  issue: string;
  service: string;
  amount: string;
}

interface ActiveCall {
  _id: string;
  userId: { _id: string; name: string; mobile: string };
  status: string;
  issue: string;
  description: string;
  price: number;
  sessionId: string;
  startTime: string;
  endTime: string;
}

export function LiveAssistance() {
  const { data, isFetching } = useGetActiveCallsQuery({});
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  console.log(isVideoCallOpen);
  const navigate = useNavigate();

  const callHistory: Call[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      vehicle: "KL 07 AB 1234",
      location: "Downtown Area, Kollam",
      startTime: "Jan 22, 1:30 PM",
      endTime: "Jan 22, 2:15 PM",
      status: "Completed",
      issue: "Brake system diagnostic - Customer reports squeaking noise when braking",
      service: "Premium",
      amount: "₹2500",
    },
    {
      id: 6,
      name: "Suresh Kumar",
      vehicle: "KL 12 F 7654",
      location: "Industrial Area, Kollam",
      startTime: "Jan 26, 9:30 AM",
      endTime: "Jan 26, 11:00 AM",
      status: "In Progress",
      issue: "Engine overheating - Coolant leak detected, needs immediate attention",
      service: "Premium",
      amount: "₹3200",
    },
  ];

  const activeCall: ActiveCall | null = data?.data?.status === LiveAssistanceStatus.ONGOING ? data.data : null;

  return (
    <div className="p-6 w-full bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Live Assistance</h1>
        <p className="text-gray-600 text-sm">Manage your live video calls and assistance requests</p>
      </div>

      <div className="mb-8">
        <Card className="border-2 border-blue-200 bg-blue-50 rounded-xl">
          <CardContent className="p-8">
            {isFetching ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-gray-600">Loading active call...</p>
              </div>
            ) : activeCall ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{activeCall.userId.name}</h3>
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          Started:{" "}
                          {new Date(activeCall.startTime).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          End:{" "}
                          {new Date(activeCall.endTime).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8"
                    onClick={() => setIsVideoCallOpen(true)}
                  >
                    <Video className="w-5 h-5 mr-3" />
                    Join Call
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-xl"
                    onClick={() => navigate(`/booking-details/${activeCall._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24">
                <div className="flex items-center gap-2 text-gray-600">
                  <AlertCircle className="w-6 h-6" />
                  <p>No active call at the moment</p>
                </div>
              </div>
            )}
            {activeCall && (
              <div className="mt-6 p-6 bg-white rounded-xl">
                <h4 className="font-medium text-gray-900 mb-3">Issue Description</h4>
                <p className="text-gray-600 leading-relaxed">{activeCall.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        mechanicName={activeCall?.userId.name || ""}
        bookingTime={activeCall?.startTime || ""}
      /> */}

      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-6">Call History</h2>
        <div className="h-96 overflow-y-auto rounded-xl border border-gray-200 p-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {callHistory.map((call) => (
              <Card key={call.id} className="rounded-xl hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base mb-1">{call.name}</h3>
                      <p className="text-xs text-gray-500">{call.vehicle}</p>
                    </div>
                    <Badge
                      className={`${call.status === "Completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"} rounded-lg text-xs px-2 py-1`}
                    >
                      {call.status}
                    </Badge>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{call.startTime.split(", ")[1]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-20">{call.location.split(", ")[0]}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg mb-3">
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{call.issue}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-700">{call.service}</span>
                    <span className="text-sm font-semibold text-gray-900">{call.amount}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
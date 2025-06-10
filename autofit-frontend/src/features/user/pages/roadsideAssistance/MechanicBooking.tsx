import { useState } from "react";
import {
  MapPin,
  Clock,
  Star,
  Wrench,
  Car,
  AlertCircle,
  Phone,
  CheckCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import VehicleModal from "../../components/profile/modal/VehicleModal";
import { useGetMyVehiclesQuery } from "../../api/vehicleApi";
import PlacePicker from "@/components/shared/LocationInput/PlacePicker";
import LatLngToAddress from "@/components/shared/LocationInput/LatLngToAddress";
import ShowNearByMechanic from "@/components/shared/ShowNearByMechanic";


// Mock data for nearby mechanics
const nearbyMechanics = [
  {
    id: "1",
    name: "AutoCare Pro Services",
    rating: 4.8,
    distance: "0.5 km",
    responseTime: "15 min",
    specialties: ["Engine Repair", "Brake Service"],
    phone: "+91 9876543210",
    address: "MG Road, Kochi",
    available: true,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "2",
    name: "Quick Fix Garage",
    rating: 4.6,
    distance: "1.2 km",
    responseTime: "20 min",
    specialties: ["Tire Service", "Battery"],
    phone: "+91 9876543211",
    address: "Panampilly Nagar, Kochi",
    available: true,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "3",
    name: "Expert Auto Solutions",
    rating: 4.9,
    distance: "1.8 km",
    responseTime: "25 min",
    specialties: ["Electrical", "AC Service"],
    phone: "+91 9876543212",
    address: "Kadavanthra, Kochi",
    available: false,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "4",
    name: "Reliable Motors",
    rating: 4.7,
    distance: "2.1 km",
    responseTime: "30 min",
    specialties: ["Transmission", "Suspension"],
    phone: "+91 9876543213",
    address: "Kaloor, Kochi",
    available: true,
    avatar: "/placeholder.svg?height=60&width=60",
  },
];

const commonIssues = [
  "Engine Problems",
  "Brake Issues",
  "Tire/Wheel Problems",
  "Battery Dead",
  "AC Not Working",
  "Electrical Issues",
  "Transmission Problems",
  "Suspension Issues",
  "Other",
];

export default function MechanicBooking() {
  const [selectedMechanic, setSelectedMechanic] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [showMechanics, setShowMechanics] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const { data:vehicleData, isLoading, refetch } = useGetMyVehiclesQuery({});
  const [cords,setCord] = useState<{lat:number,lng:number} | null>(null)
  


  const findNearbyMechanics = () => {
    setShowMechanics(true);
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              24/7 Emergency Assistance Available
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Emergency <span className="text-blue-600">Roadside Services</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Professional roadside assistance when you need it most. Fast
            response times, expert technicians, and transparent pricing you can
            trust.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white shadow-sm border-0 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15min</div>
              <div className="text-sm text-gray-600">Average Response</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Always Available</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-0 rounded-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                ★4.9
              </div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Location Section */}
        <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              Your Location
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                   <PlacePicker onChange={setCord} value={cords} className="bg-blue-600 hover:bg-blue-700 text-white"/>
                {cords && (
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                    <MapPin className="w-4 h-4" />
                    <LatLngToAddress lat={cords.lat} lng={cords.lng}/>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Mechanics */}
        {cords &&  <ShowNearByMechanic lat={cords.lat} lng={cords.lng} />}

        {/* Vehicle Selection */}
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
              {vehicleData && vehicleData.data.map((vehicle:any) => (
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

        {/* Issue Selection */}
        <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              Describe Your Issue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="issue-select"
                className="text-base font-medium text-gray-900"
              >
                Select Issue Type
              </Label>
              <Select value={selectedIssue} onValueChange={setSelectedIssue}>
                <SelectTrigger className="h-12 bg-gray-50 border-0 rounded-lg">
                  <SelectValue placeholder="Choose the type of issue" />
                </SelectTrigger>
                <SelectContent>
                  {commonIssues.map((issue) => (
                    <SelectItem key={issue} value={issue}>
                      {issue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="issue-description"
                className="text-base font-medium text-gray-900"
              >
                Describe the Issue
              </Label>
              <Textarea
                id="issue-description"
                placeholder="Please provide detailed information about the problem you're experiencing..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={4}
                className="bg-gray-50 border-0 rounded-lg resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Book Service Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-sm"
            disabled={
              !selectedMechanic ||
              !selectedVehicle ||
              !selectedIssue ||
              !issueDescription.trim()
            }
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Book Mechanic Service
          </Button>
        </div>
      </div>
     
    </div>
     <VehicleModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetchVehicles={refetch}
        vehicle={null}
      />
   </>
  );
}






// import { useState } from "react";
// import {
//   MapPin,
//   Clock,
//   Star,
//   Wrench,
//   Car,
//   AlertCircle,
//   Phone,
//   CheckCircle,
//   Plus,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import VehicleModal from "../../components/profile/modal/VehicleModal";
// import { useGetMyVehiclesQuery } from "../../api/vehicleApi";
// import PlacePicker from "@/components/shared/LocationInput/PlacePicker";
// import LatLngToAddress from "@/components/shared/LocationInput/LatLngToAddress";

// // Mock data for nearby mechanics
// const nearbyMechanics = [
//   {
//     id: "1",
//     name: "AutoCare Pro Services",
//     rating: 4.8,
//     distance: "0.5 km",
//     responseTime: "15 min",
//     specialties: ["Engine Repair", "Brake Service"],
//     phone: "+91 9876543210",
//     address: "MG Road, Kochi",
//     available: true,
//     avatar: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: "2",
//     name: "Quick Fix Garage",
//     rating: 4.6,
//     distance: "1.2 km",
//     responseTime: "20 min",
//     specialties: ["Tire Service", "Battery"],
//     phone: "+91 9876543211",
//     address: "Panampilly Nagar, Kochi",
//     available: true,
//     avatar: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: "3",
//     name: "Expert Auto Solutions",
//     rating: 4.9,
//     distance: "1.8 km",
//     responseTime: "25 min",
//     specialties: ["Electrical", "AC Service"],
//     phone: "+91 9876543212",
//     address: "Kadavanthra, Kochi",
//     available: false,
//     avatar: "/placeholder.svg?height=60&width=60",
//   },
//   {
//     id: "4",
//     name: "Reliable Motors",
//     rating: 4.7,
//     distance: "2.1 km",
//     responseTime: "30 min",
//     specialties: ["Transmission", "Suspension"],
//     phone: "+91 9876543213",
//     address: "Kaloor, Kochi",
//     available: true,
//     avatar: "/placeholder.svg?height=60&width=60",
//   },
// ];

// const commonIssues = [
//   "Engine Problems",
//   "Brake Issues",
//   "Tire/Wheel Problems",
//   "Battery Dead",
//   "AC Not Working",
//   "Electrical Issues",
//   "Transmission Problems",
//   "Suspension Issues",
//   "Other",
// ];

// export default function MechanicBooking() {
//   const [selectedMechanic, setSelectedMechanic] = useState<string>("");
//   const [selectedVehicle, setSelectedVehicle] = useState<string>("");
//   const [selectedIssue, setSelectedIssue] = useState<string>("");
//   const [issueDescription, setIssueDescription] = useState<string>("");
//   const [showMechanics, setShowMechanics] = useState(false);

//   const [isOpen, setIsOpen] = useState(false);
//   const { data:vehicleData, isLoading, refetch } = useGetMyVehiclesQuery({});
//   const [cords,setCord] = useState<{lat:number,lng:number} | null>(null)
  


//   const findNearbyMechanics = () => {
//     setShowMechanics(true);
//   };

//   return (
//     <>
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border mb-6">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span className="text-sm font-medium text-gray-700">
//               24/7 Emergency Assistance Available
//             </span>
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Emergency <span className="text-blue-600">Roadside Services</span>
//           </h1>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
//             Professional roadside assistance when you need it most. Fast
//             response times, expert technicians, and transparent pricing you can
//             trust.
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           <Card className="bg-white shadow-sm border-0 rounded-lg">
//             <CardContent className="p-6 text-center">
//               <div className="text-3xl font-bold text-blue-600 mb-2">15min</div>
//               <div className="text-sm text-gray-600">Average Response</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white shadow-sm border-0 rounded-lg">
//             <CardContent className="p-6 text-center">
//               <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
//               <div className="text-sm text-gray-600">Always Available</div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white shadow-sm border-0 rounded-lg">
//             <CardContent className="p-6 text-center">
//               <div className="text-3xl font-bold text-yellow-500 mb-2">
//                 ★4.9
//               </div>
//               <div className="text-sm text-gray-600">Customer Rating</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Location Section */}
//         <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
//           <CardHeader className="pb-4">
//             <CardTitle className="flex items-center gap-3 text-xl">
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <MapPin className="w-5 h-5 text-blue-600" />
//               </div>
//               Your Location
//             </CardTitle>
//           </CardHeader>

//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex flex-col sm:flex-row gap-4 items-start">
//                    <PlacePicker onChange={setCord} value={cords} className="bg-blue-600 hover:bg-blue-700 text-white"/>
//                 {cords && (
//                   <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
//                     <MapPin className="w-4 h-4" />
//                     <LatLngToAddress lat={cords.lat} lng={cords.lng}/>
//                   </div>
//                 )}
//               </div>

//               {cords && !showMechanics && (
//                 <div className="pt-4 border-t">
//                   <Button
//                     onClick={findNearbyMechanics}
//                     className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
//                   >
//                     <Wrench className="w-4 h-4 mr-2" />
//                     Find Mechanics Nearby
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Nearby Mechanics
//         {showMechanics && (
//           <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
//             <CardHeader className="pb-4">
//               <CardTitle className="flex items-center gap-3 text-xl">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                   <Wrench className="w-5 h-5 text-green-600" />
//                 </div>
//                 Nearby Mechanics
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="max-h-96 overflow-y-auto space-y-4">
//                 {nearbyMechanics.map((mechanic) => (
//                   <div
//                     key={mechanic.id}
//                     onClick={() =>
//                       mechanic.available && setSelectedMechanic(mechanic.id)
//                     }
//                     className={`bg-gray-50 p-6 rounded-lg border-2 transition-all cursor-pointer relative ${
//                       selectedMechanic === mechanic.id
//                         ? "border-blue-600 bg-blue-50"
//                         : "border-transparent hover:border-gray-200"
//                     } ${
//                       !mechanic.available ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {selectedMechanic === mechanic.id && (
//                       <div className="absolute top-4 right-4">
//                         <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
//                           <CheckCircle className="w-4 h-4 text-white" />
//                         </div>
//                       </div>
//                     )}
//                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                       <div className="flex items-start gap-4">
//                         <img
//                           src={mechanic.avatar || "/placeholder.svg"}
//                           alt={mechanic.name}
//                           className="w-12 h-12 rounded-full object-cover bg-gray-200"
//                         />
//                         <div className="space-y-3 flex-1">
//                           <div className="flex items-center gap-3">
//                             <h3 className="font-semibold text-lg text-gray-900">
//                               {mechanic.name}
//                             </h3>
//                             <div className="flex items-center gap-1">
//                               <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                               <span className="font-medium text-gray-700">
//                                 {mechanic.rating}
//                               </span>
//                             </div>
//                             {mechanic.available ? (
//                               <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
//                                 Available
//                               </Badge>
//                             ) : (
//                               <Badge
//                                 variant="secondary"
//                                 className="bg-red-100 text-red-700"
//                               >
//                                 Busy
//                               </Badge>
//                             )}
//                           </div>
//                           <p className="text-gray-600">{mechanic.address}</p>
//                           <div className="flex flex-wrap gap-2">
//                             {mechanic.specialties.map((specialty) => (
//                               <span
//                                 key={specialty}
//                                 className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border"
//                               >
//                                 {specialty}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex flex-col gap-3 text-sm lg:text-right lg:ml-4">
//                         <div className="flex items-center gap-2 text-green-600">
//                           <MapPin className="w-4 h-4" />
//                           <span className="font-medium">
//                             {mechanic.distance}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 text-blue-600">
//                           <Clock className="w-4 h-4" />
//                           <span className="font-medium">
//                             {mechanic.responseTime}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 text-gray-600">
//                           <Phone className="w-4 h-4" />
//                           <span className="font-medium">{mechanic.phone}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )} */}

//         {/* Vehicle Selection */}
//         <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
//           <CardHeader className="pb-4">
//             <CardTitle className="flex justify-between items-center">
//               <div className="flex items-center gap-3 text-xl">
//                 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <Car className="w-5 h-5 text-purple-600" />
//                 </div>
//                 Select Your Vehicle
//               </div>

//               <Button
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
//                 onClick={() => setIsOpen(!isOpen)}
//               >
//                 <Plus size={16} />
//                 Add New Vehicle
//               </Button>

//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="max-h-80 overflow-y-auto space-y-4">
//               {vehicleData && vehicleData.data.map((vehicle:any) => (
//                 <div
//                   key={vehicle._id}
//                   onClick={() => setSelectedVehicle(vehicle._id)}
//                   className={`bg-gray-50 p-6 rounded-lg border-2 transition-all cursor-pointer relative ${
//                     selectedVehicle === vehicle._id
//                       ? "border-blue-600 bg-blue-50"
//                       : "border-transparent hover:border-gray-200"
//                   }`}
//                 >
//                   {selectedVehicle === vehicle._id && (
//                     <div className="absolute top-4 right-4">
//                       <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
//                         <CheckCircle className="w-4 h-4 text-white" />
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                     <div className="space-y-2">
//                       <h3 className="font-semibold text-lg text-gray-900">
//                         {vehicle.brand} {vehicle.modelName}
//                       </h3>
//                       <div className="space-y-1">
//                         <p className="text-gray-600">
//                           <span className="font-medium">Registration:</span>{" "}
//                           {vehicle.regNo}
//                         </p>
//                         <p className="text-gray-600">
//                           <span className="font-medium">Owner:</span>{" "}
//                           {vehicle.owner}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border">
//                         {vehicle.fuelType}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Issue Selection */}
//         <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
//           <CardHeader className="pb-4">
//             <CardTitle className="flex items-center gap-3 text-xl">
//               <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//                 <AlertCircle className="w-5 h-5 text-red-600" />
//               </div>
//               Describe Your Issue
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-3">
//               <Label
//                 htmlFor="issue-select"
//                 className="text-base font-medium text-gray-900"
//               >
//                 Select Issue Type
//               </Label>
//               <Select value={selectedIssue} onValueChange={setSelectedIssue}>
//                 <SelectTrigger className="h-12 bg-gray-50 border-0 rounded-lg">
//                   <SelectValue placeholder="Choose the type of issue" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {commonIssues.map((issue) => (
//                     <SelectItem key={issue} value={issue}>
//                       {issue}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-3">
//               <Label
//                 htmlFor="issue-description"
//                 className="text-base font-medium text-gray-900"
//               >
//                 Describe the Issue
//               </Label>
//               <Textarea
//                 id="issue-description"
//                 placeholder="Please provide detailed information about the problem you're experiencing..."
//                 value={issueDescription}
//                 onChange={(e) => setIssueDescription(e.target.value)}
//                 rows={4}
//                 className="bg-gray-50 border-0 rounded-lg resize-none"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Book Service Button */}
//         <div className="text-center">
//           <Button
//             size="lg"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-sm"
//             disabled={
//               !selectedMechanic ||
//               !selectedVehicle ||
//               !selectedIssue ||
//               !issueDescription.trim()
//             }
//           >
//             <CheckCircle className="w-5 h-5 mr-2" />
//             Book Mechanic Service
//           </Button>
//         </div>
//       </div>
     
//     </div>
//      <VehicleModal
//         isOpen={isOpen}
//         setIsOpen={setIsOpen}
//         refetchVehicles={refetch}
//         vehicle={null}
//       />
//    </>
//   );
// }

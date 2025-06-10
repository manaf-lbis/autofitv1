import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Clock, MapPin, Phone, Star, Wrench } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";


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





const ShowNearByMechanic = ({lat,lng}:{lat:number,lng:number}) => {
    const [selectedMechanic,setSelectedMechanic] = useState<string>()
    const [nearbyMechanics,setNearbyMechanics] = useState<any|null>(null)

    const findNearbyMechanics = ()=>{

    }

  return (
    <>
      {/* Nearby Mechanics */}
        <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">

          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-green-600" />
              </div>
              Nearby Mechanics
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="pt-4 border-t">
                <Button
                onClick={findNearbyMechanics}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                <Wrench className="w-4 h-4 mr-2" />
                Find Mechanics Nearby
                </Button>
            </div>


            <div className="max-h-96 overflow-y-auto space-y-4">

              {nearbyMechanics && nearbyMechanics.map((mechanic:any) => (
                <div
                  key={mechanic.id}
                  onClick={() =>
                    mechanic.available && setSelectedMechanic(mechanic.id)
                  }
                  className={`bg-gray-50 p-6 rounded-lg border-2 transition-all cursor-pointer relative ${
                    selectedMechanic === mechanic.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-transparent hover:border-gray-200"
                  } ${
                    !mechanic.available ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {selectedMechanic === mechanic.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={mechanic.avatar || "/placeholder.svg"}
                        alt={mechanic.name}
                        className="w-12 h-12 rounded-full object-cover bg-gray-200"
                      />
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {mechanic.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-gray-700">
                              {mechanic.rating}
                            </span>
                          </div>
                          {mechanic.available ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Available
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-700"
                            >
                              Busy
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{mechanic.address}</p>
                        <div className="flex flex-wrap gap-2">
                          {mechanic.specialties.map((specialty:any) => (
                            <span
                              key={specialty}
                              className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-sm lg:text-right lg:ml-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{mechanic.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {mechanic.responseTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">{mechanic.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </CardContent>
        </Card>
    </>
  );
};

export default ShowNearByMechanic;

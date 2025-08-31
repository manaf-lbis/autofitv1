import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StatsCards from "../../components/roadsideAssistance/StatCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ShowNearByMechanic from "@/components/shared/ShowNearByMechanic";
import { useBookEmergencyAssistanceMutation } from "../../../../services/userServices/servicesApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VehicleSelectionCard from "../../components/VehicleSelectionCard";
import LocationPicker from "../../components/LocationPicker";

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
  const [coords, setCoord] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();
  const [book, { isLoading }] = useBookEmergencyAssistanceMutation();

  const bookMechnaic = async () => {
    try {
      const { data } = await book({
        mechanicId: selectedMechanic,
        description: issueDescription,
        issue: selectedIssue,
        vehicleId: selectedVehicle,
        coordinates: coords ?? { lat: 0, lng: 0 },
      }).unwrap();
      navigate(`/user/roadside-assistance/${data.id}/details`)
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="min-h-screen mt-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm border mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                24/7 Emergency Assistance Available
              </span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
              Emergency <span className="text-blue-600 block xs:inline">Roadside Services</span>
            </h1>
            <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
              Professional roadside assistance when you need it most. Fast
              response times, expert technicians, and transparent pricing you
              can trust.
            </p>
          </div>

          {/* Stats Cards */}

          <div className="mb-8 sm:mb-12 lg:mb-20">
            <StatsCards />
          </div>

          <LocationPicker coords={coords} setCoord={setCoord} />

          {/* Nearby Mechanics */}
          {coords && (
            <ShowNearByMechanic
              lat={coords.lat}
              lng={coords.lng}
              setSelection={setSelectedMechanic}
              selectedMechanic={selectedMechanic}
            />
          )}

          <VehicleSelectionCard selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} />

          {/* Issue Selection */}
          <Card className="bg-white shadow-sm border-0 rounded-lg mb-6 sm:mb-8 sm:mx-0">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600" />
                </div>
                <span className="line-clamp-1">Describe Your Issue</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="issue-select"
                  className="text-sm sm:text-base font-medium text-gray-900"
                >
                  Select Issue Type
                </Label>
                <Select value={selectedIssue} onValueChange={setSelectedIssue}>
                  <SelectTrigger className="h-10 sm:h-12 bg-gray-50 border-0 rounded-lg text-sm sm:text-base">
                    <SelectValue placeholder="Choose the type of issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonIssues.map((issue) => (
                      <SelectItem key={issue} value={issue} className="text-sm sm:text-base">
                        {issue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="issue-description"
                  className="text-sm sm:text-base font-medium text-gray-900"
                >
                  Describe the Issue
                </Label>
                <Textarea
                  id="issue-description"
                  placeholder="Please provide detailed information about the problem you're experiencing..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  rows={3}
                  className="bg-gray-50 border-0 rounded-lg resize-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Book Service Button */}
          <div className="text-center px-2 sm:px-0">
            <Button
              onClick={bookMechnaic}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-sm w-full xs:w-auto min-h-[48px] sm:min-h-[56px]"
              disabled={
                !selectedMechanic ||
                !selectedVehicle ||
                !selectedIssue ||
                !issueDescription.trim() ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2 animate-spin flex-shrink-0" />
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">Book Mechanic Service</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
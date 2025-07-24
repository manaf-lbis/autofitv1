import { useState } from "react";
import { AlertCircle,CheckCircle,Loader2} from "lucide-react";
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
      const {data} = await book({
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
              response times, expert technicians, and transparent pricing you
              can trust.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white shadow-sm border-0 rounded-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  15min
                </div>
                <div className="text-sm text-gray-600">Average Response</div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-sm border-0 rounded-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  24/7
                </div>
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
              onClick={bookMechnaic}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-sm"
              disabled={
                !selectedMechanic ||
                !selectedVehicle ||
                !selectedIssue ||
                !issueDescription.trim() ||
                isLoading
              }
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Book Mechanic Service
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

    </>
  );
}

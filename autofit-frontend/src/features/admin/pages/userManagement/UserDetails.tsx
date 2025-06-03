import { ArrowLeft, MapPin, Car, Phone, Mail, Loader2, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserDetailsQuery, useUpdateUserStatusMutation } from "../../api/userManagement";
import { format } from "date-fns";
import { useState } from "react";

interface UserData {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  status: "active" | "blocked";
  createdAt: string;
}

interface Vehicle {
  _id: string;
  regNo: string;
  brand: string;
  modelName: string;
  fuelType: string;
  owner: string;
  isBlocked: boolean;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    userData: UserData;
    vehicles: Vehicle[];
  };
}

const UserInfoCard: React.FC<{ user: UserData; joinDate: string }> = ({ user, joinDate }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: CheckCircle,
          bgGradient: "from-emerald-50 to-green-50"
        };
      case "blocked":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
          bgGradient: "from-red-50 to-rose-50"
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Shield,
          bgGradient: "from-gray-50 to-slate-50"
        };
    }
  };

  const statusConfig = getStatusConfig(user.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${user.status === 'active' ? 'from-emerald-400 to-green-500' : 'from-red-400 to-rose-500'}`}></div>
      <CardHeader className="pb-6 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${statusConfig.bgGradient} flex items-center justify-center border-2 border-white shadow-sm`}>
              <span className="text-2xl font-bold text-gray-700">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">{user.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600">Member since {joinDate}</p>
              </div>
            </div>
          </div>
          <Badge className={`${statusConfig.color} px-3 py-1 font-medium flex items-center gap-1.5`} variant="outline">
            <StatusIcon className="h-3.5 w-3.5" />
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group p-4 rounded-xl bg-gradient-to-br border-blue-100 ">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100  transition-colors">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Phone Number</p>
                <p className="text-sm text-gray-700 font-medium">{user.mobile}</p>
              </div>
            </div>
          </div>
          <div className="group p-4 rounded-xl bg-gradient-to-br border-purple-100 ">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100  transition-colors">
                <Mail className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Address</p>
                <p className="text-sm text-gray-700 font-medium break-all">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddressesCard: React.FC = () => (
  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30 hover:shadow-xl transition-all duration-300">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 text-xl font-bold">
        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100">
          <MapPin className="h-5 w-5 text-orange-600" />
        </div>
        Addresses
      </CardTitle>
    </CardHeader>
    <CardContent className="max-h-80 overflow-y-auto">
      <div className="p-8 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-dashed border-gray-200 text-center group hover:border-gray-300 transition-colors">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-2">No addresses available</p>
        <p className="text-xs text-gray-500">User has not added any addresses yet.</p>
      </div>
    </CardContent>
  </Card>
);

const VehiclesCard: React.FC<{ vehicles: Vehicle[] }> = ({ vehicles }) => (
  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30 hover:shadow-xl transition-all duration-300">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 text-xl font-bold">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
          <Car className="h-5 w-5 text-blue-600" />
        </div>
        Vehicles
        {vehicles.length > 0 && (
          <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200">
            {vehicles.length}
          </Badge>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="max-h-80 overflow-y-auto space-y-4">
      {vehicles.length === 0 ? (
        <div className="p-8 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-dashed border-gray-200 text-center group hover:border-gray-300 transition-colors">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Car className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-2">No vehicles available</p>
          <p className="text-xs text-gray-500">User has not added any vehicles yet.</p>
        </div>
      ) : (
        vehicles.map((vehicle, index) => (
          <div key={vehicle._id} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900">
                    {vehicle.brand} - {vehicle.modelName}
                  </h4>
                </div>
                <Badge variant="outline" className="text-xs font-medium bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200">
                  {vehicle.fuelType}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Registration</p>
                  <p className="font-mono font-bold text-gray-900 text-sm">{vehicle.regNo}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Owner</p>
                  <p className="font-semibold text-gray-900 text-sm">{vehicle.owner}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </CardContent>
  </Card>
);

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useGetUserDetailsQuery(id || "", {
    skip: !id,
  });
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();

  const handleStatusUpdate = async () => {
    if (!id || !data?.data.userData) return;
    const newStatus = data.data.userData.status === "active" ? "blocked" : "active";
    try {
      await updateUserStatus({ id, status: newStatus }).unwrap();
      await refetch();
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(
        `Failed to ${newStatus === "blocked" ? "block" : "unblock"} user: ${
          err?.data?.message || "Unknown error"
        }`
      );
    }
  };

  const isLoaderActive = isUpdatingStatus || isFetching;

  if (isLoading) {
    return (
        <div className="w-full flex justify-center items-center h-screen">
           <Loader2  className="animate-spin"/> 
        </div>
      
    );
  }

  if (error || !data?.data?.userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <Card className="border-0 shadow-xl bg-white max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-600 font-medium mb-4">
              {error
                ? `Error loading user details: ${(error as any)?.data?.message || "Unknown error"}`
                : "User not found"}
            </p>
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="w-full hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = data.data.userData;
  const vehicles = data.data.vehicles || [];
  const joinDate = user.createdAt
    ? format(new Date(user.createdAt), "MMMM d, yyyy")
    : "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4  p-6  border-0">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            size="sm" 
            className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              User Details
            </h1>
            <p className="text-sm text-gray-600 mt-1">Complete user profile and activity overview</p>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-md relative" role="alert">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="flex-1 font-medium">{errorMessage}</span>
              <button
                className="text-red-500 hover:text-red-700 transition-colors"
                onClick={() => setErrorMessage(null)}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* User Info */}
        <UserInfoCard user={user} joinDate={joinDate} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Addresses */}
          <AddressesCard />

          {/* Vehicles */}
          <VehiclesCard vehicles={vehicles} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            variant={user.status === "active" ? "destructive" : "default"}
            className={`flex-1 sm:flex-none px-8 py-3 font-semibold rounded-md transition-colors duration-200 ${
            user.status === "active" 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                : "bg-green-500 hover:bg-green-600 text-white shadow-md"
            }`}
            onClick={handleStatusUpdate}
            disabled={isLoaderActive}
          >
            {isLoaderActive ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUpdatingStatus
                  ? user.status === "active"
                    ? "Blocking..."
                    : "Unblocking..."
                  : "Refreshing..."}
              </>
            ) : (
              <>
                {user.status === "active" ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Block User
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Unblock User
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
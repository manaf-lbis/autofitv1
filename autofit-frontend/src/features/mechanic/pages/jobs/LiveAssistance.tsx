import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Video, AlertCircle, CheckCircle, Phone } from "lucide-react";
import { useGetActiveCallsQuery, useMarkAsCompletedMutation } from "@/services/mechanicServices/mechanicLiveAssistanceApi";
import { VideoCallModal } from "../../../../components/shared/VideoCallModal";
import { ServiceHistory } from "../../components/jobs/ServiceHistory";
import toast from "react-hot-toast";

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
  mechanicId: string;
}

const LiveAssistance = () => {
  const { data, isFetching } = useGetActiveCallsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [markAsCompleted,{isLoading}] = useMarkAsCompletedMutation()


  const activeCall: ActiveCall | null = data?.data || null;

  const handleMarkCompleted = async () => {
    if (!activeCall) return;
    try {
      markAsCompleted({serviceId:activeCall._id}).unwrap()
    } catch (error :any) {
      toast.error(error.data.message || "Failed to mark as completed");
    } 
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Live Assistance</h1>
        <p className="text-gray-600 text-sm">Manage your live video calls and assistance requests</p>
      </div>

      {/* Active Call Section */}
      <div className="mb-8">
        <Card className="border-2 border-blue-200 bg-blue-50 rounded-xl">
          <CardContent className="p-6">
            {isFetching ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-gray-600">Loading active call...</p>
              </div>
            ) : activeCall ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{activeCall.userId.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{activeCall.userId.mobile}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm"
                      onClick={() => setIsVideoCallOpen(true)}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50 px-4 py-2 text-sm"
                      onClick={handleMarkCompleted}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-gray-500 mb-1">Started</div>
                    <div className="text-sm font-medium">{formatTime(activeCall.startTime)}</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-gray-500 mb-1">Ends</div>
                    <div className="text-sm font-medium">{formatTime(activeCall.endTime)}</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-gray-500 mb-1">Issue</div>
                    <div className="text-sm font-medium">{activeCall.issue}</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-gray-500 mb-1">Price</div>
                    <div className="text-sm font-medium">₹{activeCall.price}</div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">{activeCall.description}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24">
                <div className="flex items-center gap-2 text-gray-600">
                  <AlertCircle className="w-5 h-5" />
                  <p>No active call at the moment</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Call History */}
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">Call History</h2>
        <Card className="rounded-xl border bg-white">
          <div className="h-96">
            <ServiceHistory mode="live" />
          </div>
        </Card>
      </div>

      {/* Video Call Modal */}
      {activeCall && isVideoCallOpen && (
        <VideoCallModal
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          mechanicName={activeCall.userId.name}
          bookingTime={activeCall.startTime}
          sessionId={activeCall.sessionId}
          role="mechanic"
          userId={activeCall.mechanicId}
        />
      )}
    </div>
  );
}



export default LiveAssistance
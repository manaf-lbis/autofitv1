import type React from "react"
import { Clock, Ban, CheckCircle, FileText, Hash, Settings, User, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type IPretripSlot,  SlotStatus } from "@/types/pretrip"
import { formatTime,getTimeDuration } from "@/utils/utilityFunctions/dateUtils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface IPretripSlotDetailsModalProps {
  slot: IPretripSlot
  onClose: () => void
}

const PretripSlotDetailsModal: React.FC<IPretripSlotDetailsModalProps> = ({ slot, onClose }) => {
  
  const startDate = formatTime(new Date(slot.schedule.start))
  const endDate = formatTime(new Date(slot.schedule.end))
  const serviceDurationHours = getTimeDuration(startDate,endDate)
  const breakDurationHours = serviceDurationHours >= 3 ? 2 : 0
  const totalDurationHours = serviceDurationHours + breakDurationHours

  return (
    <>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto hide-scrollbar">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border-2",
                  slot.status === SlotStatus.BOOKED && "bg-white border-emerald-200 text-emerald-600",
                  slot.status === SlotStatus.CANCELLED && "bg-white border-rose-200 text-rose-600",
                )}
              >
                {slot.status === SlotStatus.BOOKED && <CheckCircle className="w-5 h-5" />}
                {slot.status === SlotStatus.CANCELLED && <Ban className="w-5 h-5" />}
              </div>
              Booking Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Complete information about this {slot.status.toLowerCase()} slot.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card className="bg-white border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    Schedule Information
                  </h3>
                  <Badge
                    className={cn(
                      "text-xs font-medium capitalize px-3 py-1 border",
                      slot.status === SlotStatus.BOOKED && "bg-emerald-50 text-emerald-700 border-emerald-200",
                      slot.status === SlotStatus.CANCELLED && "bg-rose-50 text-rose-700 border-rose-200",
                    )}
                  >
                    {slot.status}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {startDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Time Slot:</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {`${startDate} - 
                       ${endDate}`}
                    </span>
                  </div>
                  {breakDurationHours > 0 && (
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Break Acknowledged:</span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {breakDurationHours} hours (Total: {totalDurationHours} hours)
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {slot.status === SlotStatus.BOOKED && (
              <Card className="bg-white border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-emerald-600" />
                    </div>
                    Booking Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shadow-sm">
                        <Hash className="w-3 h-3 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Booking ID</span>
                        <p className="font-semibold text-gray-900 text-sm">{slot.bookingId || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shadow-sm">
                        <Settings className="w-3 h-3 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Service Plan</span>
                        <p className="font-semibold text-gray-900 text-sm">{slot.servicePlan?.name ?? "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {slot.status === SlotStatus.BOOKED && (
              <Card className="bg-white border-2 border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shadow-sm">
                        <User className="w-3 h-3 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Customer Name</span>
                        <p className="font-semibold text-gray-900 text-sm">{slot.userId?.name || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shadow-sm">
                        <Car className="w-3 h-3 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Vehicle</span>
                        <p className="font-semibold text-gray-900 text-sm">
                          {slot.vehicleId
                            ? `${slot.vehicleId.regNo} - ${slot.vehicleId.brand} ${slot.vehicleId.modelName}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="pt-4 border-t bg-white">
            <Button onClick={onClose} className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PretripSlotDetailsModal
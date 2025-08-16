import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, FileText, AlertTriangle, ClipboardList, Wrench, Eye, Edit3, Save, X } from "lucide-react";
import { useCreateReportMutation } from "@/services/mechanicServices/pretripMechanicApi";
import { PretripStatus } from "@/types/pretrip";

interface CheckupItem {
  _id: string;
  name: string;
  condition: "poor" | "average" | "good" | "excellent" | "";
  remarks: string;
  needsAction: boolean;
}

interface CheckupItemErrors {
  condition?: string;
}

interface ReportItem {
  feature: string;
  _id: string;
  condition?: "poor" | "average" | "good" | "excellent";
  remarks?: string;
  needsAction?: boolean;
  mechanicNotes?: string;
}

interface BookingData {
  serviceId: string;
  vehicle: { registration: string; brand: string; model: string };
  plan: { name: string; schedule: string };
  reportItems: ReportItem[];
  status?: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData;
}



export function PretripReportModal({ isOpen, onClose, bookingData }: ReportModalProps) {
  const [currentView, setCurrentView] = useState<"form" | "report">("form");
  const [checkupItems, setCheckupItems] = useState<CheckupItem[]>([]);
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [checkupErrors, setCheckupErrors] = useState<{ [key: number]: CheckupItemErrors }>({});
  const [mechanicNotesError, setMechanicNotesError] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [createReport, { isLoading }] = useCreateReportMutation();

  const isReadOnly = [PretripStatus.COMPLETED, PretripStatus.VEHICLE_RETURNED].includes(
    bookingData.status as PretripStatus
  );

  useEffect(() => {
    if (isOpen) {
      setCheckupItems(
        bookingData.reportItems.map((item) => ({
          _id: item._id,
          name: item.feature,
          condition: item.condition || "",
          remarks: item.remarks || "",
          needsAction: item.needsAction || false,
        }))
      );
      setCheckupErrors({});
      setMechanicNotesError("");
      setSaveMessage(null);
      setMechanicNotes(bookingData.reportItems[0]?.mechanicNotes || "");
      setCurrentView(isReadOnly ? "report" : "form");
    }
  }, [isOpen, bookingData.reportItems, isReadOnly]);

  const updateCheckupItem = (index: number, field: keyof CheckupItem, value: any) => {
    setCheckupItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    if (field === "condition") {
      setCheckupErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors[index]) delete newErrors[index].condition;
        return newErrors;
      });
    }
  };

  const validateCheckup = () => {
    let isValid = true;
    const newCheckupErrors: { [key: number]: CheckupItemErrors } = {};
    checkupItems.forEach((item, index) => {
      if (!item.condition) {
        newCheckupErrors[index] = { condition: "Condition is required" };
        isValid = false;
      }
    });
    setCheckupErrors(newCheckupErrors);
    if (!mechanicNotes.trim()) {
      setMechanicNotesError("Overall assessment notes are required");
      isValid = false;
    } else {
      setMechanicNotesError("");
    }
    return isValid;
  };

  const completeCheckup = () => {
    if (!validateCheckup()) return;
    setCurrentView("report");
  };

  const editReport = () => setCurrentView("form");

  const saveReport = async () => {
    setSaveMessage(null);
    try {
      await createReport({
        serviceId: bookingData.serviceId,
        report: checkupItems,
        mechanicNotes,
      }).unwrap();
      setSaveMessage("Report saved successfully");
    } catch (error: any) {
      setSaveMessage(error?.data.message || "Failed to save report");
    }
  };

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case "poor": return "bg-red-100 text-red-800 border-red-200";
      case "average": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "good": return "bg-blue-100 text-blue-800 border-blue-200";
      case "excellent": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCompletionStats = () => {
    const completed = checkupItems.filter((item) => item.condition).length;
    const total = checkupItems.length;
    const needsAttention = checkupItems.filter((item) => item.needsAction).length;
    const excellent = checkupItems.filter((item) => item.condition === "excellent").length;
    const good = checkupItems.filter((item) => item.condition === "good").length;
    const average = checkupItems.filter((item) => item.condition === "average").length;
    const poor = checkupItems.filter((item) => item.condition === "poor").length;
    return { completed, total, needsAttention, excellent, good, average, poor };
  };

  const handleClose = () => {
    setCurrentView("form");
    setCheckupItems([]);
    setMechanicNotes("");
    setCheckupErrors({});
    setMechanicNotesError("");
    setSaveMessage(null);
    onClose();
  };

  if (currentView === "report" || isReadOnly) {
    const stats = getCompletionStats();

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 rounded-none sm:max-w-6xl sm:h-[95vh] sm:max-h-[95vh] sm:rounded-lg sm:m-auto overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
            <div className="flex items-center gap-3">
              {!isReadOnly && (
                <Button variant="ghost" size="sm" onClick={editReport} className="p-2" aria-label="Edit report">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  Inspection Report
                </DialogTitle>
                <p className="text-sm text-gray-600 truncate">
                  {bookingData.vehicle.registration} • {bookingData.plan.name}
                </p>
              </div>
              <div className="flex gap-2">
                {!isReadOnly && (
                  <>
                    <Button variant="outline" size="sm" onClick={editReport} className="hidden sm:flex bg-transparent" aria-label="Edit report">
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" onClick={saveReport} disabled={isLoading} className="bg-green-600 hover:bg-green-700" aria-label="Save report">
                      {isLoading ? "Saving..." : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Save Report</span>
                          <span className="sm:hidden">Save</span>
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
            {saveMessage && (
              <div className={`mt-2 text-center text-sm ${saveMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                {saveMessage}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                      Service Report Summary
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Completed on {new Date().toLocaleDateString("en-IN")} at {bookingData.plan.schedule}
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {stats.completed}/{stats.total}
                    </div>
                    <div className="text-xs text-gray-500">Items Checked</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm sm:text-lg font-semibold text-green-700">{stats.excellent}</div>
                    <div className="text-xs text-green-600">Excellent</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm sm:text-lg font-semibold text-blue-700">{stats.good}</div>
                    <div className="text-xs text-blue-600">Good</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-sm sm:text-lg font-semibold text-yellow-700">{stats.average}</div>
                    <div className="text-xs text-yellow-600">Average</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-sm sm:text-lg font-semibold text-red-700">{stats.poor}</div>
                    <div className="text-xs text-red-600">Poor</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200 col-span-full sm:col-span-2">
                    <div className="text-sm sm:text-lg font-semibold text-orange-700">{stats.needsAttention}</div>
                    <div className="text-xs text-orange-600">Needs Attention</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                  Detailed Inspection
                </h3>
                {checkupItems.map((item) => (
                  <div key={item._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors bg-white">
                    <div className="flex flex-col gap-2 mb-3">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</h4>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        {item.condition && (
                          <Badge className={`text-xs border ${getConditionBadgeColor(item.condition)}`}>
                            {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                          </Badge>
                        )}
                        {item.needsAction && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Action Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    {item.remarks && (
                      <div className="bg-gray-50 rounded-md p-2 sm:p-3 mt-2">
                        <p className="text-xs sm:text-sm text-gray-700">{item.remarks}</p>
                      </div>
                    )}
                  </div>
                ))}
                {mechanicNotes && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                      Mechanic's Overall Assessment
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">{mechanicNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 rounded-none sm:max-w-6xl sm:h-[95vh] sm:max-h-[95vh] sm:rounded-lg sm:m-auto overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleClose} className="p-2 sm:hidden" aria-label="Close modal">
              <X className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                <span className="truncate">Vehicle Inspection</span>
              </DialogTitle>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {bookingData.vehicle.registration} • {bookingData.vehicle.brand} {bookingData.vehicle.model} • {bookingData.plan.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Inspection Checklist</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Rate each item and mark if action is needed</p>
              {checkupItems.map((item, index) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3 bg-white">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Condition *</label>
                      <Select value={item.condition} onValueChange={(value) => updateCheckupItem(index, "condition", value)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      {checkupErrors[index]?.condition && (
                        <p className="text-red-500 text-xs mt-1">{checkupErrors[index].condition}</p>
                      )}
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="flex items-center space-x-2 h-9">
                        <Checkbox
                          id={`needs-action-${item._id}`}
                          checked={item.needsAction}
                          onCheckedChange={(checked) => updateCheckupItem(index, "needsAction", checked)}
                        />
                        <label htmlFor={`needs-action-${item._id}`} className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
                          Action Required
                        </label>
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Remarks</label>
                      <Textarea
                        placeholder="Add remarks (optional)"
                        value={item.remarks}
                        onChange={(e) => updateCheckupItem(index, "remarks", e.target.value)}
                        className="min-h-[36px] text-sm resize-none"
                        rows={1}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-blue-600" />
                Overall Assessment *
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <Textarea
                  placeholder="Provide your overall assessment and recommendations..."
                  value={mechanicNotes}
                  onChange={(e) => {
                    setMechanicNotes(e.target.value);
                    setMechanicNotesError("");
                  }}
                  className="min-h-[80px] sm:min-h-[100px] text-sm"
                  required
                />
                {mechanicNotesError && <p className="text-red-500 text-xs mt-1">{mechanicNotesError}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6">
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1 text-sm bg-transparent" aria-label="Cancel">
              Cancel
            </Button>
            <Button onClick={completeCheckup} className="flex-1 bg-green-600 hover:bg-green-700 text-sm" aria-label="Preview report">
              <Eye className="h-4 w-4 mr-2" />
              Preview Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
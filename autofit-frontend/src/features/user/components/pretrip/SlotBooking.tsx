import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Calendar, CheckCircle, MapPin, Star, Wrench, Info } from "lucide-react";
import { TimePicker } from "./TimePicker";
import { useGetNearbyMechanicShopsQuery } from "@/services/userServices/pretripUserApi";
import { generateStartTimeOptions, formatDisplayTime, calculateServiceCompletion, timeToMinutes } from "../../utils/timeSlotUtils";
import { ReviewListingModal } from "@/components/shared/rating/ReviewListingModal";

interface TimeWindow {
  start: string;
  end: string;
}

interface MechanicData {
  mechanicId: string;
  shopName: string;
  distanceInMeters: number;
  place: string;
  specialised: string;
  availableWindows: { [date: string]: TimeWindow[] };
  rating?: {
    avg: number;
    review: number;
    _id: string;
  }
}

interface Props {
  selectedMechanic: string;
  setSelectedMechanic: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSlot: React.Dispatch<React.SetStateAction<string>>;
  coords: { lat: number; lng: number };
  durationMinutes: number;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

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

const createCombinedWindow = (windows: TimeWindow[]): TimeWindow | null => {
  if (!windows || windows.length === 0) return null;
  const sortedWindows = [...windows].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
  return {
    start: sortedWindows[0].start,
    end: sortedWindows[sortedWindows.length - 1].end,
  };
};

const SlotBooking: React.FC<Props> = ({
  selectedMechanic,
  setSelectedMechanic,
  setSelectedSlot,
  coords,
  durationMinutes,
  selectedDate,
  setSelectedDate
}) => {
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");

  const { data: mechanics, isLoading } = useGetNearbyMechanicShopsQuery(coords, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true
  });

  const formattedMechanics = useMemo(() => {
    return mechanics?.map((mechanic: MechanicData) => ({
      mechanicId: mechanic.mechanicId,
      name: mechanic.shopName,
      distance: `${(mechanic.distanceInMeters / 1000).toFixed(1)} km`,
      place: mechanic.place,
      specialization: mechanic.specialised,
      availableWindows: mechanic.availableWindows,
      rating: mechanic?.rating
    })) || [];
  }, [mechanics]);

  const currentMechanicData = useMemo(() => {
    return formattedMechanics.find((m) => m.mechanicId === selectedMechanic) || null;
  }, [formattedMechanics, selectedMechanic]);

  const mechanicsWithAvailability = useMemo(() => {
    if (durationMinutes === 0) return [];
    return formattedMechanics.filter((mechanic) => {
      for (const day of getNext7Days()) {
        const windowsForDay = mechanic.availableWindows[day.date] || [];
        const startTimeOptions = generateStartTimeOptions(windowsForDay, durationMinutes, day.date);
        if (startTimeOptions.length > 0) return true;
      }
      return false;
    });
  }, [formattedMechanics, durationMinutes]);

  const hasAnyMechanicWithSlots = mechanicsWithAvailability.length > 0;

  const availableWindowsForSelectedDate = useMemo(() => {
    if (!selectedMechanic || !selectedDate || !currentMechanicData) return [];
    return currentMechanicData.availableWindows[selectedDate] || [];
  }, [selectedMechanic, selectedDate, currentMechanicData]);

  const combinedWindowForTimePicker = useMemo(() => {
    return createCombinedWindow(availableWindowsForSelectedDate);
  }, [availableWindowsForSelectedDate]);

  const selectedStartTimeDetails = useMemo(() => {
    if (!selectedStartTime || !availableWindowsForSelectedDate.length) return null;
    const completion = calculateServiceCompletion(selectedStartTime, durationMinutes, availableWindowsForSelectedDate);
    return {
      startTime: selectedStartTime,
      completion,
    };
  }, [selectedStartTime, durationMinutes, availableWindowsForSelectedDate]);

  useEffect(() => {
    setSelectedDate("");
    setSelectedStartTime("");
    setSelectedSlot("");
  }, [selectedMechanic, durationMinutes, setSelectedSlot, setSelectedDate]);

  useEffect(() => {
    setSelectedStartTime("");
    setSelectedSlot("");
  }, [selectedDate, setSelectedSlot]);

  useEffect(() => {
    if (selectedStartTimeDetails?.completion.canComplete) {
      setSelectedSlot(`${selectedStartTimeDetails.startTime}-${selectedStartTimeDetails.completion.endTime}`);
    } else {
      setSelectedSlot("");
    }
  }, [selectedStartTimeDetails, setSelectedSlot]);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-8">
      <Card className="bg-white shadow-sm border-0 rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <span className="font-bold">Available Service Centers</span>
            </div>
            {hasAnyMechanicWithSlots && (
              <span className="text-xs sm:text-sm text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full font-medium">
                {mechanicsWithAvailability.length} centers available
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading service centers...</p>
            </div>
          ) : !hasAnyMechanicWithSlots ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Service Centers Available</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base max-w-md mx-auto">
                No service centers have available slots for this duration at this location right now.
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                <p>• Try a different location</p>
                <p>• Check back later</p>
                <p>• Contact support</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {formattedMechanics.map((mechanic) => {
                const hasAvailability = mechanicsWithAvailability.some((m) => m.mechanicId === mechanic.mechanicId);
                return (
                  <div
                    key={mechanic.mechanicId}
                    onClick={() => hasAvailability && setSelectedMechanic(mechanic.mechanicId)}
                    className={`p-4 sm:p-6 rounded-lg border-2 transition-all duration-200 relative ${!hasAvailability
                      ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                      : selectedMechanic === mechanic.mechanicId
                        ? "border-blue-600 bg-blue-50 shadow-md cursor-pointer hover:bg-blue-100"
                        : "border-gray-200 bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-100"
                      }`}
                  >
                    {selectedMechanic === mechanic.mechanicId && hasAvailability && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      </div>
                    )}
                    {!hasAvailability && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">No Slots</div>
                      </div>
                    )}
                    <div className="space-y-3 pr-16 sm:pr-20">
                      <div>
                        <div className="flex align-center  gap-2 sm:gap-3">
                          <h3 className={`font-bold uppercase text-sm sm:text-md mb-1 sm:mb-2 ${hasAvailability ? "text-gray-900" : "text-gray-500"}`}>
                            {mechanic.name}
                          </h3>
                          <ReviewListingModal mechanic={{
                            avatarUrl:  "" ,
                            name: mechanic.name,
                            averageRating: mechanic.rating?.avg || 0,
                            id: mechanic.mechanicId,
                            reviewsCount: mechanic.rating?.review || 0
                          }}
                          triggerClassName="text-xs sm:text-sm text-blue-600  w-3 h-3"
                          
                          />
                        </div>

                        <p className={`font-medium text-xs sm:text-sm ${hasAvailability ? "text-blue-600" : "text-gray-400"}`}>
                          {mechanic.specialization}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs sm:text-sm ${hasAvailability ? "bg-yellow-50" : "bg-gray-100"}`}>
                          <Star
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${hasAvailability ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
                              }`}
                          />
                          <span className={`font-medium ${hasAvailability ? "text-gray-900" : "text-gray-400"}`}>
                            {mechanic.rating?.avg?.toFixed(1)}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs sm:text-sm ${hasAvailability ? "bg-gray-50" : "bg-gray-100"
                            }`}
                        >
                          <MapPin
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${hasAvailability ? "text-gray-500" : "text-gray-300"}`}
                          />
                          <span className={`font-medium ${hasAvailability ? "text-gray-900" : "text-gray-400"}`}>
                            {mechanic.distance}
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded text-xs sm:text-sm font-medium ${hasAvailability ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-400"
                            }`}
                        >
                          {mechanic.place}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedMechanic && currentMechanicData && (
        <Card className="bg-white shadow-sm border-0 rounded-lg sm:rounded-xl">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-lg sm:text-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold block sm:inline">Select Date & Start Time</span>
                <span className="text-sm sm:text-base text-gray-600 block sm:inline sm:ml-2">
                  (Duration: {durationMinutes / 60} hr{durationMinutes / 60 > 1 ? "s" : ""})
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            <div className="space-y-3">
              <h4 className="text-sm sm:text-base font-medium text-gray-900">Choose Date</h4>
              <div className="flex overflow-x-auto pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6 no-scrollbar">
                <style>{`
                  .no-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                  .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}</style>
                <div className="flex gap-2 sm:gap-3 w-max">
                  {getNext7Days().map((day) => {
                    const windowsForDay = currentMechanicData.availableWindows[day.date] || [];
                    const startTimeOptions = generateStartTimeOptions(windowsForDay, durationMinutes, day.date);
                    const hasOptions = startTimeOptions.length > 0;

                    return (
                      <div
                        key={day.date}
                        onClick={() => hasOptions && setSelectedDate(day.date)}
                        className={`flex-shrink-0 w-24 sm:w-28 p-2 sm:p-3 rounded-lg border-2 text-center transition-all duration-200 ${!hasOptions
                          ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
                          : selectedDate === day.date
                            ? "border-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100"
                            : "border-gray-200 bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-100"
                          }`}
                      >
                        <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                        <div
                          className={`font-semibold text-sm sm:text-base ${hasOptions ? "text-gray-900" : "text-gray-400"}`}
                        >
                          {day.dayNum}
                        </div>
                        <div className="text-xs text-gray-600">{day.month}</div>
                        {hasOptions ? (
                          <div className="text-xs text-blue-600 mt-1">
                            {startTimeOptions.length} {startTimeOptions.length === 1 ? "option" : "options"}
                          </div>
                        ) : (
                          <div className="text-xs text-red-600 mt-1">No slots</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {selectedDate && availableWindowsForSelectedDate.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-medium text-gray-900">Available Time Windows</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Service center is open during these exact times:</p>
                      <div className="space-y-1">
                        {availableWindowsForSelectedDate.map((window, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                            <span>
                              {formatDisplayTime(window.start)} - {formatDisplayTime(window.end)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {availableWindowsForSelectedDate.length > 1 && (
                        <p className="mt-2 text-xs text-blue-600">
                          Your service may span across multiple windows with breaks in between.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedDate && combinedWindowForTimePicker && (
              <div className="space-y-3">
                <TimePicker
                  availableWindow={combinedWindowForTimePicker}
                  durationMinutes={durationMinutes}
                  selectedTime={selectedStartTime}
                  onTimeSelect={setSelectedStartTime}
                  selectedDate={selectedDate}
                  availableWindows={availableWindowsForSelectedDate}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SlotBooking;
// import { useState } from 'react';
// import { Calendar, Clock, Plus, Trash2, ChevronLeft, ChevronRight, Save, X, Ban, Loader2, RefreshCw, CheckCircle, AlertCircle, Timer } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { TimeSlot, IPretripSlot, SlotStatus } from '@/types/pretrip';
// import { formatTime, getAvailableTimeSlots, getDateString } from '@/utils/utilityFunctions/dateUtils';
// import { useGetSlotsQuery, useCreateSlotsMutation, useDeleteSlotMutation } from '@/services/mechanicServices/pretripMechanicApi';
// import ScheduleManagementShimer from '../shimmer/jobs/ScheduleManagementShimer';

// export function ScheduleManagement() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [showSlotModal, setShowSlotModal] = useState(false);
//   const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
//   const [slotStatusFilter, setSlotStatusFilter] = useState<'all' | SlotStatus>('all');
//   const [creating, setCreating] = useState(false);
//   const [errors, setErrors] = useState<{ times?: string; general?: string }>({});
//   const [slotLoading, setSlotLoading] = useState<{ [key: string]: boolean }>({}); 

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const { data: slotsForWeek = [], isLoading, refetch } = useGetSlotsQuery();
//   const [createSlots] = useCreateSlotsMutation();
//   const [deleteSlot] = useDeleteSlotMutation();

//   const transformSlots = (slots: IPretripSlot[] | undefined): TimeSlot[] =>
//     slots?.map((slot) => ({
//       id: slot._id,
//       date: new Date(slot.date),
//       status: slot.status,
//     })) || [];

//   const allSlots = transformSlots(slotsForWeek);
//   const selectedDateSlots = allSlots.filter((slot) => getDateString(slot.date) === getDateString(selectedDate));
//   const filteredSlots = slotStatusFilter === 'all' ? selectedDateSlots : selectedDateSlots.filter((slot) => slot.status === slotStatusFilter);
//   const availableTimeSlots = getAvailableTimeSlots(selectedDate);

//   const isValidDate = (date: Date): boolean => {
//     const checkDate = new Date(date);
//     checkDate.setHours(0, 0, 0, 0);
//     return checkDate >= today && checkDate <= new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
//   };

//   const isTimeSlotAvailable = (time: string): boolean => {
//     const dateString = getDateString(selectedDate);
//     const existingSlots = allSlots.filter((slot) => getDateString(slot.date) === dateString);
//     const [hours, minutes] = time.split(':').map(Number);
//     const newTime = new Date(selectedDate);
//     newTime.setHours(hours, minutes, 0, 0);
//     const slotDuration = 2 * 60 * 60 * 1000;
//     return !existingSlots.some((slot) => {
//       const slotStart = slot.date.getTime();
//       const slotEnd = slotStart + slotDuration;
//       const newStart = newTime.getTime();
//       const newEnd = newStart + slotDuration;
//       return (newStart >= slotStart && newStart < slotEnd) || (newStart < slotStart && newEnd > slotStart);
//     });
//   };

//   const handleTimeSelection = (time: string) => {
//     if (isTimeSlotAvailable(time)) {
//       setSelectedTimes((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time].sort()));
//     }
//   };

//   const validateSlots = (): boolean => {
//     const newErrors = selectedTimes.length === 0 ? { times: 'Please select at least one time slot' } : {};
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAddSlots = async () => {
//     if (!validateSlots() || !isValidDate(selectedDate)) {
//       setErrors({ general: 'Cannot create slots for past or beyond 7 days' });
//       return;
//     }
//     setCreating(true);
//     try {
//       await createSlots({
//         slots: selectedTimes.map((time) => {
//           const [hours, minutes] = time.split(':').map(Number);
//           const slotDate = new Date(selectedDate);
//           slotDate.setHours(hours, minutes, 0, 0);
//           return { date: slotDate.toISOString() };
//         }),
//       }).unwrap();
//       setSelectedTimes([]);
//       setErrors({});
//       setShowSlotModal(false);
//     } catch {
//       setErrors({ general: 'Failed to create slots. Please try again.' });
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleDeleteSlot = async (slotId: string) => {
//     const slot = allSlots.find((s) => s.id === slotId);
//     if (!slot || slot.status === SlotStatus.BOOKED) return;
//     setSlotLoading((prev) => ({ ...prev, [slotId]: true })); 
//     try {
//       await deleteSlot(slotId).unwrap();
//       setSlotLoading((prev) => ({ ...prev, [slotId]: false })); 
//     } catch {
//       setErrors({ general: 'Failed to delete slot' });
//       setSlotLoading((prev) => ({ ...prev, [slotId]: false })); 
//     }
//   };

//   const calendarDays = () => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const startDate = new Date(firstDay);
//     startDate.setDate(startDate.getDate() - firstDay.getDay());
//     const days = [];
//     for (let i = 0; i < 42; i++) {
//       const checkDate = new Date(startDate);
//       checkDate.setDate(startDate.getDate() + i);
//       days.push({
//         date: checkDate,
//         isCurrentMonth: checkDate.getMonth() === month,
//         isToday: checkDate.toDateString() === today.toDateString(),
//         isSelected: checkDate.toDateString() === selectedDate.toDateString(),
//         isValid: isValidDate(checkDate),
//       });
//     }
//     return days;
//   };

//   if (isLoading) return <ScheduleManagementShimer />;

//   return (
//     <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
//       <div className="xl:col-span-1">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="p-3 border-b border-gray-100 bg-gray-50">
//             <div className="flex items-center justify-between">
//               <h3 className="font-semibold text-gray-900 text-sm">Calendar</h3>
//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
//                   disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </Button>
//                 <span className="text-xs font-medium min-w-[80px] text-center">
//                   {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
//                 </span>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
//                   disabled={
//                     currentMonth.getMonth() ===
//                       new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).getMonth() &&
//                     currentMonth.getFullYear() ===
//                       new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).getFullYear()
//                   }
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="p-3">
//             <div className="grid grid-cols-7 gap-1 mb-2">
//               {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
//                 <div key={`${day}-${index}`} className="text-center text-xs font-semibold text-gray-500 py-1">
//                   {day}
//                 </div>
//               ))}
//             </div>
//             <div className="grid grid-cols-7 gap-1">
//               {calendarDays().map((day, index) => (
//                 <button
//                   key={index}
//                   onClick={() => day.isValid && setSelectedDate(day.date)}
//                   disabled={!day.isValid}
//                   className={cn(
//                     'aspect-square p-1 text-xs rounded-lg relative font-medium transition-colors',
//                     !day.isCurrentMonth && 'text-gray-300',
//                     !day.isValid && 'text-gray-300 cursor-not-allowed bg-gray-50',
//                     day.isCurrentMonth && day.isValid && 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
//                     day.isToday && !day.isSelected && 'bg-blue-100 text-blue-700 ring-2 ring-blue-200',
//                     day.isSelected && 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
//                   )}
//                 >
//                   {day.date.getDate()}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="xl:col-span-3">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="p-4 border-b border-gray-100 bg-gray-50">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {selectedDate.toLocaleDateString('en-US', {
//                     weekday: 'long',
//                     month: 'long',
//                     day: 'numeric',
//                   })}
//                 </h3>
//                 <div className="flex items-center gap-4 mt-1">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                     <span className="text-xs text-gray-600">
//                       {selectedDateSlots.filter((slot) => slot.status === SlotStatus.AVAILABLE).length} Available
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                     <span className="text-xs text-gray-600">
//                       {selectedDateSlots.filter((slot) => slot.status === SlotStatus.BOOKED).length} Booked
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                     <span className="text-xs text-gray-600">
//                       {selectedDateSlots.filter((slot) => slot.status === SlotStatus.CANCELLED).length} Cancelled
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <div className="flex gap-1">
//                   <Button
//                     variant={slotStatusFilter === 'all' ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setSlotStatusFilter('all')}
//                     className="text-xs h-7 px-2"
//                   >
//                     All
//                   </Button>
//                   <Button
//                     variant={slotStatusFilter === SlotStatus.AVAILABLE ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setSlotStatusFilter(SlotStatus.AVAILABLE)}
//                     className="text-xs h-7 px-2"
//                   >
//                     Available
//                   </Button>
//                   <Button
//                     variant={slotStatusFilter === SlotStatus.BOOKED ? 'default' : 'outline'}
//                     size="sm"
//                     onClick={() => setSlotStatusFilter(SlotStatus.BOOKED)}
//                     className="text-xs h-7 px-2"
//                   >
//                     Booked
//                   </Button>
//                 </div>
//                 <Button
//                   variant="outline"
//                   onClick={() => refetch()}
//                   disabled={isLoading}
//                   className="h-7 px-2 bg-transparent"
//                   size="sm"
//                 >
//                   <RefreshCw className={cn('w-3 h-3', isLoading && 'animate-spin')} />
//                 </Button>
//                 {isValidDate(selectedDate) && availableTimeSlots.length > 0 && (
//                   <Button onClick={() => setShowSlotModal(true)} className="h-7 px-2" size="sm">
//                     <Plus className="w-3 h-3 mr-1" />
//                     Add
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="p-4">
//             {!isValidDate(selectedDate) ? (
//               <div className="text-center py-8">
//                 <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <h4 className="text-base font-medium text-gray-900 mb-1">Invalid Date Selected</h4>
//                 <p className="text-gray-500 text-sm">Cannot manage slots for past or beyond 7 days</p>
//               </div>
//             ) : availableTimeSlots.length === 0 ? (
//               <div className="text-center py-8">
//                 <Timer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <h4 className="text-base font-medium text-gray-900 mb-1">No Available Time Slots</h4>
//                 <p className="text-gray-500 text-sm">All time slots for today have passed</p>
//               </div>
//             ) : filteredSlots.length === 0 ? (
//               <div className="text-center py-8">
//                 <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <h4 className="text-base font-medium text-gray-900 mb-1">
//                   {slotStatusFilter === 'all' ? 'No Slots Created' : `No ${slotStatusFilter} Slots`}
//                 </h4>
//                 <p className="text-gray-500 mb-4 text-sm">
//                   {slotStatusFilter === 'all'
//                     ? 'Create your first slot for this date'
//                     : `No ${slotStatusFilter} slots found for this date`}
//                 </p>
//                 {slotStatusFilter === 'all' && (
//                   <Button onClick={() => setShowSlotModal(true)} className="shadow-sm">
//                     <Plus className="w-4 h-4 mr-2" />
//                     Create First Slot
//                   </Button>
//                 )}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
//                 {filteredSlots.map((slot) => (
//                   <div
//                     key={slot.id}
//                     className={cn(
//                       'p-3 rounded-lg border-2 transition-all hover:shadow-md',
//                       slot.status === SlotStatus.AVAILABLE && 'bg-green-50 border-green-200 hover:border-green-300',
//                       slot.status === SlotStatus.BOOKED && 'bg-blue-50 border-blue-200 hover:border-blue-300',
//                       slot.status === SlotStatus.CANCELLED && 'bg-red-50 border-red-200 hover:border-red-300'
//                     )}
//                   >
//                     <div className="flex items-start justify-between mb-3">
//                       <div className="flex items-center gap-2">
//                         <div
//                           className={cn(
//                             'w-10 h-10 rounded-lg flex items-center justify-center shadow-sm',
//                             slot.status === SlotStatus.AVAILABLE && 'bg-green-100 text-green-600',
//                             slot.status === SlotStatus.BOOKED && 'bg-blue-100 text-blue-600',
//                             slot.status === SlotStatus.CANCELLED && 'bg-red-100 text-red-600'
//                           )}
//                         >
//                           {slot.status === SlotStatus.AVAILABLE && <Clock className="w-5 h-5" />}
//                           {slot.status === SlotStatus.BOOKED && <CheckCircle className="w-5 h-5" />}
//                           {slot.status === SlotStatus.CANCELLED && <Ban className="w-5 h-5" />}
//                         </div>
//                         <div>
//                           <p className="text-lg font-bold text-gray-900">{formatTime(slot.date)}</p>
//                           <p className="text-xs text-gray-600">2 hours</p>
//                         </div>
//                       </div>
//                       <Badge
//                         className={cn(
//                           'text-xs font-medium shadow-sm capitalize',
//                           slot.status === SlotStatus.AVAILABLE && 'bg-green-100 text-green-800 hover:bg-green-100',
//                           slot.status === SlotStatus.BOOKED && 'bg-blue-100 text-blue-800 hover:bg-blue-100',
//                           slot.status === SlotStatus.CANCELLED && 'bg-red-100 text-red-800 hover:bg-red-100'
//                         )}
//                       >
//                         {slot.status}
//                       </Badge>
//                     </div>
//                     {slot.status === SlotStatus.AVAILABLE && (
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
//                         onClick={() => handleDeleteSlot(slot.id)}
//                         disabled={isLoading || slotLoading[slot.id]} // Use per-slot loading
//                       >
//                         {slotLoading[slot.id] ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Trash2 className="w-3 h-3 mr-1" />}
//                         Delete
//                       </Button>
//                     )}
//                     {slot.status === SlotStatus.CANCELLED && (
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
//                         onClick={() => handleDeleteSlot(slot.id)}
//                         disabled={isLoading || slotLoading[slot.id]} // Use per-slot loading
//                       >
//                         {slotLoading[slot.id] ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Trash2 className="w-3 h-3 mr-1" />}
//                         Remove
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {showSlotModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-4 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-900">Add Time Slots</h3>
//                 <button
//                   onClick={() => {
//                     setShowSlotModal(false);
//                     setSelectedTimes([]);
//                     setErrors({});
//                   }}
//                   className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
//                   disabled={creating}
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-4">
//               {errors.general && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
//                   <p className="text-sm text-red-600">{errors.general}</p>
//                 </div>
//               )}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Select Time Slots ({selectedTimes.length} selected)
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {availableTimeSlots.map((time) => {
//                       const isAvailable = isTimeSlotAvailable(time),
//                         isSelected = selectedTimes.includes(time);
//                       const [hours, minutes] = time.split(':').map(Number);
//                       const slotDate = new Date(selectedDate);
//                       slotDate.setHours(hours, minutes, 0, 0);
//                       return (
//                         <button
//                           key={time}
//                           type="button"
//                           onClick={() => handleTimeSelection(time)}
//                           disabled={!isAvailable || creating}
//                           className={cn(
//                             'p-3 rounded-lg border-2 text-center relative transition-all',
//                             isSelected && 'border-blue-500 bg-blue-50 text-blue-700 shadow-md',
//                             !isSelected && isAvailable && 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
//                             !isAvailable && 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed',
//                             creating && 'opacity-50 cursor-not-allowed'
//                           )}
//                         >
//                           <div className="font-bold text-base">{formatTime(slotDate)}</div>
//                           <div className="text-xs text-gray-500 mt-1">2 hours</div>
//                           {!isAvailable && <div className="text-xs text-red-500 mt-1">Unavailable</div>}
//                           {isSelected && (
//                             <div className="absolute top-2 right-2">
//                               <CheckCircle className="w-4 h-4 text-blue-600" />
//                             </div>
//                           )}
//                         </button>
//                       );
//                     })}
//                   </div>
//                   {errors.times && (
//                     <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
//                       <AlertCircle className="w-3 h-3 flex-shrink-0" />
//                       {errors.times}
//                     </p>
//                   )}
//                 </div>
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                   <div className="flex items-start gap-3">
//                     <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
//                       <AlertCircle className="w-3 h-3 text-blue-600" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-blue-900 mb-1">Universal Booking</p>
//                       <p className="text-sm text-blue-800">
//                         Any service type can be booked in these slots. Customers choose their plan when booking.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex gap-3 mt-6">
//                 <Button
//                   onClick={handleAddSlots}
//                   className="flex-1"
//                   disabled={selectedTimes.length === 0 || creating}
//                 >
//                   {creating ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4 mr-2" />
//                       Create {selectedTimes.length} Slot{selectedTimes.length !== 1 ? 's' : ''}
//                     </>
//                   )}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowSlotModal(false);
//                     setSelectedTimes([]);
//                     setErrors({});
//                   }}
//                   className="flex-1"
//                   disabled={creating}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, ChevronLeft, ChevronRight, Save, X, Ban, Loader2, RefreshCw, CheckCircle, AlertCircle, Timer, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { IPretripSlot, SlotStatus } from '@/types/pretrip';
import { formatTime, getAvailableTimeSlots, getDateString } from '@/utils/utilityFunctions/dateUtils';
import { useGetSlotsQuery, useCreateSlotsMutation, useDeleteSlotMutation } from '@/services/mechanicServices/pretripMechanicApi';
import ScheduleManagementShimer from '../shimmer/jobs/ScheduleManagementShimer';
import { Separator } from '@/components/ui/separator';

export function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  // Extended filter to include 'blocked'
  const [slotStatusFilter, setSlotStatusFilter] = useState<'all' | SlotStatus | 'blocked'>('all');
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<{ times?: string; general?: string }>({});
  const [slotLoading, setSlotLoading] = useState<{ [key: string]: boolean }>({});
  // State for the details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<IPretripSlot | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: slotsForWeek = [], isLoading, refetch } = useGetSlotsQuery();
  const [createSlots] = useCreateSlotsMutation();
  const [deleteSlot] = useDeleteSlotMutation();

  // Use full IPretripSlot data directly, no transformation to TimeSlot
  const allSlots: IPretripSlot[] = slotsForWeek || [];
  const selectedDateSlots = allSlots.filter((slot) => getDateString(new Date(slot.date)) === getDateString(selectedDate));
  // Updated filter logic to handle 'blocked'
  const filteredSlots = slotStatusFilter === 'all'
    ? selectedDateSlots
    : slotStatusFilter === 'blocked'
      ? selectedDateSlots.filter((slot) => slot.status === 'blocked')
      : selectedDateSlots.filter((slot) => slot.status === slotStatusFilter);
  const availableTimeSlots = getAvailableTimeSlots(selectedDate);

  const isValidDate = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= today && checkDate <= new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
  };

  const isTimeSlotAvailable = (time: string): boolean => {
    const dateString = getDateString(selectedDate);
    const existingSlots = allSlots.filter((slot) => getDateString(new Date(slot.date)) === dateString);
    const [hours, minutes] = time.split(':').map(Number);
    const newTime = new Date(selectedDate);
    newTime.setHours(hours, minutes, 0, 0);
    const slotDuration = 2 * 60 * 60 * 1000;
    return !existingSlots.some((slot) => {
      const slotStart = new Date(slot.date).getTime();
      const slotEnd = slotStart + slotDuration;
      const newStart = newTime.getTime();
      const newEnd = newStart + slotDuration;
      return (newStart >= slotStart && newStart < slotEnd) || (newStart < slotStart && newEnd > slotStart);
    });
  };

  const handleTimeSelection = (time: string) => {
    if (isTimeSlotAvailable(time)) {
      setSelectedTimes((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time].sort()));
    }
  };

  const validateSlots = (): boolean => {
    const newErrors = selectedTimes.length === 0 ? { times: 'Please select at least one time slot' } : {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSlots = async () => {
    if (!validateSlots() || !isValidDate(selectedDate)) {
      setErrors({ general: 'Cannot create slots for past or beyond 7 days' });
      return;
    }
    setCreating(true);
    try {
      await createSlots({
        slots: selectedTimes.map((time) => {
          const [hours, minutes] = time.split(':').map(Number);
          const slotDate = new Date(selectedDate);
          slotDate.setHours(hours, minutes, 0, 0);
          return { date: slotDate.toISOString() };
        }),
      }).unwrap();
      setSelectedTimes([]);
      setErrors({});
      setShowSlotModal(false);
    } catch {
      setErrors({ general: 'Failed to create slots. Please try again.' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    const slot = allSlots.find((s) => s._id === slotId);
    if (!slot || slot.status === SlotStatus.BOOKED) return;
    setSlotLoading((prev) => ({ ...prev, [slotId]: true }));
    try {
      await deleteSlot(slotId).unwrap();
    } catch {
      setErrors({ general: 'Failed to delete slot' });
    } finally {
      setSlotLoading((prev) => ({ ...prev, [slotId]: false }));
    }
  };

  const calendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    for (let i = 0; i < 42; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      days.push({
        date: checkDate,
        isCurrentMonth: checkDate.getMonth() === month,
        isToday: checkDate.toDateString() === today.toDateString(),
        isSelected: checkDate.toDateString() === selectedDate.toDateString(),
        isValid: isValidDate(checkDate),
      });
    }
    return days;
  };

  if (isLoading) return <ScheduleManagementShimer />;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Calendar</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs font-medium min-w-[80px] text-center">
                  {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  disabled={
                    currentMonth.getMonth() === new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).getMonth() &&
                    currentMonth.getFullYear() === new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).getFullYear()
                  }
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={`${day}-${index}`} className="text-center text-xs font-semibold text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays().map((day, index) => (
                <button
                  key={index}
                  onClick={() => day.isValid && setSelectedDate(day.date)}
                  disabled={!day.isValid}
                  className={cn(
                    'aspect-square p-1 text-xs rounded-lg relative font-medium transition-colors',
                    !day.isCurrentMonth && 'text-gray-300',
                    !day.isValid && 'text-gray-300 cursor-not-allowed bg-gray-50',
                    day.isCurrentMonth && day.isValid && 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
                    day.isToday && !day.isSelected && 'bg-blue-100 text-blue-700 ring-2 ring-blue-200',
                    day.isSelected && 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-300'
                  )}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="xl:col-span-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                {/* Added summary for blocked slots */}
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">
                      {selectedDateSlots.filter((slot) => slot.status === SlotStatus.AVAILABLE).length} Available
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">
                      {selectedDateSlots.filter((slot) => slot.status === SlotStatus.BOOKED).length} Booked
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">
                      {selectedDateSlots.filter((slot) => slot.status === SlotStatus.CANCELLED).length} Cancelled
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">
                      {selectedDateSlots.filter((slot) => slot.status === 'blocked').length} Blocked
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <Button
                    variant={slotStatusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSlotStatusFilter('all')}
                    className="text-xs h-7 px-2"
                  >
                    All
                  </Button>
                  <Button
                    variant={slotStatusFilter === SlotStatus.AVAILABLE ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSlotStatusFilter(SlotStatus.AVAILABLE)}
                    className="text-xs h-7 px-2"
                  >
                    Available
                  </Button>
                  <Button
                    variant={slotStatusFilter === SlotStatus.BOOKED ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSlotStatusFilter(SlotStatus.BOOKED)}
                    className="text-xs h-7 px-2"
                  >
                    Booked
                  </Button>
                  {/* Added filter button for blocked slots */}
                  <Button
                    variant={slotStatusFilter === 'blocked' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSlotStatusFilter('blocked')}
                    className="text-xs h-7 px-2"
                  >
                    Blocked
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="h-7 px-2 bg-transparent"
                  size="sm"
                >
                  <RefreshCw className={cn('w-3 h-3', isLoading && 'animate-spin')} />
                </Button>
                {isValidDate(selectedDate) && availableTimeSlots.length > 0 && (
                  <Button onClick={() => setShowSlotModal(true)} className="h-7 px-2" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="p-4">
            {!isValidDate(selectedDate) ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-1">Invalid Date Selected</h4>
                <p className="text-gray-500 text-sm">Cannot manage slots for past or beyond 7 days</p>
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="text-center py-8">
                <Timer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-1">No Available Time Slots</h4>
                <p className="text-gray-500 text-sm">All time slots for today have passed</p>
              </div>
            ) : filteredSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-1">
                  {slotStatusFilter === 'all' ? 'No Slots Created' : `No ${slotStatusFilter} Slots`}
                </h4>
                <p className="text-gray-500 mb-4 text-sm">
                  {slotStatusFilter === 'all'
                    ? 'Create your first slot for this date'
                    : `No ${slotStatusFilter} slots found for this date`}
                </p>
                {slotStatusFilter === 'all' && (
                  <Button onClick={() => setShowSlotModal(true)} className="shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Slot
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all hover:shadow-md',
                      slot.status === SlotStatus.AVAILABLE && 'bg-green-50 border-green-200 hover:border-green-300',
                      slot.status === SlotStatus.BOOKED && 'bg-blue-50 border-blue-200 hover:border-blue-300',
                      slot.status === SlotStatus.CANCELLED && 'bg-red-50 border-red-200 hover:border-red-300',
                      // Added styling for blocked slots
                      slot.status === 'blocked' && 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center shadow-sm',
                            slot.status === SlotStatus.AVAILABLE && 'bg-green-100 text-green-600',
                            slot.status === SlotStatus.BOOKED && 'bg-blue-100 text-blue-600',
                            slot.status === SlotStatus.CANCELLED && 'bg-red-100 text-red-600',
                            // Added styling for blocked slots
                            slot.status === 'blocked' && 'bg-yellow-100 text-yellow-600'
                          )}
                        >
                          {slot.status === SlotStatus.AVAILABLE && <Clock className="w-5 h-5" />}
                          {slot.status === SlotStatus.BOOKED && <CheckCircle className="w-5 h-5" />}
                          {slot.status === SlotStatus.CANCELLED && <Ban className="w-5 h-5" />}
                          {/* Added icon for blocked slots */}
                          {slot.status === 'blocked' && <Lock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">{formatTime(new Date(slot.date))}</p>
                          <p className="text-xs text-gray-600">2 hours</p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          'text-xs font-medium shadow-sm capitalize',
                          slot.status === SlotStatus.AVAILABLE && 'bg-green-100 text-green-800 hover:bg-green-100',
                          slot.status === SlotStatus.BOOKED && 'bg-blue-100 text-blue-800 hover:bg-blue-100',
                          slot.status === SlotStatus.CANCELLED && 'bg-red-100 text-red-800 hover:bg-red-100',
                          // Added styling for blocked slots
                          slot.status === 'blocked' && 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        )}
                      >
                        {slot.status}
                      </Badge>
                    </div>
                    {slot.status === SlotStatus.AVAILABLE && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        onClick={() => handleDeleteSlot(slot._id)}
                        disabled={isLoading || slotLoading[slot._id]}
                      >
                        {slotLoading[slot._id] ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Trash2 className="w-3 h-3 mr-1" />}
                        Delete
                      </Button>
                    )}
                    {/* Added View Details button for booked slots */}
                    {slot.status === SlotStatus.BOOKED && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setShowDetailsModal(true);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                    {slot.status === SlotStatus.CANCELLED && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                        onClick={() => handleDeleteSlot(slot._id)}
                        disabled={isLoading || slotLoading[slot._id]}
                      >
                        {slotLoading[slot._id] ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Trash2 className="w-3 h-3 mr-1" />}
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Existing add slot modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add Time Slots</h3>
                <button
                  onClick={() => {
                    setShowSlotModal(false);
                    setSelectedTimes([]);
                    setErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
                  disabled={creating}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Time Slots ({selectedTimes.length} selected)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((time) => {
                      const isAvailable = isTimeSlotAvailable(time),
                        isSelected = selectedTimes.includes(time);
                      const [hours, minutes] = time.split(':').map(Number);
                      const slotDate = new Date(selectedDate);
                      slotDate.setHours(hours, minutes, 0, 0);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSelection(time)}
                          disabled={!isAvailable || creating}
                          className={cn(
                            'p-3 rounded-lg border-2 text-center relative transition-all',
                            isSelected && 'border-blue-500 bg-blue-50 text-blue-700 shadow-md',
                            !isSelected && isAvailable && 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                            !isAvailable && 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed',
                            creating && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <div className="font-bold text-base">{formatTime(slotDate)}</div>
                          <div className="text-xs text-gray-500 mt-1">2 hours</div>
                          {!isAvailable && <div className="text-xs text-red-500 mt-1">Unavailable</div>}
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.times && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      {errors.times}
                    </p>
                  )}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <AlertCircle className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Universal Booking</p>
                      <p className="text-sm text-blue-800">
                        Any service type can be booked in these slots. Customers choose their plan when booking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleAddSlots}
                  className="flex-1"
                  disabled={selectedTimes.length === 0 || creating}
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create {selectedTimes.length} Slot{selectedTimes.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSlotModal(false);
                    setSelectedTimes([]);
                    setErrors({});
                  }}
                  className="flex-1"
                  disabled={creating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Added details modal for booked slots */}
     {showDetailsModal && selectedSlot && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Slot Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge
                className={cn(
                  'text-xs font-medium shadow-sm capitalize',
                  selectedSlot.status === SlotStatus.AVAILABLE && 'bg-green-100 text-green-800',
                  selectedSlot.status === SlotStatus.BOOKED && 'bg-blue-100 text-blue-800',
                  selectedSlot.status === SlotStatus.CANCELLED && 'bg-red-100 text-red-800',
                  selectedSlot.status === 'blocked' && 'bg-yellow-100 text-yellow-800'
                )}
              >
                {selectedSlot.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">{formatTime(new Date(selectedSlot.date))}</span>
            </div>
            {selectedSlot.status === SlotStatus.BOOKED && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium text-gray-900">{selectedSlot.bookingId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Plan:</span>
                    <span className="font-medium text-gray-900">{selectedSlot.servicePlan || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User:</span>
                    <span className="font-medium text-gray-900">{selectedSlot.userId?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium text-gray-900">
                      {selectedSlot.vehicleId
                        ? `${selectedSlot.vehicleId.regNo} - ${selectedSlot.vehicleId.brand} ${selectedSlot.vehicleId.modelName}`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <Button onClick={() => setShowDetailsModal(false)} className="mt-6 w-full">
            Close
          </Button>
        </div>
      </div>
    )}
    </div>
  );
}
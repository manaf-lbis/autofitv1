import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, Copy, Zap, Save } from "lucide-react"
import ModernTimePicker from "./ModernTimePicker"
import { format, parse } from "date-fns"
import { useGetWorkingHoursQuery, useUpdateWorkingHoursMutation, useCreateWorkingHoursMutation } from "@/services/mechanicServices/mechanicApi"
import { DaySchedule, WorkingHoursData } from "@/types/mechanic"
import toast from "react-hot-toast"


interface WorkingHoursModalProps {
  isOpen: boolean
  onClose: () => void
}

const WorkingHoursModal: React.FC<WorkingHoursModalProps> = ({ isOpen, onClose }) => {

  const [openPicker, setOpenPicker] = useState<string | null>(null)
  const { data: workingHours, isLoading } = useGetWorkingHoursQuery(undefined,{skip: !isOpen});
  const [updateWorkingHours, { isLoading: isUpdating }] = useUpdateWorkingHoursMutation();
  const [createWorkingHours, { isLoading: isCreating }] = useCreateWorkingHoursMutation();

  const defaultSchedule: DaySchedule = {
    isOpen: true,
    openTime: "09:00",
    closeTime: "18:00",
  }

  const { control, handleSubmit, watch, setValue, reset } = useForm<WorkingHoursData>({
    defaultValues: {
      sunday: workingHours?.sunday || { ...defaultSchedule, isOpen: false },
      monday: workingHours?.monday || defaultSchedule,
      tuesday: workingHours?.tuesday || defaultSchedule,
      wednesday: workingHours?.wednesday || defaultSchedule,
      thursday: workingHours?.thursday || defaultSchedule,
      friday: workingHours?.friday || defaultSchedule,
      saturday: workingHours?.saturday || defaultSchedule,
    },
  })

  useEffect(() => {
    if (workingHours) {
      reset({
        sunday: workingHours.sunday || { ...defaultSchedule, isOpen: false },
        monday: workingHours.monday || defaultSchedule,
        tuesday: workingHours.tuesday || defaultSchedule,
        wednesday: workingHours.wednesday || defaultSchedule,
        thursday: workingHours.thursday || defaultSchedule,
        friday: workingHours.friday || defaultSchedule,
        saturday: workingHours.saturday || defaultSchedule,
      })
    }
  }, [workingHours, reset])

  const days = [
    { key: "sunday", label: "Sunday", short: "Sun", },
    { key: "monday", label: "Monday", short: "Mon", },
    { key: "tuesday", label: "Tuesday", short: "Tue", },
    { key: "wednesday", label: "Wednesday", short: "Wed", },
    { key: "thursday", label: "Thursday", short: "Thu", },
    { key: "friday", label: "Friday", short: "Fri", },
    { key: "saturday", label: "Saturday", short: "Sat", },
  ] as const

  const formatTime12Hour = (time24: string) => {
    const date = parse(time24, "HH:mm", new Date())
    return format(date, "h:mm a")
  }

  const onSubmit = async (data: WorkingHoursData) => {
    try {
      if (workingHours) {
        const res = await updateWorkingHours(data).unwrap()
        toast.success(res?.message)
      } else {
        await createWorkingHours(data).unwrap()
      }
    } catch (error:any) {
      toast.error(error?.data.message)
    }

  }

  const copyToAll = (sourceDay: keyof WorkingHoursData) => {
    const sourceSchedule = watch(sourceDay)
    if (sourceSchedule.isOpen) {
      days.forEach(({ key }) => {
        if (key !== sourceDay) {
          setValue(`${key}.openTime`, sourceSchedule.openTime)
          setValue(`${key}.closeTime`, sourceSchedule.closeTime)
        }
      })
    }
  }

  const setPreset = (preset: "business" | "extended" | "morning" | "evening" | "24-7") => {
    const presets = {
      business: { openTime: "09:00", closeTime: "17:00" },
      extended: { openTime: "08:00", closeTime: "20:00" },
      morning: { openTime: "07:00", closeTime: "15:00" },
      evening: { openTime: "14:00", closeTime: "22:00" },
      "24-7": { openTime: "00:00", closeTime: "23:59" },
    }

    const schedule = presets[preset]
    days.forEach(({ key }) => {
      setValue(`${key}.isOpen`, preset !== "business" || key !== "sunday")
      setValue(`${key}.openTime`, schedule.openTime)
      setValue(`${key}.closeTime`, schedule.closeTime)
    })
  }

  const openDaysCount = days.filter(({ key }) => watch(`${key}.isOpen` as const)).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 max-h-[95vh] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{workingHours ? "Update Working Hours" : "Set Working Hours"}</h2>
              <p className="text-sm text-gray-600 font-normal">
                {!workingHours ? "Set your availability to get started" : "Update your working hours"}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-700 font-medium mb-2 w-full sm:w-auto sm:mb-0">
                <Zap className="h-4 w-4" />
                Quick Setup:
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset("business")}
                  className="text-xs border-blue-200 hover:bg-blue-100"
                >
                  Business Hours
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset("extended")}
                  className="text-xs border-blue-200 hover:bg-blue-100"
                >
                  Extended Hours
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset("morning")}
                  className="text-xs border-blue-200 hover:bg-blue-100"
                >
                  Morning Shift
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset("evening")}
                  className="text-xs border-blue-200 hover:bg-blue-100"
                >
                  Evening Shift
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreset("24-7")}
                  className="text-xs border-blue-200 hover:bg-blue-100"
                >
                  24/7 Service
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {days.map(({ key, label, short }) => {
                const isOpen = watch(`${key}.isOpen` as const)
                const openTime = watch(`${key}.openTime` as const)
                const closeTime = watch(`${key}.closeTime` as const)

                return (
                  <Card
                    key={key}
                    className={`transition-all duration-200 ${isOpen ? "ring-2 ring-blue-100 bg-blue-50/30" : "bg-gray-50/50"
                      }`}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xs font-medium ${isOpen ? 'bg-blue-100 text-blue-700' : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            {short}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base">{label}</h3>
                            {isOpen && (
                              <p className="text-xs sm:text-sm text-gray-600">
                                {formatTime12Hour(openTime)} - {formatTime12Hour(closeTime)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          {isOpen && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToAll(key)}
                              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Copy to all</span>
                              <span className="sm:hidden">Copy</span>
                            </Button>
                          )}
                          <Controller
                            name={`${key}.isOpen`}
                            control={control}
                            render={({ field }) => (
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-blue-600"
                                />
                                <Badge variant={field.value ? "default" : "secondary"} className="text-xs">
                                  {field.value ? "Open" : "Closed"}
                                </Badge>
                              </div>
                            )}
                          />
                        </div>
                      </div>

                      {isOpen && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pl-0 sm:pl-15">
                          <Controller
                            name={`${key}.openTime`}
                            control={control}
                            render={({ field }) => (
                              <ModernTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                label="Opening Time"
                                isOpen={openPicker === field.name}
                                onToggle={() => setOpenPicker(openPicker === field.name ? null : field.name)}
                              />
                            )}
                          />
                          <Controller
                            name={`${key}.closeTime`}
                            control={control}
                            render={({ field }) => (
                              <ModernTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                label="Closing Time"
                                isOpen={openPicker === field.name}
                                onToggle={() => setOpenPicker(openPicker === field.name ? null : field.name)}
                              />
                            )}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-green-800 mb-2">Weekly Summary</h4>
                <div className="text-sm text-green-700">
                  {openDaysCount} {openDaysCount === 1 ? "day" : "days"} open • {7 - openDaysCount}{" "}
                  {7 - openDaysCount === 1 ? "day" : "days"} closed
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating || isUpdating || isLoading}
              className="w-full sm:w-auto bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isCreating || isUpdating || isLoading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isCreating || isUpdating || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Working Hours
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WorkingHoursModal
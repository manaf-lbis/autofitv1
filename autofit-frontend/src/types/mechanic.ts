export interface DaySchedule {
  isOpen: boolean
  openTime: string
  closeTime: string
}

export interface WorkingHoursData {
  sunday: DaySchedule
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
}
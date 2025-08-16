import {  startOfDay, addMinutes, format, parseISO, parse, getHours, getMinutes } from 'date-fns'
import { IMechanicTiming } from '../types/mechanic/mechanic';


export const convertHHMMToMinutes = (timeStr:string):number => {
  if (!/^\d{1,2}:\d{2}$/.test(timeStr)) {
    throw new Error("Invalid time format. Expected HH:MM");
  }
  const [hours, minutes] = timeStr.split(':').map(Number); // 9:00 -> 540
  return hours * 60 + minutes;
}

export const getUtcMinutesFromStartOfDay = (utcDate: Date) => { // Datestring -> minutes
  const hours = getHours(utcDate)
  const minutes = getMinutes(utcDate)
  return hours * 60 + minutes
}

export const convertMinutesToHHMM = (minutes: number): string => {
  return format(addMinutes(startOfDay(new Date()), minutes), 'HH:mm');  // 540 minute -> 9:00
}

export const findDayByISODate = (yyymmdd: string)=>{
  const date = parseISO(yyymmdd);
  return format(date, 'EEEE').toLocaleLowerCase()  // 24-06-2023 -> thursday
};


export const dateAndTimeToDateString = (yyyyMMdd: string, hhmm: string) => {
  const dateTimeString = `${yyyyMMdd} ${hhmm}`;
  return parse(dateTimeString, "yyyy-MM-dd HH:mm", new Date());
};


export const workingHoursToMinutes = (timing : Omit<IMechanicTiming, "mechanicId">) =>{
  const converted: any = {};
  for (const [day, value] of Object.entries(timing)) {
    if (!value.isOpen) {
      converted[day] = {
        isOpen: false,
        openTime: 0,
        closeTime: 0,
      };
    } else {
      converted[day] = {
        isOpen: true,
        openTime: convertHHMMToMinutes(`${value.openTime}`), 
        closeTime: convertHHMMToMinutes(`${value.closeTime}`),
      };
    }
  }

  return converted;
}

export const minutesToWorkingHours = (timing : Omit<IMechanicTiming, "mechanicId">) =>{
  const converted: any = {};
  for (const [day, value] of Object.entries(timing)) {
    if (!value.isOpen) {
      converted[day] = {
        isOpen: false,
        openTime: '00:00',
        closeTime: '00:00',
      };
    } else {
      converted[day] = {
        isOpen: true,
        openTime: convertMinutesToHHMM(value.openTime), 
        closeTime: convertMinutesToHHMM(value.closeTime),
      };
    }
  }

  return converted;
}
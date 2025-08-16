import z from 'zod'
import { CheckupCondition } from '../types/pretrip';

export const isoDateSchema = z.string().refine((val) => {
  const date = new Date(val);
  return !isNaN(date.getTime());
}, { message: "Invalid date format",}
);


const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const daySchema = z.object({
  isOpen: z.boolean(),
  openTime: z.string().regex(timeRegex).optional(),
  closeTime: z.string().regex(timeRegex).optional(),
}).refine(
  (data) => {
    if (!data.isOpen) return true;
    return !!data.openTime && !!data.closeTime;
  },
  { message: 'openTime and closeTime are required when isOpen is true' }
).refine(
  (data) => {
    if (!data.isOpen || !data.openTime || !data.closeTime) return true;
    const [openHour, openMin] = data.openTime.split(':').map(Number);
    const [closeHour, closeMin] = data.closeTime.split(':').map(Number);
    const openTotal = openHour * 60 + openMin;
    const closeTotal = closeHour * 60 + closeMin;
    return openTotal < closeTotal;
  },
  { message: 'openTime must be before closeTime' }
);

export const workingHoursSchema = z.object({
  sunday: daySchema,
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
});


const conditionEnum = z.enum(Object.values(CheckupCondition) as [string, ...string[]]);

const reportItemSchema = z.object({
  _id: z.string().min(1, "_id is required"),
  name: z.string().min(1, "Name is required"),
  condition: conditionEnum,
  remarks: z.string().optional(),
  needsAction: z.boolean(),
});

export const reportItemsSchema = z.array(reportItemSchema);
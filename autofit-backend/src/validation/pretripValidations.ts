import z from 'zod'

export const isoDateSchema = z.string().refine((val) => {
  const date = new Date(val);
  return !isNaN(date.getTime());
}, { message: "Invalid date format",}
);

import z from 'zod';

export const mechanicRegisterValidation = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Invalid email'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),

  education: z.string().min(3, 'Invalid Education Qualification'),
  specialised: z.string().min(2, 'Specialisation is required'),
  experience: z.coerce.number().min(0, 'Experience must be a valid number'),

  location: z
  .string()
  .regex(
    /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
    'Location must be in "latitude,longitude" format'
  )
  .transform((val): { type: 'Point'; coordinates: [number, number] } => {
    const [lat, lon] = val.split(',').map(Number);
    return {
      type: 'Point',
      coordinates: [lon, lat] as [number, number],
    };
  }),

  shopName: z.string().min(2, 'Shop name is required'),
  place: z.string().min(2, 'Place is required'),
  landmark: z.string().min(2, 'Landmark is required'),
});
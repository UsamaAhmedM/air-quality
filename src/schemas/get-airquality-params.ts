import z from 'zod';

export const getAirQualitySchema = z.object({
  longitude: z.coerce.number(),
  latitude: z.coerce.number(),
});

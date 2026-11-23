import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().trim().min(5).max(150),

  description: z.string().trim().min(20).max(5000),

  propertyType: z.string().trim().min(1).max(100),

  furnishing: z.string().trim().min(1).max(100),

  rent: z.number().positive(),

  deposit: z.number().nonnegative(),

  bedrooms: z.number().int().min(0).max(50),

  bathrooms: z.number().int().min(0).max(50),

  areaSqFt: z.number().int().positive(),

  address: z.string().trim().min(5).max(500),

  city: z.string().trim().min(1).max(100),

  state: z.string().trim().min(1).max(100),

  pincode: z.string().trim().min(4).max(12),

  latitude: z.number().min(-90).max(90).optional(),

  longitude: z.number().min(-180).max(180).optional(),

  availableFrom: z.iso.datetime(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

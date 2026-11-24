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

export const updatePropertySchema = createPropertySchema
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
  });

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;

export const publicPropertyQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(12),

    keyword: z.string().trim().max(200).optional(),

    city: z.string().trim().max(100).optional(),

    propertyType: z.string().trim().max(100).optional(),

    furnishing: z.string().trim().max(100).optional(),

    bedrooms: z.coerce.number().int().min(0).max(50).optional(),

    bathrooms: z.coerce.number().int().min(0).max(50).optional(),

    minRent: z.coerce.number().min(0).optional(),

    maxRent: z.coerce.number().min(0).optional(),

    minArea: z.coerce.number().int().positive().optional(),

    maxArea: z.coerce.number().int().positive().optional(),

    availableBefore: z.iso.date().optional(),

    sort: z.enum(["newest", "rent_asc", "rent_desc"]).default("newest"),
  })
  .refine(
    (data) =>
      data.minRent === undefined ||
      data.maxRent === undefined ||
      data.minRent <= data.maxRent,
    {
      message: "Minimum rent cannot exceed maximum rent.",
      path: ["minRent"],
    },
  )
  .refine(
    (data) =>
      data.minArea === undefined ||
      data.maxArea === undefined ||
      data.minArea <= data.maxArea,
    {
      message: "Minimum area cannot exceed maximum area.",
      path: ["minArea"],
    },
  );

export type PublicPropertyQuery = z.infer<typeof publicPropertyQuerySchema>;

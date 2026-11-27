import { z } from "zod";

export const updateUserProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100),

    phone: z
      .string()
      .trim()
      .max(15)
      .optional()
      .nullable()
      .refine(
        (value) =>
          value === undefined ||
          value === null ||
          value === "" ||
          /^\+?[0-9]{7,15}$/.test(value),
        "Please provide a valid phone number.",
      ),

    location: z.string().trim().max(100).optional().nullable(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
  });

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;

import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required.")
      .max(128, "Current password is too long."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(128, "New password must not exceed 128 characters.")
      .refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "New password cannot exceed 72 bytes.",
      ),
  })
  .strict()
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from your current password.",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

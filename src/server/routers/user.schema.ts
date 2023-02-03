import z from "zod";

export const createUserSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(8),
  confirmPassword: z.string().min(1),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().min(1),
  document: z.string().min(1),
  birthDate: z
    .string()
    .min(8)
    .transform((val) => new Date(val))
    .refine(
      (date) => date < new Date(Date.now()),
      "The birthDate must be before today"
    )
    .refine(
      (date) => date > new Date("1900-01-01"),
      "the birthDate must be greater than 1900-01-01"
    ),
});

export type CreateUserInput = z.input<typeof createUserSchema>;
export type CreateUserOutput = z.output<typeof createUserSchema>;

export const loginUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export type LoginUserInput = z.TypeOf<typeof loginUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  birthDate: z
    .string()
    .regex(
      /^(19|20|21|)\d\d[\/.-](0[1-9]|1[012])[\/.-]\d{1,2}$/,
      "the format date must be yyyy-mm-dd"
    )
    .min(8)
    .transform((val) => new Date(val))
    .refine(
      (date) => date < new Date(Date.now()),
      "The birthDate must be before today"
    )
    .refine(
      (date) => date > new Date("1900-01-01"),
      "the birthDate must be greater than 1900-01-01"
    )
    .optional(),
});

export type UpdateUserInput = z.input<typeof updateUserSchema>;
export type UpdateUserOutput = z.output<typeof updateUserSchema>;

export const activateUserSchema = z.object({
  code: z.string().min(1),
});

export type ActivateUserInput = z.TypeOf<typeof activateUserSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type ChangePasswordInput = z.TypeOf<typeof changePasswordSchema>;

export const recoverPasswordSchema = z.object({
  email: z.string().email(),
});

export type RecoverPasswordInput = z.TypeOf<typeof recoverPasswordSchema>;

export const resetPasswordSchema = z.object({
  code: z.string().min(1),
  email: z.string().email(),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type ResetPasswordInput = z.TypeOf<typeof resetPasswordSchema>;

export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  birthDate: Date | string;
  active: boolean;
  blocked: boolean;
};

import * as zod from "zod";

export const registerSchema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(3, "Minimum length is 3")
      .max(50, "Maximum length is 50"),
    email: zod
      .string()
      .nonempty("Email is required")
      .email("Email is not valid"),
    dateOfBirth: zod
      .string()
      .nonempty("Date of birth is required")
      .refine((dateOfBirthValue) => {
        const userDate = new Date(dateOfBirthValue).getFullYear();
        const nowDate = new Date().getFullYear();
        return nowDate - userDate >= 13;
      }, "You must be at least 13 years old"),
    gender: zod.enum(["male", "female"]),
    password: zod
      .string()
      .nonempty("Password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
      ),
    rePassword: zod.string().nonempty("Confirm password is required"),
  })
  .refine((obj) => obj.password === obj.rePassword, {
    path: ["rePassword"],
    error: "Passwords do not match",
  });

export type registerSchemaType = zod.infer<typeof registerSchema>;

export const loginSchema = zod.object({
  email: zod
    .string()
    .nonempty("Email is required")
    .email("Email is not valid"),
  password: zod.string().nonempty("Password is required").min(8, "Password must be at least 8 characters"),
});

export type loginSchemaType = zod.infer<typeof loginSchema>;

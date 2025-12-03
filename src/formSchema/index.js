import { z } from "zod";

export const newAgentSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters."),
  
  email: z
    .string()
    .email("Invalid email format"),

  searchLimit: z.union([
  z.coerce.number().min(1, "Select a valid limit"),
  z.literal("unlimited"),
])
});

export const baseUserSchema = z.object({
  fullName: z.string().trim().min(4, "Name must be at least 4 characters."),
  email: z.string().trim().email("Invalid email format"),
  message: z.string().trim().optional(),
});

export const addAgentByAdminSchema = baseUserSchema.extend({
  brokerId: z.string().trim().nonempty("Broker selection is required"),
});

export const addBrokerByAdminSchema = baseUserSchema.extend({
  teamStrength: z.string().trim().nonempty("Team strength selection is required"),
});

export const demoRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  state: z.string().trim().nonempty("State is required"),
  email: z
    .string()
    .trim()
    .refine(
      (value) =>
        isEmail(value) || isPhone(value),
      "Enter a valid email or phone number"
    ),
  country: z.string().trim().nonempty("County is required"),
  additionalMessage: z.string().optional(),
});

// helpers
const isEmail = (value) =>
  /^\S+@\S+\.\S+$/.test(value);

const isPhone = (value) => {
  const cleaned = value.replace(/\D/g, ""); // keep only digits
  return /^[6-9]\d{9}$/.test(cleaned);
};
import { z } from "zod";

export const newAgentSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters.")
    .max(45, "Name must be at most 45 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),

  email: z.string().email("Invalid email format"),

  searchLimit: z.union([
    z.coerce.number().min(1, "Select a valid limit"),
    z.literal("unlimited"),
  ]),
});

export const baseUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(4, "Name must be at least 4 characters.")
    .max(45, "Name must be at most 45 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
  email: z.string().trim().email("Invalid email format"),
  message: z.string().trim().optional(),
});

export const getAddAgentByAdminSchema = (isBrokerRequired) =>
  baseUserSchema.extend({
    brokerId: isBrokerRequired
      ? z.string().trim().nonempty("Broker selection is required")
      : z.string().trim().optional(),
  });
export const addBrokerByAdminSchema = baseUserSchema.extend({
  teamStrength: z
    .string()
    .trim()
    .nonempty("Team strength selection is required"),
});

export const demoRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, "Name must be at least 4 characters")
    .max(45, "Name must be at most 45 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
  state: z.string().trim().nonempty("State is required"),
  email: z
    .string()
    .trim()
    .refine(
      (value) => isEmail(value) || isPhone(value),
      "Enter a valid email or phone number",
    ),
  country: z.string().trim().nonempty("County is required"),
  additionalMessage: z.string().optional(),
});

// helpers
const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const isPhone = (value) => {
  const cleaned = value.replace(/\D/g, ""); // keep only digits
  return /^[6-9]\d{9}$/.test(cleaned);
};

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(4, "Name must be at least 4 characters")
      .trim()
      .max(45, "Name must be at most 45 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),

    phoneNumber: z
      .string()
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits"),

    email: z.string().email("Invalid email address").toLowerCase().trim(),

    password: z
      .string()
      .min(
        8,
        "Password must be 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,}$/,
        "Password must be 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      ),

    confirmPassword: z.string(),

    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addAgentSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .trim()
    .max(45, "Name must be at most 45 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),

  phoneNumber: z.string().length(10, "Phone number must be 10 digits"),

  email: z.string().email("Invalid email address").toLowerCase().trim(),

  searchLimit: z
    .string()
    .min(1, "Please select search limit")
    .refine((val) => ["10", "20", "30", "40", "unlimited"].includes(val), {
      message: "Invalid search limit selected",
    }),
});

export const addBrokerSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .trim()
    .max(45, "Name must be at most 45 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),

  phoneNumber: z.string().length(10, "Phone number must be 10 digits"),

  email: z.string().email("Invalid email address").toLowerCase().trim(),

  teamStrength: z
    .string()
    .min(1, "Please select team strength")
    .refine((val) => ["10", "20", "30", "40", "unlimited"].includes(val), {
      message: "Invalid team strength selected",
    }),
});

export const addOrgAgentSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .trim()
    .max(45, "Name must be at most 45 characters").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),

  phoneNumber: z.string().length(10, "Phone number must be 10 digits"),

  email: z.string().email("Invalid email address").toLowerCase().trim(),

  selectedBroker: z.string().min(1, "Please select a broker"),
});

export const addPricingSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount is required"),
  description: z.string().trim().min(1, "Description is required"),
  priceType: z.string().trim().min(1, "Price type selection is required"),
  pricingType: z.string().trim().min(1, "Pricing type selection is required"),
});

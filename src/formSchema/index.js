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

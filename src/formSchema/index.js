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
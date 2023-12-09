import * as z from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(10, {
    message: "Your company description must be at least 10 characters.",
  }),
});

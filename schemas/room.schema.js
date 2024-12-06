import { z } from "zod";

export const roomCreateSchema = z.object({
  number: z.string(),
  price: z.string(),
  available: z.boolean().default(true),
});

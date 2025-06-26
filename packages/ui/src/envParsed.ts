import { z } from "zod";

const envSchema = z
  .object({
    API_URL: z.string().url().optional().default("http://localhost:9999"),
  })
  .required();

const envParsed = () => envSchema.parse(import.meta.env);

export default envParsed;

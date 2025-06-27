import { z } from "zod";

const envSchema = z
  .object({
    API_URL: z.string().url().optional().default("http://localhost:9999"),
  })
  .required();

const env = {
  API_URL: import.meta.env.VITE_API_URL,
};

const envParsed = () => envSchema.parse(env);

export default envParsed;

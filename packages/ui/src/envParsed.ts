import { z } from "zod";

// NOTE: DO NOT destructure import.meta.env

const env = {
  API_URL: import.meta.env.VITE_API_URL,
};

const envSchema = z
  .object({
    API_URL: z.string().url().optional().default("http://localhost:9999"),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;

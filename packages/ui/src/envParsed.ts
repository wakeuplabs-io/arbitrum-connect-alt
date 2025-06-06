import { z } from "zod";

// NOTE: DO NOT destructure import.meta.env

const env = {
  APP_URL: import.meta.env.VITE_APP_URL,
  API_URL: import.meta.env.VITE_API_URL,
};

const envSchema = z
  .object({
    APP_URL: z.string().url().optional().default("http://localhost:3000"),
    API_URL: z.string().url().optional().default("http://localhost:9999"),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;

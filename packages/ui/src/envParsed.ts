import { z } from "zod";

const envSchema = z
  .object({
    API_URL: z.string().url().optional().default("http://localhost:9999"),
    DOCS_URL: z
      .string()
      .url()
      .optional()
      .default("https://github.com/wakeuplabs-io/arbitrum-connect-alt/blob/main/README.md"),
  })
  .required();

const env = {
  API_URL: import.meta.env.VITE_API_URL,
  DOCS_URL: import.meta.env.VITE_DOCS_URL,
};

const envParsed = () => envSchema.parse(env);

export default envParsed;

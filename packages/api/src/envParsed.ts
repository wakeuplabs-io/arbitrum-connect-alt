import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z, ZodError } from "zod";

expand(
  config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === "test" ? ".env.test" : ".env"),
  }),
);

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(9999),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("error"),
  UI_URL: z.string().trim().default("http://localhost:3000"),
  PRICES_API_URL: z
    .string()
    .trim()
    .default("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"),
  PRICES_CACHE_EXPIRATION_MINUTES: z.coerce.number().default(5),
});

const envParsed = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid env:");

    if (error instanceof ZodError) {
      console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    } else {
      console.error(error);
    }

    process.exit(1);
  }
};

export default envParsed;

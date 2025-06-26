import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(
  config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === "test" ? ".env.test" : ".env"),
  }),
);

const envSchema = z
  .object({
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
  })
  .required();

const { data: envParsed, error } = envSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

if (!envParsed) {
  console.error("❌ No env parsed");
  process.exit(1);
}

export default envParsed!;

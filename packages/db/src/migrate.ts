import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "./schema";

config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const runMigration = async () => {
  const sql = neon(process.env.DATABASE_URL as string);
  const db = drizzle(sql, { schema });

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migrations completed!");
  process.exit(0);
};

runMigration().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});

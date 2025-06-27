CREATE TABLE IF NOT EXISTS "cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"data" text NOT NULL,
	"expires_at" integer NOT NULL,
	"created_at" integer NOT NULL,
	"updated_at" integer NOT NULL,
	CONSTRAINT "cache_key_unique" UNIQUE("key")
);

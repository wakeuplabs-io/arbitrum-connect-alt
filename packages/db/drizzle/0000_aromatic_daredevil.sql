CREATE TABLE IF NOT EXISTS "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" text NOT NULL,
	"withdraw_amount" text NOT NULL,
	"parent_chain_send_l2_tx_hash" text,
	"child_chain_withdraw_tx_hash" text NOT NULL,
	"parent_chain_force_inclusion_tx_hash" text,
	"child_chain_id" integer NOT NULL,
	"status" text NOT NULL,
	"created_at" integer NOT NULL
);

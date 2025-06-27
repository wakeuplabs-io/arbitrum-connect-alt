import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export enum ActivityStatus {
  INITIALIZED = "initialized",
  L2_MSG_SENT = "l2_msg_sent",
  L2_MSG_INCLUDED = "l2_msg_included",
  READY_TO_CLAIM = "ready_to_claim",
  READY_TO_BE_FORCED = "ready_to_be_forced",
  FORCED = "forced",
  FORCED_CHALLENGE_PERIOD_COMPLETED = "forced_challenge_period_completed",
  CLAIMED = "claimed",
  EXECUTED_BUT_FAILED = "executed_but_failed",
}

const activityStatusValues = [
  ActivityStatus.INITIALIZED,
  ActivityStatus.L2_MSG_SENT,
  ActivityStatus.L2_MSG_INCLUDED,
  ActivityStatus.READY_TO_CLAIM,
  ActivityStatus.READY_TO_BE_FORCED,
  ActivityStatus.FORCED,
  ActivityStatus.FORCED_CHALLENGE_PERIOD_COMPLETED,
  ActivityStatus.CLAIMED,
  ActivityStatus.EXECUTED_BUT_FAILED,
] as const;

export const activities = pgTable("activities", {
  id: serial("id").primaryKey().notNull(),
  walletAddress: text("wallet_address").notNull(),
  withdrawAmount: text("withdraw_amount").notNull(),
  parentChainSendL2TxHash: text("parent_chain_send_l2_tx_hash"),
  childChainWithdrawTxHash: text("child_chain_withdraw_tx_hash").notNull(),
  parentChainForceInclusionTxHash: text("parent_chain_force_inclusion_tx_hash"),
  childChainId: integer("child_chain_id").notNull(),
  status: text("status", { enum: activityStatusValues }).notNull(),
  createdAt: integer("created_at").notNull(),
});

export type Activity = typeof activities.$inferSelect;

export const cache = pgTable("cache", {
  id: serial("id").primaryKey().notNull(),
  key: text("key").notNull().unique(), // Unique cache key
  data: text("data").notNull(), // JSON stringified
  expiresAt: integer("expires_at").notNull(), // Expiration timestamp
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export type Cache = typeof cache.$inferSelect;

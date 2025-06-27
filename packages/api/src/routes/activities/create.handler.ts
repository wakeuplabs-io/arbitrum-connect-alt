import { activities, ActivityStatus } from "@arbitrum-connect/db";
import { db } from "@arbitrum-connect/db/config";

import { z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { AppRouteHandler } from "../../lib/types";
import { CreateActivityRoute, createActivityRoute } from "./create.routes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createActivitySchema = createActivityRoute.request.body.content["application/json"].schema;
type CreateActivityBody = z.infer<typeof createActivitySchema>;

/**
 * Create activity endpoint handler
 * @type {AppRouteHandler<CreateActivityRoute>}
 * @description Handles POST requests to create a new activity
 */
export const createActivityHandler: AppRouteHandler<CreateActivityRoute> = async (c) => {
  try {
    const { walletAddress, withdrawAmount, childChainWithdrawTxHash, childChainId } =
      (await c.req.json()) as CreateActivityBody;

    // Create new activity with INITIALIZED status
    const [newActivity] = await db
      .insert(activities)
      .values({
        walletAddress,
        withdrawAmount,
        childChainWithdrawTxHash,
        childChainId,
        status: ActivityStatus.INITIALIZED,
        createdAt: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      })
      .returning();

    return c.json(newActivity, HttpStatusCodes.CREATED);
  } catch (err) {
    console.error("Error creating activity:", err);
    return c.json({ message: "Error creating activity" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

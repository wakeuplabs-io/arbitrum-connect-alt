import { activities, db } from "@arbitrum-connect/db";
import { z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { AppRouteHandler } from "../../lib/types";
import { UpdateActivityRoute, updateActivityRoute } from "./update.routes";

const updateActivitySchema = updateActivityRoute.request.body.content["application/json"].schema;
type UpdateActivityBody = z.infer<typeof updateActivitySchema>;

/**
 * Update activity endpoint handler
 * @type {AppRouteHandler<UpdateActivityRoute>}
 * @description Handles PUT requests to update an existing activity
 */
export const updateActivityHandler: AppRouteHandler<UpdateActivityRoute> = async (c) => {
  try {
    const { id } = c.req.param();
    const { walletAddress, withdrawAmount, childChainId, status } =
      (await c.req.json()) as UpdateActivityBody;

    // Check if activity exists
    const existingActivity = await db.query.activities.findFirst({
      where: eq(activities.id, Number(id)),
    });

    if (!existingActivity) {
      return c.json({ message: "Activity not found" }, HttpStatusCodes.NOT_FOUND);
    }

    // Update activity
    const [updatedActivity] = await db
      .update(activities)
      .set({
        walletAddress,
        withdrawAmount,
        childChainId,
        status,
        createdAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(activities.id, Number(id)))
      .returning();

    return c.json(updatedActivity, HttpStatusCodes.OK);
  } catch (err) {
    console.error("Error updating activity:", err);
    return c.json({ message: "Error updating activity" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

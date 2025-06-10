import { activities, ActivityStatus } from "@arbitrum-connect/db";
import { db } from "@arbitrum-connect/db/config";
import { z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { allChains } from "../../blockchain/chains";
import { AppRouteHandler, TxStatus } from "../../lib/types";
import { GetActivityRoute, getActivityRoute } from "./get.routes";
import { getWithdrawalStatus, WithdrawalStatus } from "../../lib/getWithdrawalStatus";

const getActivitySchema = getActivityRoute.request.params;
type GetActivityParams = z.infer<typeof getActivitySchema>;

const chainList = [...allChains.mainnet, ...allChains.testnet];

/**
 * Get activity by ID endpoint handler
 * @type {AppRouteHandler<GetActivityRoute>}
 * @description Handles GET requests to retrieve a single activity by its ID
 */
export const getActivityHandler: AppRouteHandler<GetActivityRoute> = async (c) => {
  try {
    const { id } = c.req.param() as GetActivityParams;
    const activityId = parseInt(id, 10);

    if (isNaN(activityId)) {
      return c.json({ message: "Invalid ID format" }, HttpStatusCodes.BAD_REQUEST);
    }

    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, activityId),
    });

    if (!activity) {
      return c.json({ message: "Activity not found" }, HttpStatusCodes.NOT_FOUND);
    }

    const childChain = chainList.find((c) => c.chainId === activity.childChainId);
    if (!childChain) {
      return c.json({ message: "Child chain not found" }, HttpStatusCodes.NOT_FOUND);
    }

    const withdrawalStatus = await getWithdrawalStatus(
      childChain,
      activity.childChainWithdrawTxHash,
    );

    const statusMap = {
      [WithdrawalStatus.CLAIMED]: ActivityStatus.CLAIMED,
      [WithdrawalStatus.EXECUTED_BUT_FAILED]: ActivityStatus.EXECUTED_BUT_FAILED,
      [WithdrawalStatus.READY_TO_CLAIM]: ActivityStatus.READY_TO_CLAIM,
    };

    const newStatus = statusMap[withdrawalStatus.status as keyof typeof statusMap];

    if (newStatus && newStatus !== activity.status) {
      await db.update(activities).set({ status: newStatus }).where(eq(activities.id, activityId));
    }

    return c.json(
      {
        ...activity,
        status: newStatus || activity.status,
        claimableAt: withdrawalStatus.claimableAt,
      },
      HttpStatusCodes.OK,
    );
  } catch (err) {
    console.error("Error retrieving activity:", err);
    return c.json({ message: "Error retrieving activity" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

import { activities } from "@arbitrum-connect/db";
import { db } from "@arbitrum-connect/db/config";
import { z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { AppRouteHandler } from "../../lib/types";
import { ListActivitiesRoute, listActivitiesRoute } from "./list.routes";

const listActivitiesSchema = listActivitiesRoute.request.query;
type ListActivitiesQuery = z.infer<typeof listActivitiesSchema>;

/**
 * List activities endpoint handler
 * @type {AppRouteHandler<ListActivitiesRoute>}
 * @description Handles GET requests to list activities for a wallet address
 */
export const listActivitiesHandler: AppRouteHandler<ListActivitiesRoute> = async (c) => {
  try {
    const { walletAddress } = c.req.query() as ListActivitiesQuery;

    const activitiesList = await db.query.activities.findMany({
      where: eq(activities.walletAddress, walletAddress),
      orderBy: (activities, { desc }) => [desc(activities.createdAt)],
    });

    return c.json(activitiesList, HttpStatusCodes.OK);
  } catch (err) {
    console.error("Error retrieving activities:", err);
    return c.json(
      { message: "Error retrieving activities" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

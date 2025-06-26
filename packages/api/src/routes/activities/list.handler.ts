import { activities } from "@arbitrum-connect/db";
import { db } from "@arbitrum-connect/db/config";
import { z } from "@hono/zod-openapi";
import { eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { AppRouteHandler } from "../../lib/types";
import { ListActivitiesRoute, listActivitiesRoute } from "./list.routes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listActivitiesSchema = listActivitiesRoute.request.query;
type ListActivitiesQuery = z.infer<typeof listActivitiesSchema>;

/**
 * List activities endpoint handler
 * @type {AppRouteHandler<ListActivitiesRoute>}
 * @description Handles GET requests to list activities for a wallet address
 */
export const listActivitiesHandler: AppRouteHandler<ListActivitiesRoute> = async (c) => {
  try {
    const { walletAddress, page = "1", limit = "10" } = c.req.query() as ListActivitiesQuery;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(activities)
      .where(eq(activities.walletAddress, walletAddress));

    // Get paginated activities
    const activitiesList = await db.query.activities.findMany({
      where: eq(activities.walletAddress, walletAddress),
      orderBy: (activities, { desc }) => [desc(activities.createdAt)],
      limit: limitNumber,
      offset,
    });

    return c.json(
      {
        items: activitiesList,
        total: Number(count),
        page: pageNumber,
        totalPages: Math.ceil(Number(count) / limitNumber),
      },
      HttpStatusCodes.OK,
    );
  } catch (err) {
    console.error("Error retrieving activities:", err);
    return c.json(
      { message: "Error retrieving activities" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

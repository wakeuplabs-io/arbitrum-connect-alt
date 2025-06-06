import { createRoute, z } from "@hono/zod-openapi";
import { ethers } from "ethers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const listActivitiesRoute = createRoute({
  path: "/activities",
  method: "get",
  tags: ["Activities"],
  request: {
    query: z.object({
      walletAddress: z.string().refine((address) => ethers.utils.isAddress(address), {
        message: "Invalid wallet address",
      }),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          id: z.number(),
          status: z.string(),
          createdAt: z.number(),
          walletAddress: z.string(),
          withdrawAmount: z.string(),
          childChainWithdrawTxHash: z.string(),
          childChainId: z.number(),
        }),
      ),
      "Activities retrieved successfully",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid request data"),
      "Invalid request data",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Error retrieving activities"),
      "Error retrieving activities",
    ),
  },
});

export type ListActivitiesRoute = typeof listActivitiesRoute;

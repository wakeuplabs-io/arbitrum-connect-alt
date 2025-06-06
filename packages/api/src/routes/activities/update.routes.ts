import { ActivityStatus } from "@arbitrum-connect/db";
import { createRoute, z } from "@hono/zod-openapi";
import { ethers } from "ethers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const updateActivityRoute = createRoute({
  path: "/activities/{id}",
  method: "put",
  tags: ["Activities"],
  request: {
    params: z.object({
      id: z.number(),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            walletAddress: z.string().refine((address) => ethers.utils.isAddress(address), {
              message: "Invalid wallet address",
            }),
            withdrawAmount: z.string(),
            childChainId: z.number(),
            status: z.nativeEnum(ActivityStatus),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        id: z.number(),
        status: z.string(),
        createdAt: z.number(),
        walletAddress: z.string(),
        withdrawAmount: z.string(),
        childChainWithdrawTxHash: z.string(),
        childChainId: z.number(),
      }),
      "Activity updated successfully",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid request data"),
      "Invalid request data",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Activity not found"),
      "Activity not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Error updating activity"),
      "Error updating activity",
    ),
  },
});

export type UpdateActivityRoute = typeof updateActivityRoute;

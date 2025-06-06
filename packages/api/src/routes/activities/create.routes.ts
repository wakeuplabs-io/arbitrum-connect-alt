import { createRoute, z } from "@hono/zod-openapi";
import { ethers } from "ethers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const createActivityRoute = createRoute({
  path: "/activities",
  method: "post",
  tags: ["Activities"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            walletAddress: z.string().refine((address) => ethers.utils.isAddress(address), {
              message: "Invalid wallet address",
            }),
            withdrawAmount: z.string(),
            childChainWithdrawTxHash: z.string(),
            childChainId: z.number(),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        id: z.number(),
        status: z.string(),
        createdAt: z.number(),
        walletAddress: z.string(),
        withdrawAmount: z.string(),
        childChainWithdrawTxHash: z.string(),
        childChainId: z.number(),
      }),
      "Activity created successfully",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid request data"),
      "Invalid request data",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Error creating activity"),
      "Error creating activity",
    ),
  },
});

export type CreateActivityRoute = typeof createActivityRoute;

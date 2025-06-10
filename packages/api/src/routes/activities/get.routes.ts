import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const GetActivityResponseSchema = z.object({
  id: z.number(),
  status: z.string(),
  createdAt: z.number(),
  walletAddress: z.string(),
  withdrawAmount: z.string(),
  childChainWithdrawTxHash: z.string(),
  childChainId: z.number(),
  claimableAt: z.number().optional().nullable(),
});

export type GetActivityResponse = z.infer<typeof GetActivityResponseSchema>;

export const getActivityRoute = createRoute({
  path: "/activities/{id}",
  method: "get",
  tags: ["Activities"],
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          in: "path",
          name: "id",
        },
        example: "1",
      }),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(GetActivityResponseSchema, "Activity retrieved successfully"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid request data"),
      "Invalid request data",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Activity not found"),
      "Activity not found",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Error retrieving activity"),
      "Error retrieving activity",
    ),
  },
});

export type GetActivityRoute = typeof getActivityRoute;

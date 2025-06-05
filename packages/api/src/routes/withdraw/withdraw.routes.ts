/**
 * @fileoverview Example route definitions
 * Defines the OpenAPI schema for the example endpoints.
 *
 * @module routes/example/routes
 */

import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

/**
 * Withdraw route configuration
 * @description Defines a POST endpoint that demonstrates basic route structure
 *
 * @openapi
 * /withdraw:
 *   post:
 *     tags:
 *       - Withdraw
 *     responses:
 *       200:
 *         description: Successful withdrawal response
 */
export const withdrawRoute = createRoute({
  path: "/withdraw",
  method: "post",
  tags: ["Withdraw"],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        sendL2MessageTxHash: z.string(),
      }),
      "Withdrawal successful",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid signature"),
      "Invalid signature",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Error processing withdrawal intent"),
      "Error processing withdrawal intent",
    ),
  },
});

export type WithdrawRoute = typeof withdrawRoute;

export const withdrawExecuteRoute = createRoute({
  path: "/withdraw/execute",
  method: "post",
  tags: ["Withdraw"],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.object({ txHash: z.string() }), "Withdrawal successful"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid signature"),
      "Invalid signature",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Error processing withdrawal intent"),
      "Error processing withdrawal intent",
    ),
  },
});

export type WithdrawExecuteRoute = typeof withdrawExecuteRoute;

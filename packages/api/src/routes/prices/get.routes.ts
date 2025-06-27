import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const GetPriceResponseSchema = z.record(z.string(), z.record(z.string(), z.number()));

export type GetPriceResponse = z.infer<typeof GetPriceResponseSchema>;

export const getPriceRoute = createRoute({
  path: "/prices",
  method: "get",
  tags: ["Prices"],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(GetPriceResponseSchema, "Prices retrieved successfully"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid request data"),
      "Invalid request data",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema("Error retrieving prices"),
      "Error retrieving prices",
    ),
  },
});

export type GetPriceRoute = typeof getPriceRoute;

/**
 * @fileoverview Example route module entry point
 * Combines the route configuration and handler into a single router.
 *
 * @module routes/example
 */

import { createRouter } from "../../lib/create-app";
import * as withdrawExecuteHandler from "./withdraw-execute.handler";
import * as withdrawHandler from "./withdraw.handler";
import * as routes from "./withdraw.routes";

/**
 * Configured example router
 * @description Combines the example route definition with its handler
 * @type {import('../../lib/types').AppOpenAPI}
 */
const router = createRouter()
  .openapi(routes.withdrawRoute, withdrawHandler.withdrawHandler)
  .openapi(routes.withdrawExecuteRoute, withdrawExecuteHandler.withdrawExecuteHandler);

export default router;

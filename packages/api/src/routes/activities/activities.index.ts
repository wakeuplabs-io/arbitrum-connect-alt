import { createRouter } from "../../lib/create-app";
import * as createHandler from "./create.handler";
import * as createRoutes from "./create.routes";
import * as listHandler from "./list.handler";
import * as listRoutes from "./list.routes";
import * as updateHandler from "./update.handler";
import * as updateRoutes from "./update.routes";

const router = createRouter()
  .openapi(createRoutes.createActivityRoute, createHandler.createActivityHandler)
  .openapi(listRoutes.listActivitiesRoute, listHandler.listActivitiesHandler)
  .openapi(updateRoutes.updateActivityRoute, updateHandler.updateActivityHandler);

export default router;

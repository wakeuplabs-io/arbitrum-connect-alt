import { createRouter } from "../../lib/create-app";
import * as createHandler from "./create.handler";
import * as createRoutes from "./create.routes";
import * as getHandler from "./get.handler";
import * as getRoutes from "./get.routes";
import * as listHandler from "./list.handler";
import * as listRoutes from "./list.routes";

const router = createRouter()
  .openapi(createRoutes.createActivityRoute, createHandler.createActivityHandler)
  .openapi(listRoutes.listActivitiesRoute, listHandler.listActivitiesHandler)
  .openapi(getRoutes.getActivityRoute, getHandler.getActivityHandler);

export default router;

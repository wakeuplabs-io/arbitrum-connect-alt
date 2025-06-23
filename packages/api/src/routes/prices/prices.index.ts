import { createRouter } from "../../lib/create-app";
import * as getHandler from "./get.handler";
import * as getRoutes from "./get.routes";

const router = createRouter().openapi(getRoutes.getPriceRoute, getHandler.getPriceHandler);

export default router;

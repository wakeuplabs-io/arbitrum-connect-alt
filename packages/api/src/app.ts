/**
 * @fileoverview Main configuration for the Hono API application
 * This file configures and exports the main Hono application instance,
 * including CORS middleware, OpenAPI documentation, and routing.
 *
 * @module app
 */

import { cors } from "hono/cors";
import env from "./env";
import configureOpenAPI from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import activities from "./routes/activities/activities.index";

/**
 * Main Hono application instance
 * Created using the createApp factory function that configures OpenAPIHono with custom bindings
 * @type {import('./lib/types').AppOpenAPI}
 */
const app = createApp();

/**
 * CORS middleware configuration
 * Allows requests from origins specified in the CORS_ORIGINS environment variable
 * Origins are specified as a comma-separated list
 * @example
 * // Example of CORS_ORIGINS in .env
 * CORS_ORIGINS=http://localhost:3000,https://example.com
 */
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
    credentials: true,
  }),
);

const apiRoutes = app.route("/api", activities);

/**
 * Configures OpenAPI/Swagger documentation for the API
 * This enables the /doc and /reference endpoints for documentation
 */
configureOpenAPI(app);

/**
 * Exported type that represents the API route structure
 * Useful for client-side typing and documentation
 */
export type AppType = typeof apiRoutes;

export default app;

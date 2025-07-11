/**
 * @fileoverview Factory functions for creating Hono application instances
 * This file provides utilities for creating and configuring Hono applications
 * with OpenAPI support, middleware, and error handling.
 *
 * @module lib/create-app
 */

import type { Schema } from "hono";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import { pinoLogger } from "../middlewares/pino-logger";

import type { AppBindings, AppOpenAPI } from "./types";
import envParsed from "../envParsed";

/**
 * Creates a new OpenAPIHono router instance with default configurations
 * @returns {AppOpenAPI} A configured OpenAPIHono router instance
 * @description
 * Creates a new router with:
 * - Custom AppBindings for type safety
 * - Strict mode disabled
 * - Default OpenAPI hook configuration
 */
export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

/**
 * Creates and configures the main application instance with all necessary middleware
 * @returns {AppOpenAPI} A fully configured Hono application instance
 * @description
 * Sets up an application with:
 * - CORS middleware with specific origin for development
 * - Request ID tracking
 * - Emoji favicon (📝)
 * - Pino logging middleware
 * - Custom 404 handler
 * - Global error handler
 */
export default function createApp() {
  const app = createRouter();

  // Debug middleware for CORS (remove in production)
  if (envParsed.NODE_ENV === "development") {
    app.use("*", async (c, next) => {
      console.log(`🔍 Request: ${c.req.method} ${c.req.url}`);
      console.log(`🌐 Origin: ${c.req.header("origin")}`);
      console.log(`📝 Headers:`, Object.fromEntries(c.req.raw.headers.entries()));
      await next();
      console.log(`✅ Response Status: ${c.res.status}`);
    });
  }

  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Cache-Control",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
      ],
      exposeHeaders: ["Content-Length", "X-Request-Id"],
      credentials: false, // Must be false when origin is "*"
      maxAge: 86400, // 24 hours for preflight cache
    }),
  );

  app.use(requestId()).use(serveEmojiFavicon("📝")).use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

/**
 * Creates a test application instance with a specific router
 * @template S - Schema type extending Hono's base Schema
 * @param {AppOpenAPI<S>} router - The router to attach to the test application
 * @returns {AppOpenAPI} A configured test application instance
 * @description
 * Useful for testing routes in isolation. Creates a minimal application
 * with the provided router mounted at the root path.
 */
export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route("/", router);
}

/* eslint-disable @typescript-eslint/ban-types */
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Schema } from "hono";
import type { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;

export enum TxStatus {
  SUCCESS = 1,
  FAILURE = 0,
}

// Time constants
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_DAY = 86400;
export const CONFIRMATION_BUFFER_MINUTES = 60;
export const BLOCK_TIME_IN_SECONDS = 12;

import { handle } from "hono/aws-lambda";
import app from "./app";

const handler = handle(app);

// Export using CommonJS for AWS Lambda
exports.handler = handler;

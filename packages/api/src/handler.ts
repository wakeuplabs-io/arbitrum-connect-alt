import { handle } from "hono/aws-lambda";
import app from "./app";

export const handler = handle(app);

// Ensure CommonJS export for AWS Lambda
module.exports = { handler };

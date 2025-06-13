import { handle } from "hono/aws-lambda";
import app from "./app";

module.exports = { handler: handle(app) };

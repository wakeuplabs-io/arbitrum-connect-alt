import { serve } from "@hono/node-server";
import app from "./app";
import envParsed from "./envParsed";

const port = envParsed().PORT;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
  },
);

export type { AppType } from "./app";
export default app;

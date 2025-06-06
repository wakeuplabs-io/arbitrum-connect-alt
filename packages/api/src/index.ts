import { serve } from "@hono/node-server";
import app from "./app";
import env from "./env";

const port = env.PORT;

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

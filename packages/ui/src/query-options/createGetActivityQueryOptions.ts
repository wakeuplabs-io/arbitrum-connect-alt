import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { minutesToMilliseconds } from "date-fns";
import { AppType } from "@arbitrum-connect/api";
import { GetActivityResponse } from "@arbitrum-connect/api/src/routes/activities/get.routes";
import { hc } from "hono/client";
import envParsed from "@/envParsed";

async function fetchActivity(activityId: string) {
  const client = hc<AppType>(envParsed().API_URL, {
    headers: { "Cache-Control": "no-cache" },
  });
  const activity = await client.api.activities[":id"].$get({
    param: {
      id: activityId,
    },
  });

  if (!activity.ok) {
    throw new Error("Failed to fetch activity");
  }

  return (await activity.json()) as GetActivityResponse;
}

export default function createGetActivityQueryOptions(activityId: string) {
  return queryOptions({
    queryKey: ["activity", activityId],
    queryFn: () => fetchActivity(activityId),
    refetchInterval: minutesToMilliseconds(1),
    staleTime: minutesToMilliseconds(1),
    placeholderData: keepPreviousData,
  });
}

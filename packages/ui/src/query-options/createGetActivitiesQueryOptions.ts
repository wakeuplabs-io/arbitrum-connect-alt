import { minutesToMilliseconds } from "date-fns";
import { hc } from "hono/client";
import { AppType } from "@arbitrum-connect/api";
import envParsed from "@/envParsed";
import { ListActivityResponse } from "@arbitrum-connect/api/src/routes/activities/list.routes";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

const PAGE_SIZE = 10;

async function fetchActivities(walletAddress: string, page: number = 1) {
  const client = hc<AppType>(envParsed().API_URL, {
    headers: { "Cache-Control": "no-cache" },
  });
  const response = await client.api.activities.$get({
    query: {
      walletAddress,
      page: page.toString(),
      limit: PAGE_SIZE.toString(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  return (await response.json()) as ListActivityResponse;
}

export default function createGetActivitiesQueryOptions(
  walletAddress: string | null | undefined,
  page: number,
) {
  return queryOptions({
    queryKey: ["activities", walletAddress, page],
    queryFn: () => fetchActivities(walletAddress!, page),
    enabled: !!walletAddress,
    refetchInterval: minutesToMilliseconds(1),
    staleTime: minutesToMilliseconds(1),
    placeholderData: keepPreviousData,
  });
}

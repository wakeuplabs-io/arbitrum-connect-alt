import { queryOptions } from "@tanstack/react-query";

import { hc } from "hono/client";
import { AppType } from "@arbitrum-connect/api";
import { GetPriceResponse } from "@arbitrum-connect/api/src/routes/prices/get.routes";
import envParsed from "@/envParsed";
import { minutesToMilliseconds } from "date-fns";

async function fetchPrices(): Promise<GetPriceResponse> {
  const client = hc<AppType>(envParsed().API_URL);

  const response = await client.api.prices.$get();

  if (!response.ok) {
    throw new Error("Failed to fetch ETH price");
  }

  return (await response.json()) as GetPriceResponse;
}

export default function createPricesQueryOptions({ enabled }: { enabled?: boolean }) {
  return queryOptions({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    staleTime: minutesToMilliseconds(5),
    refetchInterval: minutesToMilliseconds(5),
    enabled,
  });
}

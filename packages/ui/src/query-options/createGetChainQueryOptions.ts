import { allChainsList } from "@arbitrum-connect/utils";
import { queryOptions } from "@tanstack/react-query";

export default function createGetChainQueryOptions(chainId: number | null | undefined) {
  return queryOptions({
    queryKey: ["chain", chainId],
    queryFn: () => allChainsList.find((c) => c.chainId === chainId),
    staleTime: Infinity,
    enabled: !!chainId,
  });
}

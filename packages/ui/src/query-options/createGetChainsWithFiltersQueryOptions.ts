import { allChainsList, featuredChains, orbitsChains } from "@arbitrum-connect/utils";
import { queryOptions } from "@tanstack/react-query";

function getChainsWithFilters(
  isFeatured: boolean,
  showTestnets: boolean,
  search: string | null | undefined,
) {
  const chainsByType = isFeatured ? featuredChains : orbitsChains;

  const chainsToFilter = showTestnets ? chainsByType.testnet : chainsByType.mainnet;

  const filteredChains = chainsToFilter
    .filter((c) => c.parentChainId > 0)
    .filter((c) => allChainsList.find((cl) => cl.chainId === c.parentChainId))
    .filter((chain) => !search || chain.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  return filteredChains;
}

export default function createGetChainsWithFiltersQueryOptions(filters: {
  showTestnets: boolean;
  search: string | null | undefined;
  isFeatured: boolean;
}) {
  return queryOptions({
    queryKey: ["chains", filters.isFeatured, filters.showTestnets, filters.search],
    queryFn: () => getChainsWithFilters(filters.isFeatured, filters.showTestnets, filters.search),
    staleTime: Infinity,
    initialData: getChainsWithFilters(filters.isFeatured, filters.showTestnets, filters.search),
  });
}

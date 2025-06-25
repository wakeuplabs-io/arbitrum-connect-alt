import createGetChainsWithFiltersQueryOptions from "@/query-options/createGetChainsWithFiltersQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useDebounce from "./useDebounce";

export default function useChainSelector() {
  const [showTestnets, setShowTestnets] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);

  const [isOpen, setIsOpen] = useState(false);

  const { data: filteredFeaturedChains } = useQuery(
    createGetChainsWithFiltersQueryOptions({
      isFeatured: true,
      showTestnets,
      search: debouncedSearch,
    }),
  );

  const { data: filteredOrbitChains } = useQuery(
    createGetChainsWithFiltersQueryOptions({
      isFeatured: false,
      showTestnets,
      search: debouncedSearch,
    }),
  );

  const [childChain, setChildChain] = useState(filteredFeaturedChains[0]);

  return {
    childChain,
    setChildChain,
    isOpen,
    setIsOpen,
    search,
    setSearch,
    showTestnets,
    setShowTestnets,
    filteredFeaturedChains,
    filteredOrbitChains,
  } as const;
}
export type ChainSelectorProps = ReturnType<typeof useChainSelector>;

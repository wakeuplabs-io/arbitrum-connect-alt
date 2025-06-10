import { allChains, featuredChains, orbitsChains } from "@/blockchain/chains";
import debounce from "lodash/debounce";
import { useCallback, useMemo, useState } from "react";

const chainsList = [...allChains.testnet, ...allChains.mainnet];

export default function useChainSelector() {
  const [showTestnets, setShowTestnets] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fChains = useMemo(
    () =>
      showTestnets
        ? featuredChains.testnet
            .filter((c) => c.parentChainId > 0)
            .filter((c) => chainsList.find((cl) => cl.chainId === c.parentChainId))
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        : featuredChains.mainnet
            .filter((c) => c.parentChainId > 0)
            .filter((c) => chainsList.find((cl) => cl.chainId === c.parentChainId))
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
    [showTestnets],
  );

  const oChains = useMemo(
    () =>
      showTestnets
        ? orbitsChains.testnet
            .filter((c) => c.parentChainId > 0)
            .filter((c) => chainsList.find((cl) => cl.chainId === c.parentChainId))
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        : orbitsChains.mainnet
            .filter((c) => c.parentChainId > 0)
            .filter((c) => chainsList.find((cl) => cl.chainId === c.parentChainId))
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
    [showTestnets],
  );

  const [childChain, setChildChain] = useState(fChains[0]);
  const [isOpen, setIsOpen] = useState(false);

  // Update search immediately for responsive UI
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  // Debounce the actual filtering operation
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    [],
  );

  // Update both immediate and debounced search
  const updateSearch = useCallback(
    (value: string) => {
      handleSearchChange(value);
      debouncedSetSearch(value);
    },
    [handleSearchChange, debouncedSetSearch],
  );

  const filteredFeaturedChains = useMemo(
    () =>
      fChains.filter((chain) => chain.name.toLowerCase().includes(debouncedSearch.toLowerCase())),
    [fChains, debouncedSearch],
  );

  const filteredOrbitChains = useMemo(
    () =>
      oChains.filter((chain) => chain.name.toLowerCase().includes(debouncedSearch.toLowerCase())),
    [oChains, debouncedSearch],
  );

  const parentChain = useMemo(
    () => chainsList.find((chain) => chain.chainId === childChain.parentChainId),
    [childChain.parentChainId],
  );

  return {
    childChain,
    setChildChain,
    parentChain,
    isOpen,
    setIsOpen,
    search,
    setSearch: updateSearch,
    showTestnets,
    setShowTestnets,
    filteredFeaturedChains,
    filteredOrbitChains,
  } as const;
}

export type ChainSelectorProps = ReturnType<typeof useChainSelector>;

import { useSetChain } from "@web3-onboard/react";
import { fromHex } from "@arbitrum-connect/utils";
import { useQuery } from "@tanstack/react-query";
import createGetChainQueryOptions from "@/query-options/createGetChainQueryOptions";

export const useNetwork = () => {
  const [{ connectedChain, settingChain }, setChain] = useSetChain();

  const chainId = connectedChain?.id ? fromHex(connectedChain.id) : null;

  const { data: chain } = useQuery(createGetChainQueryOptions(chainId));

  const id = connectedChain?.id || null;
  const name = chain?.name || null;
  const icon = chain?.bridgeUiConfig.network.logo || null;
  const isSettingNetworkLoading = settingChain;

  const connectedChainData = {
    id,
    name,
    icon,
  };

  return [connectedChainData, setChain, isSettingNetworkLoading] as const;
};

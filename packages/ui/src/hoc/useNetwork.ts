import { useSetChain } from "@web3-onboard/react";
import { allChainsList, toHex } from "@arbitrum-connect/utils";

export const useNetwork = () => {
  const [{ connectedChain, settingChain }, setChain] = useSetChain();

  const matched = connectedChain
    ? allChainsList.find((c) => toHex(c.chainId) === connectedChain.id)
    : null;

  const id = connectedChain?.id || null;
  const name = matched?.name || null;
  const icon = matched?.bridgeUiConfig.network.logo || null;
  const isSettingNetworkLoading = settingChain;

  const connectedChainData = {
    id,
    name,
    icon,
  };

  return [connectedChainData, setChain, isSettingNetworkLoading] as const;
};

import { ETH_NATIVE_TOKEN_DATA, allChainsList, toHex } from "@arbitrum-connect/utils";
import appIcon from "@/hoc/app-icon";
import type { AppMetadata, Chain } from "@web3-onboard/common";
import injectedModule from "@web3-onboard/injected-wallets";
import { Web3OnboardProvider, init } from "@web3-onboard/react";
import { PropsWithChildren } from "react";

const injected = injectedModule({
  filter: {
    shouldPreventProviderInjection: true,
  },
});

const wallets = [injected];

const chains: Chain[] = allChainsList.map((chain) => {
  const nativeTokenData = chain.bridgeUiConfig?.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  return {
    id: toHex(chain.chainId),
    token: nativeTokenData.symbol,
    label: chain.name,
    rpcUrl: chain.rpcUrl,
    icon: nativeTokenData.logoUrl,
  };
});

const appMetadata: AppMetadata = {
  name: "Arbitrum Connect",
  icon: appIcon,
  description:
    "Arbitrum Connect is a dApp that makes it easy to move funds from any chain in the Arbitrum ecosystem back to the parent chain.",
  recommendedInjectedWallets: [
    { name: "MetaMask", url: "https://metamask.io" },
    { name: "Rabby", url: "https://rabby.io/" },
  ],
};

const web3Onboard = init({
  wallets,
  chains,
  appMetadata,
  connect: {
    autoConnectAllPreviousWallet: true,
    showSidebar: false,
    removeWhereIsMyWalletWarning: true,
  },
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
  // Disable ENS resolution to avoid reverse lookup errors
  theme: "light",
  disableFontDownload: true,
  notify: {
    enabled: false,
  },
});

export default function Web3Provider({ children }: PropsWithChildren) {
  return <Web3OnboardProvider web3Onboard={web3Onboard}>{children}</Web3OnboardProvider>;
}

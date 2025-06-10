import { ETH_NATIVE_TOKEN_DATA } from "@/blockchain/chainsJsonType";
import { allChains } from "@/blockchain/chains";
import Icons from "@/shared/icons";
import type { AppMetadata, Chain } from "@web3-onboard/common";
import injectedModule from "@web3-onboard/injected-wallets";
import { Web3OnboardProvider, init } from "@web3-onboard/react";
import { PropsWithChildren } from "react";

const chainList = [...allChains.mainnet, ...allChains.testnet];

const injected = injectedModule({
  filter: {
    shouldPreventProviderInjection: true,
  },
});

const wallets = [injected];

const chains: Chain[] = chainList.map((chain) => {
  const nativeTokenData = chain.bridgeUiConfig.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  return {
    id: `0x${chain.chainId.toString(16)}`,
    token: nativeTokenData.symbol,
    label: chain.name,
    rpcUrl: chain.rpcUrl,
    icon: chain.bridgeUiConfig.network.logo,
  };
});

const appMetadata: AppMetadata = {
  name: "Arbitrum Connect",
  icon: Icons.LogoString(),
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
  },
});

export default function Web3Provider({ children }: PropsWithChildren) {
  return <Web3OnboardProvider web3Onboard={web3Onboard}>{children}</Web3OnboardProvider>;
}

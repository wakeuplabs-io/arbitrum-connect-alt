import { WalletState } from "@web3-onboard/core";
import { ethers } from "ethers";

export default function getEthersProvider(wallet: WalletState | null | undefined) {
  if (!wallet?.provider) return null;

  return new ethers.providers.Web3Provider(wallet.provider, "any");
}

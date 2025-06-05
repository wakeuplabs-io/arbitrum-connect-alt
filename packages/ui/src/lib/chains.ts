import { ChainsJsonType } from "@/blockchain/chainsJsonType";
import featuredChainsJson from "@/blockchain/featuredChains.json";
import orbitsChainsJson from "@/blockchain/orbitChains.json";

export const featuredChains: ChainsJsonType = featuredChainsJson as unknown as ChainsJsonType;
export const orbitsChains: ChainsJsonType = orbitsChainsJson as unknown as ChainsJsonType;

export const NETWORK_CHOICES = ["testnet", "mainnet"] as const;

export type Network = (typeof NETWORK_CHOICES)[number];

export const allChains = {
  testnet: [...featuredChains.testnet, ...orbitsChains.testnet],
  mainnet: [...featuredChains.mainnet, ...orbitsChains.mainnet],
};

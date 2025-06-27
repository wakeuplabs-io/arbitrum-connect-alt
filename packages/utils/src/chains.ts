import { ChainsJsonType } from "./chainsJsonType";
import featuredChainsJson from "./featuredChains.json";
import orbitsChainsJson from "./orbitChains.json";

export const featuredChains: ChainsJsonType = featuredChainsJson as unknown as ChainsJsonType;
export const orbitsChains: ChainsJsonType = orbitsChainsJson as unknown as ChainsJsonType;

export const NETWORK_CHOICES = ["testnet", "mainnet"] as const;

export type Network = (typeof NETWORK_CHOICES)[number];

export const allChainsList = [
  ...featuredChains.testnet,
  ...featuredChains.mainnet,
  ...orbitsChains.testnet,
  ...orbitsChains.mainnet,
];

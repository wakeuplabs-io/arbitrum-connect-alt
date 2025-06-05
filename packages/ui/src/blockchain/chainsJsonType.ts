export const NATIVE_TOKEN_DECIMALS = 18;

export const ETH_NATIVE_TOKEN_DATA = {
  name: "Ether",
  symbol: "ETH",
  logoUrl: "/images/EthereumLogoRound.svg",
};

export type ChainsJsonType = {
  mainnet: ChainData[];
  testnet: ChainData[];
};

export type ChainData = {
  chainId: number;
  parentChainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  ethBridge: {
    bridge: string;
    inbox: string;
    outbox: string;
    rollup: string;
    sequencerInbox: string;
  };
  nativeToken: string | undefined;
  isCustom: boolean;
  isTestnet: boolean;
  isOrbit: boolean;
  confirmPeriodBlocks: number;
  tokenBridge: {
    parentCustomGateway: string;
    parentErc20Gateway: string;
    parentGatewayRouter: string;
    parentMultiCall: string;
    parentProxyAdmin: string;
    parentWeth: string;
    parentWethGateway: string;
    childCustomGateway: string;
    childErc20Gateway: string;
    childGatewayRouter: string;
    childMultiCall: string;
    childProxyAdmin: string;
    childWeth: string;
    childWethGateway: string;
  };
  bridgeUiConfig: {
    color: string;
    nativeTokenData?: {
      name: string;
      symbol: string;
      logoUrl: string;
    };
    network: {
      logo: string;
    };
  };
};

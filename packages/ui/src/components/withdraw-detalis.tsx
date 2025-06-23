import { ChainData, ETH_NATIVE_TOKEN_DATA } from "@arbitrum-connect/utils";
import useLoaingDots from "@/hoc/useLoadingDots";
import shortenAddress from "@/lib/shortenAddress";
import { Fuel, Wallet } from "lucide-react";
import UsdPrice from "./usd-price";
import useWallet from "@/hoc/useWallet";

export default function WithdrawDetails({
  childChain,
  formattedEstimatedGas,
  isWithdrawRequestLoading,
}: {
  childChain: ChainData;
  formattedEstimatedGas: string;
  isWithdrawRequestLoading: boolean;
}) {
  const [, walletAddress] = useWallet();

  const formattedEstimatedGasWithLoadingDots = useLoaingDots(
    formattedEstimatedGas,
    isWithdrawRequestLoading,
  );

  const nativeTokenData = childChain.bridgeUiConfig.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  return (
    <div className={"w-full rounded-3xl border bg-card p-6 flex flex-col gap-4 max-w-3xl mx-auto"}>
      {/* Address Row */}
      <div className="flex items-center gap-8 flex-wrap">
        <div className="flex items-center gap-4 flex-1">
          <Wallet className="size-6 text-primary" />
          <span className="font-extralight text-primary">Address</span>
        </div>
        <div className="flex items-center">
          <span className="font-normal text-primary">{shortenAddress(walletAddress)}</span>
        </div>
      </div>
      {/* Network Fees Row */}
      <div className="flex items-center gap-8 flex-wrap">
        <div className="flex items-center gap-4 flex-1">
          <Fuel className="size-6 text-primary" />
          <span className="font-extralight text-primary">Network fees</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <UsdPrice
            ethAmount={formattedEstimatedGas}
            isLoading={isWithdrawRequestLoading}
            disabled={nativeTokenData.symbol !== ETH_NATIVE_TOKEN_DATA.symbol}
          />
          <span className="font-normal text-primary">
            {formattedEstimatedGasWithLoadingDots} {nativeTokenData.symbol}
          </span>
        </div>
      </div>
    </div>
  );
}

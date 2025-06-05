import { ChainData, ETH_NATIVE_TOKEN_DATA } from "@/blockchain/chainsJsonType";
import shortenAddress from "@/lib/shortenAddress";
import { useConnectWallet } from "@web3-onboard/react";
import { FileText, Wallet } from "lucide-react";

export default function WithdrawDetails({
  childChain,
  formattedEstimatedGas,
}: {
  childChain: ChainData;
  formattedEstimatedGas: string;
}) {
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0]?.address;

  const nativeTokenData = childChain.bridgeUiConfig.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  return (
    <div className={"w-full rounded-3xl border bg-card p-6 flex flex-col gap-4 max-w-3xl mx-auto"}>
      {/* Address Row */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 flex-1">
          <Wallet className="size-6 text-primary" />
          <span className="font-extralight text-primary">Address</span>
        </div>
        <div className="flex items-center">
          <span className="rounded-full border px-6 py-2 font-normal font-mono text-primary bg-background">
            {shortenAddress(walletAddress)}
          </span>
        </div>
      </div>
      {/* Network Fees Row */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 flex-1">
          <FileText className="size-6 text-primary" />
          <span className="font-extralight text-primary">Network fees</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-normal text-primary">
            {formattedEstimatedGas} {nativeTokenData.symbol}
          </span>
        </div>
      </div>
    </div>
  );
}

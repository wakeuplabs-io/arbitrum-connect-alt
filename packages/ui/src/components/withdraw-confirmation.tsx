"use client";

import { ChainData, ETH_NATIVE_TOKEN_DATA } from "@/blockchain/chainsJsonType";
import { Button } from "@/components/ui/button";
import envParsed from "@/envParsed";
import getEthersProvider from "@/lib/getEthersProvider";
import { withdraw } from "@/lib/withdraw";
import { type ChildToParentTransactionRequest } from "@arbitrum/sdk";
import { type WalletState } from "@web3-onboard/core";
import { BigNumber } from "ethers";
import { hc } from "hono/client";
import { useTransition } from "react";
import WithdrawDetails from "./withdraw-detalis";
import type { AppType } from "@arbitrum-connect/api";

interface WithdrawConfirmationProps {
  childChain: ChainData;
  amount: string;
  withdrawRequest: ChildToParentTransactionRequest;
  estimatedGas: BigNumber;
  formattedEstimatedGas: string;
  wallet: WalletState;
  onBack: () => void;
  onSuccess: () => void;
}

export default function WithdrawConfirmation({
  childChain,
  amount,
  withdrawRequest,
  estimatedGas,
  formattedEstimatedGas,
  wallet,
  onBack,
  onSuccess,
}: WithdrawConfirmationProps) {
  const [isPending, startTransition] = useTransition();
  const walletAddress = wallet?.accounts[0]?.address;
  const client = hc<AppType>(envParsed().API_URL);
  const nativeTokenData = childChain.bridgeUiConfig.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  const handleConfirm = async () => {
    if (!walletAddress || !withdrawRequest || !estimatedGas || !wallet) return;

    startTransition(() => {
      (async () => {
        try {
          const provider = getEthersProvider(wallet);
          if (!provider) throw new Error("No provider");

          const signer = provider.getSigner();
          const txHash = await withdraw(childChain, withdrawRequest, signer, estimatedGas);

          // Create activity in the API using Hono client
          const response = await client.api.activities.$post({
            json: {
              walletAddress,
              withdrawAmount: amount,
              childChainWithdrawTxHash: txHash,
              childChainId: childChain.chainId,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to create activity");
          }

          onSuccess();
        } catch (error) {
          console.error("Error submitting withdrawal:", error);
          // You might want to show an error message to the user here
        }
      })();
    });
  };

  return (
    <div className="space-y-4">
      <div className="w-full overflow-hidden rounded-xl border bg-card p-6 text-center">
        <span className="text-xs font-extralight text-muted-foreground">Amount to withdraw</span>
        <div className="flex items-center justify-center gap-2 pt-1">
          <img src={nativeTokenData.logoUrl} alt={nativeTokenData.name} className="size-8" />
          <span className="text-4xl font-medium tracking-tighter">
            {amount} {nativeTokenData.symbol}
          </span>
        </div>
      </div>

      <WithdrawDetails
        childChain={childChain}
        formattedEstimatedGas={formattedEstimatedGas}
        isWithdrawRequestLoading={false}
      />

      <div className="pt-4">
        <Button onClick={handleConfirm} className="w-full" disabled={isPending}>
          {isPending ? "Processing..." : "Confirm Withdraw"}
        </Button>
      </div>
      <div>
        <Button onClick={onBack} variant="ghost" className="w-full">
          Back
        </Button>
      </div>
    </div>
  );
}

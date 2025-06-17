"use client";

import { ChainData, ETH_NATIVE_TOKEN_DATA, toHex } from "@arbitrum-connect/utils";
import { Button } from "@/components/ui/button";
import envParsed from "@/envParsed";
import getEthersProvider from "@/lib/getEthersProvider";
import { withdraw } from "@/lib/withdraw";
import { hc } from "hono/client";
import { useState } from "react";
import WithdrawDetails from "./withdraw-detalis";
import type { AppType } from "@arbitrum-connect/api";
import useWithdrawRequest from "@/hoc/useWithdrawRequest";
import { useConnectWallet } from "@web3-onboard/react";
import { ChevronLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useTransitions from "@/hoc/useTransitions";
import { useNetwork } from "@/hoc/useNetwork";

interface WithdrawConfirmationProps {
  childChain: ChainData;
  parentChain: ChainData;
  amount: string;
  isBalanceLoading: boolean;
  onBack: () => void;
  onSuccess: (activityId: number) => void;
}

export default function WithdrawConfirmation({
  childChain,
  parentChain,
  amount,
  isBalanceLoading,
  onBack,
  onSuccess,
}: WithdrawConfirmationProps) {
  const [{ wallet }] = useConnectWallet();
  const [connectedChain, setChain, isSettingNetworkLoading] = useNetwork();

  const walletAddress = wallet?.accounts[0]?.address;
  const [understoodProcess, setUnderstoodProcess] = useState(false);
  const [understoodTimes, setUnderstoodTimes] = useState(false);

  const [isExecutingWithdraw, startExecutingWithdraw] = useTransitions();
  const client = hc<AppType>(envParsed().API_URL);
  const nativeTokenData = childChain.bridgeUiConfig?.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  const {
    withdrawRequest,
    estimatedGas,
    formattedEstimatedGas,
    isLoading: isWithdrawRequestLoading,
  } = useWithdrawRequest(childChain, amount);

  const handleConfirm = async () => {
    if (!walletAddress || !withdrawRequest || !estimatedGas || !wallet) return;

    await startExecutingWithdraw(async () => {
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

      const activity = await response.json();

      onSuccess(activity.id);
    });
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon">
          <ChevronLeft />
        </Button>
        <h1 className="text-lg font-semibold">Review and Initiate Withdraw</h1>
      </div>
      <div className="overflow-hidden w-full rounded-3xl border bg-card p-6 text-center">
        <span className="text-xs font-extralight text-muted-foreground">Amount to withdraw</span>
        <div className="flex items-center justify-center gap-2 pt-1">
          <img src={nativeTokenData.logoUrl} alt={nativeTokenData.name} className="size-8" />
          <span className="text-5xl font-medium tracking-tighter">
            {amount} {nativeTokenData.symbol}
          </span>
        </div>
      </div>

      <WithdrawDetails
        childChain={childChain}
        formattedEstimatedGas={formattedEstimatedGas}
        isWithdrawRequestLoading={isWithdrawRequestLoading}
      />

      <div className="overflow-hidden w-full rounded-3xl border bg-card p-6 flex flex-col gap-4">
        <div className="p-4 text-sm text-center rounded-lg bg-blue-50 text-blue-900">
          You are about to withdraw funds from {childChain.name} to {parentChain?.name}. This
          process requires 2 transactions with network fees. Any doubts?{" "}
          <a
            href="https://github.com/wakeuplabs-io/arbitrum-connect/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Learn More
          </a>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms1"
            onCheckedChange={(checked: boolean) => setUnderstoodProcess(Boolean(checked))}
            className="mt-1"
          />
          <Label htmlFor="terms1" className="text-sm font-light text-muted-foreground">
            I understand the process takes about 15 minutes before I can claim my funds on{" "}
            {parentChain?.name}. If the transaction doesn&apos;t go through, we&apos;ll guide you
            with an alternative process.
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms2"
            onCheckedChange={(checked: boolean) => setUnderstoodTimes(Boolean(checked))}
            className="mt-1"
          />
          <Label htmlFor="terms2" className="text-sm font-light text-muted-foreground">
            I understand that times and network fees are approximate and may change.
          </Label>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-4">
        {connectedChain?.id !== toHex(childChain.chainId) && (
          <Button
            onClick={() => setChain({ chainId: toHex(childChain.chainId) })}
            className="w-full"
            disabled={isSettingNetworkLoading}
          >
            {isSettingNetworkLoading && "Switching..."}
            {!isSettingNetworkLoading && `Switch to ${childChain.name}`}
          </Button>
        )}

        {connectedChain?.id === toHex(childChain.chainId) && (
          <Button
            onClick={handleConfirm}
            className="w-full"
            disabled={
              isWithdrawRequestLoading ||
              isBalanceLoading ||
              isExecutingWithdraw ||
              !understoodProcess ||
              !understoodTimes
            }
          >
            {isExecutingWithdraw && "Executing..."}
            {!isExecutingWithdraw && (isWithdrawRequestLoading || isBalanceLoading) && "Loading..."}
            {!isExecutingWithdraw &&
              !isWithdrawRequestLoading &&
              !isBalanceLoading &&
              "Confirm Withdraw"}
          </Button>
        )}
      </div>
    </div>
  );
}

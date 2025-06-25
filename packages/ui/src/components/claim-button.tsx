import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { claim } from "@/lib/claim";
import { ETH_NATIVE_TOKEN_DATA, toHex } from "@arbitrum-connect/utils";
import { useState } from "react";
import { X } from "lucide-react";
import useBalance from "@/hooks/useBalance";
import getEthersProvider from "@/lib/getEthersProvider";
import useLoaingDots from "@/hooks/useLoadingDots";
import { cn } from "@/lib/utils";
import { GetActivityResponse } from "@arbitrum-connect/api/src/routes/activities/get.routes";
import { toast } from "sonner";
import { useNetwork } from "@/hooks/useNetwork";
import useWallet from "@/hooks/useWallet";
import createClaimGasEstimationQueryOptions from "@/query-options/createClaimGasEstimationQueryOptions";
import createGetChainQueryOptions from "@/query-options/createGetChainQueryOptions";
import createGetActivityQueryOptions from "@/query-options/createGetActivityQueryOptions";
import useTransitions from "@/hooks/useTransitions";

interface ClaimButtonProps {
  activity: GetActivityResponse;
  isDisabled: boolean;
}

export default function ClaimButton({ activity, isDisabled }: ClaimButtonProps) {
  const [wallet] = useWallet();
  const [isClaiming, startClaiming] = useTransitions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectedChain, setChain, isSettingNetworkLoading] = useNetwork();

  const queryClient = useQueryClient();

  const { data: childChain } = useQuery(createGetChainQueryOptions(activity.childChainId));
  const { data: parentChain } = useQuery(createGetChainQueryOptions(childChain?.parentChainId));

  const { formattedBalance, balance, isLoading: isBalanceLoading } = useBalance(parentChain);

  const formattedBalanceWithLoadingDots = useLoaingDots(formattedBalance, isBalanceLoading);

  const { data: gasEstimation, status: gasEstimationStatus } = useQuery(
    createClaimGasEstimationQueryOptions(parentChain),
  );

  const gasEstimationWithLoadingDots = useLoaingDots(
    gasEstimation?.gasCostInEther ?? "0",
    gasEstimationStatus === "pending",
  );

  const handleClaim = async () => {
    if (!wallet || !childChain || !parentChain || !gasEstimation) return;

    await startClaiming(async () => {
      const provider = getEthersProvider(wallet);
      if (!provider) throw new Error("No provider");

      const signer = provider.getSigner();
      await claim(
        childChain,
        parentChain,
        signer,
        activity.childChainWithdrawTxHash,
        gasEstimation,
      );

      queryClient.invalidateQueries(createGetActivityQueryOptions(activity.id));

      toast.success("Claim successful", {
        description: "Your funds have been claimed successfully",
      });
    });

    setIsDialogOpen(false);
  };

  if (!childChain || !parentChain) return null;

  const childNativeTokenData = childChain.bridgeUiConfig?.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;
  const parentNativeTokenData =
    parentChain.bridgeUiConfig?.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  const insufficientFunds =
    !isBalanceLoading &&
    gasEstimationStatus !== "pending" &&
    balance.lt(gasEstimation?.gasCost ?? 0);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full bg-blue-500 text-white hover:bg-blue-400"
          disabled={isDisabled}
        >
          Claim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl sm:h-fit flex flex-col" hideCloseButton>
        <DialogHeader className="flex flex-row justify-between">
          <DialogTitle className="text-2xl text-primary">
            <span className="font-extralight">Claim on: </span>
            <span className="font-medium">{parentChain.name}</span>
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
            <X className="size-6 text-primary stroke-[1]" />
          </Button>
        </DialogHeader>

        <div className="mt-6 space-y-6 flex-1 flex flex-col">
          <div className="overflow-hidden w-full rounded-3xl border bg-card p-6 text-center">
            <span className="text-xs font-extralight text-muted-foreground">Amount to claim</span>
            <div className="flex items-center justify-center gap-2 pt-1">
              <img
                src={childNativeTokenData.logoUrl}
                alt={childNativeTokenData.name}
                className="size-8"
              />
              <span className="text-5xl font-medium tracking-tighter">
                {activity.withdrawAmount} {childNativeTokenData.symbol}
              </span>
            </div>
          </div>

          <div className="overflow-hidden w-full rounded-3xl border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm font-extralight text-muted-foreground">Your Balance</span>
              <span className="font-medium">
                {formattedBalanceWithLoadingDots} {parentNativeTokenData.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm font-extralight text-muted-foreground">Network fees</span>
              <span className="font-medium">
                ~{gasEstimationWithLoadingDots} {parentNativeTokenData.symbol}
              </span>
            </div>
          </div>

          <div className="p-4 text-sm text-center rounded-lg bg-blue-50 text-blue-900 space-y-2">
            <p className="font-medium p-0 m-0">
              You are about to claim your funds on {parentChain.name}.
            </p>
            <p className="font-extralight p-0 m-0">
              Please review the details carefully before proceeding.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          {connectedChain?.id !== toHex(parentChain.chainId) && (
            <Button
              onClick={() => setChain({ chainId: toHex(parentChain.chainId) })}
              className="w-full"
              disabled={isSettingNetworkLoading}
            >
              {isSettingNetworkLoading && "Switching..."}
              {!isSettingNetworkLoading && `Switch to ${parentChain.name}`}
            </Button>
          )}
          {connectedChain?.id === toHex(parentChain.chainId) && (
            <Button
              onClick={handleClaim}
              disabled={
                isClaiming ||
                gasEstimationStatus === "pending" ||
                isBalanceLoading ||
                insufficientFunds
              }
              className={cn(
                "w-full bg-blue-500 text-white hover:bg-blue-400",
                insufficientFunds && "bg-gray-300 text-gray-500 cursor-not-allowed",
              )}
            >
              {isClaiming && "Claiming..."}
              {!insufficientFunds && !isClaiming && "Confirm Claim"}
              {insufficientFunds && "Insufficient funds"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

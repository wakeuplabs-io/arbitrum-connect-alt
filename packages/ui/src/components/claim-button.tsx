import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { estimateGasLimitClaim, claim } from "@/lib/claim";
import { ETH_NATIVE_TOKEN_DATA } from "@/blockchain/chainsJsonType";
import { allChains } from "@/blockchain/chains";
import { useState } from "react";
import { X } from "lucide-react";
import useBalance from "@/hoc/useBalance";
import getEthersProvider from "@/lib/getEthersProvider";
import useLoaingDots from "@/hoc/useLoadingDots";
import { cn } from "@/lib/utils";
import { GetActivityResponse } from "@arbitrum-connect/api/src/routes/activities/get.routes";
import { toast } from "sonner";
import toHex from "@/blockchain/toHex";

interface ClaimButtonProps {
  activity: GetActivityResponse;
}

export default function ClaimButton({ activity }: ClaimButtonProps) {
  const [{ wallet }] = useConnectWallet();
  const [isExecutingClaim, setIsExecutingClaim] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [
    {
      connectedChain, // the current chain the user's wallet is connected to
      settingChain, // boolean indicating if the chain is in the process of being set
    },
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain();

  const queryClient = useQueryClient();

  const childChain = allChains.mainnet
    .concat(allChains.testnet)
    .find((c) => c.chainId === activity.childChainId);
  const parentChain = childChain
    ? allChains.mainnet
        .concat(allChains.testnet)
        .find((c) => c.chainId === childChain.parentChainId)
    : null;

  const { formattedBalance, balance, isLoading: isBalanceLoading } = useBalance(parentChain);

  const formattedBalanceWithLoadingDots = useLoaingDots(formattedBalance, isBalanceLoading);

  const { data: gasEstimation, isLoading: isGasEstimationLoading } = useQuery({
    queryKey: ["claimGasEstimation", parentChain?.chainId],
    queryFn: async () => {
      if (!parentChain) throw new Error("Parent chain not found");
      return await estimateGasLimitClaim(parentChain);
    },
    enabled: !!parentChain,
  });

  const gasEstimationWithLoadingDots = useLoaingDots(
    gasEstimation?.gasCostInEther ?? "0",
    isGasEstimationLoading,
  );

  const handleClaim = async () => {
    if (!wallet || !childChain || !parentChain || !gasEstimation) return;

    try {
      setIsExecutingClaim(true);
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

      toast.success("Claim successful", {
        description: "Your funds have been claimed successfully",
      });
    } catch (error) {
      console.error("Error claiming:", error);
      toast.error("Error claiming", {
        description: "Please try again later",
      });
    } finally {
      setIsDialogOpen(false);
      setIsExecutingClaim(false);
      queryClient.invalidateQueries({ queryKey: ["activity", activity.id] });
    }
  };

  if (!childChain || !parentChain) return null;

  const nativeTokenData = parentChain.bridgeUiConfig.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  const insufficientFunds =
    !isBalanceLoading && !isGasEstimationLoading && balance.lt(gasEstimation?.gasCost ?? 0);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-blue-500 text-white hover:bg-blue-400">
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
              <img src={nativeTokenData.logoUrl} alt={nativeTokenData.name} className="size-8" />
              <span className="text-5xl font-medium tracking-tighter">
                {activity.withdrawAmount} {nativeTokenData.symbol}
              </span>
            </div>
          </div>

          <div className="overflow-hidden w-full rounded-3xl border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm font-extralight text-muted-foreground">Your Balance</span>
              <span className="font-medium">
                {formattedBalanceWithLoadingDots} {nativeTokenData.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm font-extralight text-muted-foreground">Network fees</span>
              <span className="font-medium">
                ~{gasEstimationWithLoadingDots} {nativeTokenData.symbol}
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
              disabled={settingChain}
            >
              {settingChain && "Switching..."}
              {!settingChain && `Switch to ${parentChain.name}`}
            </Button>
          )}
          {connectedChain?.id === toHex(parentChain.chainId) && (
            <Button
              onClick={handleClaim}
              disabled={
                isExecutingClaim || isGasEstimationLoading || isBalanceLoading || insufficientFunds
              }
              className={cn(
                "w-full bg-blue-500 text-white hover:bg-blue-400",
                insufficientFunds && "bg-gray-300 text-gray-500 cursor-not-allowed",
              )}
            >
              {isExecutingClaim && "Claiming..."}
              {!insufficientFunds && !isExecutingClaim && "Confirm Claim"}
              {insufficientFunds && "Insufficient funds"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

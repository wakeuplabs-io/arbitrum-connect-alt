import { ChainData } from "@arbitrum-connect/utils";
import { createWithdrawalRequest, estimateGasLimitWithdrawalRequest } from "@/lib/withdraw";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import useWallet from "./useWallet";

const REFRESH_INTERVAL = 60000; // 1 minute

export default function useWithdrawRequest(childChain: ChainData, amount: string) {
  const [, walletAddress] = useWallet();

  // Query for withdrawal request
  const {
    data: withdrawRequest,
    error: withdrawRequestError,
    status: withdrawRequestStatus,
  } = useQuery({
    queryKey: ["withdrawRequest", childChain?.chainId, amount, walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("No wallet address");
      return await createWithdrawalRequest(childChain, amount, walletAddress);
    },
    enabled: Boolean(childChain && amount && walletAddress),
  });

  // Query for gas estimation with 5 second refetch interval
  const {
    data: estimatedGas,
    status: estimatedGasStatus,
    error: estimateGasError,
  } = useQuery({
    queryKey: ["estimatedGas", childChain?.chainId, withdrawRequest],
    queryFn: async () => {
      if (!withdrawRequest) throw new Error("No withdrawal request");
      return await estimateGasLimitWithdrawalRequest(childChain, withdrawRequest);
    },
    enabled: Boolean(childChain && withdrawRequest),
    refetchInterval: REFRESH_INTERVAL,
  });

  const formattedEstimatedGas = estimatedGas ? ethers.utils.formatEther(estimatedGas) : "-";

  const isLoading = withdrawRequestStatus === "pending" || estimatedGasStatus === "pending";

  const error = withdrawRequestError || estimateGasError;

  if (error) {
    console.error("error", error);
  }

  if (!childChain || !amount || !walletAddress) {
    return {
      withdrawRequest: null,
      estimatedGas: null,
      isLoading: false,
      error: null,
      formattedEstimatedGas: "0",
    };
  }

  return {
    withdrawRequest,
    estimatedGas,
    isLoading,
    error,
    formattedEstimatedGas,
  };
}

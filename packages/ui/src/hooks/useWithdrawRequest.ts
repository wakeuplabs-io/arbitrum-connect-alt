import { ChainData } from "@arbitrum-connect/utils";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import useWallet from "./useWallet";
import createWithdrawRequestQueryOptions from "@/query-options/createWithdrawRequestQueryOptions";
import createWithdrawGasEstimationQueryOptions from "@/query-options/createWithdrawGasEstimationQueryOptions";

export default function useWithdrawRequest(childChain: ChainData, amount: string) {
  const [, walletAddress] = useWallet();

  // Query for withdrawal request
  const {
    data: withdrawRequest,
    error: withdrawRequestError,
    status: withdrawRequestStatus,
  } = useQuery(createWithdrawRequestQueryOptions(childChain, amount, walletAddress));

  // Query for gas estimation with 5 second refetch interval
  const {
    data: estimatedGas,
    status: estimatedGasStatus,
    error: estimateGasError,
  } = useQuery(createWithdrawGasEstimationQueryOptions(childChain, withdrawRequest));

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

import { ChainData } from "@/blockchain/chainsJsonType";
import { createWithdrawalRequest, estimateGasLimitWithdrawalRequest } from "@/lib/withdraw";
import { useQuery } from "@tanstack/react-query";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";

const REFRESH_INTERVAL = 60000; // 1 minute

export default function useWithdrawRequest(childChain: ChainData, amount: string) {
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0]?.address;

  // Query for withdrawal request
  const {
    data: withdrawRequest,
    error: withdrawRequestError,
    isFetching: isWithdrawRequestFetching,
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
    isFetching: isFetchingEstimatedGas,
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

  const isLoading = isWithdrawRequestFetching || isFetchingEstimatedGas;

  const error = withdrawRequestError || estimateGasError;

  return {
    withdrawRequest,
    estimatedGas,
    isLoading,
    error,
    formattedEstimatedGas,
  };
}

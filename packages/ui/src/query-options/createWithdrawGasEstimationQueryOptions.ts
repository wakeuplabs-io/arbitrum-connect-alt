import { estimateGasLimitWithdrawalRequest } from "@/lib/withdraw";
import { ChainData } from "@arbitrum-connect/utils";
import { ChildToParentTransactionRequest } from "@arbitrum/sdk";
import { queryOptions } from "@tanstack/react-query";
import { minutesToMilliseconds } from "date-fns";

export default function createWithdrawGasEstimationQueryOptions(
  childChain: ChainData,
  withdrawRequest: ChildToParentTransactionRequest | undefined,
) {
  return queryOptions({
    queryKey: ["withdrawGasEstimation", childChain.chainId, withdrawRequest],
    queryFn: () => estimateGasLimitWithdrawalRequest(childChain, withdrawRequest!),
    enabled: !!withdrawRequest,
    refetchInterval: minutesToMilliseconds(1),
    staleTime: minutesToMilliseconds(1),
  });
}

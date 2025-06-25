import { createWithdrawalRequest } from "@/lib/withdraw";
import { ChainData } from "@arbitrum-connect/utils";
import { queryOptions } from "@tanstack/react-query";
import { minutesToMilliseconds } from "date-fns";

export default function createWithdrawRequestQueryOptions(
  childChain: ChainData,
  amount: string,
  walletAddress: string | null | undefined,
) {
  return queryOptions({
    queryKey: ["withdrawRequest", childChain?.chainId, amount, walletAddress],
    queryFn: () => createWithdrawalRequest(childChain, amount, walletAddress!),
    enabled: !!amount && !!walletAddress,
    staleTime: minutesToMilliseconds(1),
    refetchInterval: minutesToMilliseconds(1),
  });
}

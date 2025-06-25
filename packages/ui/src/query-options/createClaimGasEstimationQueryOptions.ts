import { estimateGasLimitClaim } from "@/lib/claim";
import { ChainData } from "@arbitrum-connect/utils";
import { queryOptions } from "@tanstack/react-query";
import { secondsToMilliseconds } from "date-fns";

export default function createClaimGasEstimationQueryOptions(
  parentChain: ChainData | null | undefined,
) {
  return queryOptions({
    queryKey: ["claimGasEstimation", parentChain?.chainId],
    queryFn: () => estimateGasLimitClaim(parentChain!),
    enabled: !!parentChain,
    staleTime: secondsToMilliseconds(30),
    refetchInterval: secondsToMilliseconds(30),
  });
}

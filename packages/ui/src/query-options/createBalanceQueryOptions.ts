import { queryOptions } from "@tanstack/react-query";
import { ChainData } from "@arbitrum-connect/utils";
import { ethers } from "ethers";
import { minutesToMilliseconds } from "date-fns";

export default function createBalanceQueryOptions(
  walletAddress: string | null | undefined,
  chain: ChainData | null | undefined,
) {
  return queryOptions({
    queryKey: ["balance", walletAddress, chain?.rpcUrl],
    queryFn: async () => {
      const provider = new ethers.providers.JsonRpcProvider(chain!.rpcUrl);
      const balance = await provider.getBalance(walletAddress!);
      const formatted = ethers.utils.formatEther(balance);
      const [whole, decimal] = formatted.split(".");
      const formattedBalance = decimal ? `${whole}.${decimal.slice(0, 5)}` : whole;

      return {
        balance,
        formattedBalance,
      };
    },
    refetchInterval: minutesToMilliseconds(1),
    enabled: !!walletAddress && !!chain,
  });
}

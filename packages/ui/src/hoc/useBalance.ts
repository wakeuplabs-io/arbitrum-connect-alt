import { ChainData } from "@arbitrum-connect/utils";
import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import useWallet from "./useWallet";

const REFRESH_INTERVAL = 60000; // 1 minute

interface UseBalanceReturn {
  balance: BigNumber;
  formattedBalance: string;
  isLoading: boolean;
}

export default function useBalance(chain: ChainData | null | undefined): UseBalanceReturn {
  const [, walletAddress] = useWallet();

  const { data: balanceData, status: balanceStatus } = useQuery({
    queryKey: ["balance", walletAddress, chain?.rpcUrl],
    queryFn: async () => {
      if (!walletAddress) {
        return {
          balance: BigNumber.from(0),
          formattedBalance: "0",
        };
      }

      const provider = new ethers.providers.JsonRpcProvider(chain?.rpcUrl);
      const balance = await provider.getBalance(walletAddress);
      const formatted = ethers.utils.formatEther(balance);
      const [whole, decimal] = formatted.split(".");
      const formattedBalance = decimal ? `${whole}.${decimal.slice(0, 5)}` : whole;

      return {
        balance,
        formattedBalance,
      };
    },
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!walletAddress && !!chain,
  });

  if (!chain || !walletAddress) {
    return {
      balance: BigNumber.from(0),
      formattedBalance: "0",
      isLoading: false,
    };
  }

  return {
    balance: balanceData?.balance ?? BigNumber.from(0),
    formattedBalance: balanceData?.formattedBalance ?? "0",
    isLoading: balanceStatus === "pending",
  };
}

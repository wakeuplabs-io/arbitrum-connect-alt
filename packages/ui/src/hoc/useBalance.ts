import { ChainData } from "@/blockchain/chainsJsonType";
import { useQuery } from "@tanstack/react-query";
import { useConnectWallet } from "@web3-onboard/react";
import { BigNumber, ethers } from "ethers";

const REFRESH_INTERVAL = 60000; // 1 minute

interface UseBalanceReturn {
  balance: BigNumber;
  formattedBalance: string;
  isLoading: boolean;
}

export default function useBalance(chain: ChainData | null | undefined): UseBalanceReturn {
  const [{ wallet }] = useConnectWallet();
  const currentWallet = wallet?.accounts[0];

  const { data: balanceData, isFetching } = useQuery({
    queryKey: ["balance", currentWallet?.address, chain?.rpcUrl],
    queryFn: async () => {
      if (!currentWallet) {
        return {
          balance: BigNumber.from(0),
          formattedBalance: "0",
        };
      }

      const provider = new ethers.providers.JsonRpcProvider(chain?.rpcUrl);
      const balance = await provider.getBalance(currentWallet.address);
      const formatted = ethers.utils.formatEther(balance);
      const [whole, decimal] = formatted.split(".");
      const formattedBalance = decimal ? `${whole}.${decimal.slice(0, 5)}` : whole;

      return {
        balance,
        formattedBalance,
      };
    },
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!currentWallet && !!chain,
    initialData: {
      balance: BigNumber.from(0),
      formattedBalance: "0",
    },
  });

  if (!chain || !currentWallet) {
    return {
      balance: BigNumber.from(0),
      formattedBalance: "0",
      isLoading: false,
    };
  }

  return {
    balance: balanceData.balance,
    formattedBalance: balanceData.formattedBalance,
    isLoading: isFetching,
  };
}

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

export default function useBalance({ childChain }: { childChain: ChainData }): UseBalanceReturn {
  const [{ wallet }] = useConnectWallet();
  const currentWallet = wallet?.accounts[0];

  const { data: balanceData, isFetching } = useQuery({
    queryKey: ["balance", currentWallet?.address, childChain.rpcUrl],
    queryFn: async () => {
      if (!currentWallet) {
        return {
          balance: BigNumber.from(0),
          formattedBalance: "0",
        };
      }

      const provider = new ethers.providers.JsonRpcProvider(childChain.rpcUrl);
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
    enabled: !!currentWallet,
    initialData: {
      balance: BigNumber.from(0),
      formattedBalance: "0",
    },
  });

  return {
    balance: balanceData.balance,
    formattedBalance: balanceData.formattedBalance,
    isLoading: isFetching,
  };
}

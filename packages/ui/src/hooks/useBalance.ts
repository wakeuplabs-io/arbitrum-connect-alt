import { ChainData } from "@arbitrum-connect/utils";
import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import useWallet from "@/hooks/useWallet";
import createBalanceQueryOptions from "@/query-options/createBalanceQueryOptions";

interface UseBalanceReturn {
  balance: BigNumber;
  formattedBalance: string;
  isLoading: boolean;
}

export default function useBalance(chain: ChainData | null | undefined): UseBalanceReturn {
  const [, walletAddress] = useWallet();

  const { data: balanceData, status: balanceStatus } = useQuery(
    createBalanceQueryOptions(walletAddress, chain),
  );

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

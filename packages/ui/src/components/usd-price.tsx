import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";
import { AppType } from "@arbitrum-connect/api";
import { GetPriceResponse } from "@arbitrum-connect/api/src/routes/prices/get.routes";
import envParsed from "@/envParsed";
import { z } from "zod";

interface UsdPriceProps {
  isLoading: boolean;
  ethAmount: string | null;
  className?: string;
  disabled?: boolean;
  addParenthesis?: boolean;
}

async function fetchEthPrice(): Promise<GetPriceResponse> {
  const client = hc<AppType>(envParsed().API_URL);

  const response = await client.api.prices.$get();

  if (!response.ok) {
    throw new Error("Failed to fetch ETH price");
  }

  return (await response.json()) as GetPriceResponse;
}

const validNumber = z.coerce.number().min(0);

export default function UsdPrice({
  ethAmount,
  disabled,
  isLoading,
  className,
  addParenthesis,
}: UsdPriceProps) {
  const { success: isValid, data: ethAmountValidated } = validNumber.safeParse(ethAmount);

  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["ethPrice"],
    queryFn: fetchEthPrice,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    enabled: !disabled && isValid && ethAmountValidated > 0,
  });

  if (disabled || !isValid || isLoading || isPriceLoading || !priceData?.ethereum?.usd) {
    return null;
  }

  const ethPriceUsd = priceData.ethereum.usd;
  const calculatedUsdValue = ethAmountValidated * ethPriceUsd;

  // Round to at least 2 decimals (minimum 0.01 if value > 0)
  const usdValue =
    calculatedUsdValue > 0
      ? Math.max(0.01, Math.round((calculatedUsdValue + Number.EPSILON) * 100) / 100)
      : 0;

  return (
    <span className={cn("font-normal text-muted-foreground", className)}>
      {addParenthesis ? `(~ $${usdValue.toFixed(2)})` : `~ $${usdValue.toFixed(2)}`}
    </span>
  );
}

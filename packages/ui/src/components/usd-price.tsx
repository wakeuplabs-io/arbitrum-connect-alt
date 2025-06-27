import { cn } from "@/lib/utils";
import createPricesQueryOptions from "@/query-options/createPricesQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

interface UsdPriceProps {
  isLoading: boolean;
  ethAmount: string | null;
  className?: string;
  disabled?: boolean;
  addParenthesis?: boolean;
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

  const { data: priceData, isLoading: isPriceLoading } = useQuery(
    createPricesQueryOptions({ enabled: !disabled && isValid && ethAmountValidated > 0 }),
  );

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

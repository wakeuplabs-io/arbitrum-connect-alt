"use client";

import { ChainData, ETH_NATIVE_TOKEN_DATA } from "@arbitrum-connect/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useWithdrawRequest from "@/hoc/useWithdrawRequest";
import getDecimalCount from "@/lib/getDecimalCount";

import { zodResolver } from "@hookform/resolvers/zod";
import { useConnectWallet } from "@web3-onboard/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ConnectWallet from "./connect-wallet";
import WithdrawDetails from "./withdraw-detalis";

export default function WithdrawForm({
  childChain,
  formattedBalance,
  isBalanceLoading,
  onWithdrawRequest,
}: {
  childChain: ChainData;
  formattedBalance: string;
  isBalanceLoading: boolean;
  onWithdrawRequest: (amount: string) => void;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0]?.address;

  const formSchema = z.object({
    amount: z.coerce
      .number()
      .refine((val) => val > 0, { message: "Amount must be greater than 0" })
      .refine((val) => val <= 1000000, { message: "Amount too large" })
      .refine((val) => getDecimalCount(val) <= 5, { message: "Maximum 5 decimal places allowed" })
      .refine((val) => val <= Number(formattedBalance), {
        message: "Amount exceeds available balance",
      })
      .transform((val) => val.toString()),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const amountWatched = form.watch("amount");
  const amountValid = formSchema.safeParse({ amount: amountWatched });

  const {
    withdrawRequest,
    estimatedGas,
    formattedEstimatedGas,
    isLoading: isWithdrawRequestLoading,
  } = useWithdrawRequest(childChain, amountValid.success ? amountWatched : "");

  function onSubmit(data: FormValues) {
    if (!walletAddress || !withdrawRequest) return;

    setErrorMessage(null);

    if (!estimatedGas) {
      setErrorMessage("Failed to estimate gas, please try again later.");
      return;
    }

    onWithdrawRequest(data.amount);
  }

  const nativeTokenData = childChain.bridgeUiConfig.nativeTokenData ?? ETH_NATIVE_TOKEN_DATA;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <div className="w-full overflow-hidden rounded-xl border bg-card">
          {/* Amount display */}
          <div className="flex flex-col items-center justify-center p-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value === undefined ? "" : field.value}
                      placeholder={isFocused ? "" : "0"}
                      className="p-0 h-24 border-none bg-transparent text-center text-8xl font-medium tracking-tighter focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      type="tel"
                      autoComplete="off"
                      autoFocus
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </FormControl>
                  <div className="min-h-4">
                    <FormMessage className="text-center whitespace-nowrap text-xs">
                      {!errorMessage && (
                        <span className="text-xs font-extralight text-muted-foreground">
                          Amount to withdraw
                        </span>
                      )}
                      {errorMessage && (
                        <span className="text-xs font-extralight text-destructive">
                          {errorMessage}
                        </span>
                      )}
                    </FormMessage>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Divider */}
          <div className="px-6">
            <div className="h-[1px] w-full bg-border" />
          </div>

          {/* Amount input section */}
          <div className="flex items-center gap-2 bg-background p-6">
            <div className="flex items-center gap-3">
              <img src={nativeTokenData.logoUrl} alt={nativeTokenData.name} className="size-6" />
              <div className="flex flex-col">
                <span className="font-medium">{nativeTokenData.symbol}</span>
                <span className="text-sm text-muted-foreground">Balance {formattedBalance}</span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto font-extralight h-8 rounded-full bg-secondary px-4 text-sm hover:bg-secondary/80"
              disabled={isBalanceLoading || Number(formattedBalance) === 0}
              onClick={() => form.setValue("amount", formattedBalance.toString())}
            >
              Max
            </Button>
          </div>
        </div>

        <div className="pt-4">
          <WithdrawDetails
            childChain={childChain}
            formattedEstimatedGas={formattedEstimatedGas}
            isWithdrawRequestLoading={isWithdrawRequestLoading}
          />
        </div>

        <div className="pt-4">
          {walletAddress && (
            <Button
              type="submit"
              className="w-full"
              disabled={isWithdrawRequestLoading || isBalanceLoading}
            >
              {isWithdrawRequestLoading || isBalanceLoading ? "Loading..." : "Continue"}
            </Button>
          )}
          {!walletAddress && <ConnectWallet className="w-full" />}
        </div>
      </form>
    </Form>
  );
}

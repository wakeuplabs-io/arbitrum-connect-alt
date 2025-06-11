import ChainSelector from "@/components/chain-selector";
import WithdrawConfirmation from "@/components/withdraw-confirmation";
import WithdrawForm from "@/components/withdraw-form";
import useBalance from "@/hoc/useBalance";
import useChainSelector from "@/hoc/useChainSelector";
import useLoaingDots from "@/hoc/useLoadingDots";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  const [amountToWithdraw, setAmountToWithdraw] = useState<string>("");

  const chainSelectorProps = useChainSelector();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const { formattedBalance, isLoading: isBalanceLoading } = useBalance({
    childChain: chainSelectorProps.childChain,
  });

  const formattedBalanceWithLoadingDots = useLoaingDots(formattedBalance, isBalanceLoading);

  const handleOnWithdrawRequest = (amount: string) => {
    setAmountToWithdraw(amount);
    setShowConfirmation(true);
  };

  const handleOnWithdrawSuccess = (activityId: number) => {
    navigate({ to: "/activity/$activityId", params: { activityId: activityId.toString() } });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-full max-w-3xl justify-center items-center gap-4 p-4">
        {!showConfirmation && (
          <>
            <ChainSelector {...chainSelectorProps} />
            <WithdrawForm
              childChain={chainSelectorProps.childChain}
              formattedBalance={formattedBalanceWithLoadingDots}
              isBalanceLoading={isBalanceLoading}
              onWithdrawRequest={handleOnWithdrawRequest}
            />
          </>
        )}
        {showConfirmation && (
          <WithdrawConfirmation
            childChain={chainSelectorProps.childChain}
            parentChain={chainSelectorProps.parentChain!}
            amount={amountToWithdraw}
            isBalanceLoading={isBalanceLoading}
            onBack={() => setShowConfirmation(false)}
            onSuccess={handleOnWithdrawSuccess}
          />
        )}
      </div>
    </div>
  );
}

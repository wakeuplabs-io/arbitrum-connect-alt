import ChainSelector from "@/components/chain-selector";
import WithdrawForm from "@/components/withdraw-form";
import useChainSelector from "@/hoc/useChainSelector";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const chainSelectorProps = useChainSelector();

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-full max-w-3xl justify-center items-center gap-4 p-4">
        <ChainSelector {...chainSelectorProps} />
        <WithdrawForm childChain={chainSelectorProps.childChain} />
      </div>
    </div>
  );
}

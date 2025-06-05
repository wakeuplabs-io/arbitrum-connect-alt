import { Button } from "@/components/ui/button";
import shortenAddress from "@/lib/shortenAddress";
import { useConnectWallet } from "@web3-onboard/react";
import { clsx } from "clsx";
import { LoaderCircle, LogOut, User, Wallet } from "lucide-react";

export default function ConnectWallet({ className }: { className?: string }) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const walletAddress = wallet?.accounts[0]?.address;

  return (
    <Button
      variant={wallet ? "outline" : "default"}
      disabled={connecting}
      onClick={() => (wallet ? disconnect(wallet) : connect())}
      className={clsx(
        "group relative",
        wallet && "bg-white hover:bg-destructive hover:text-destructive-foreground",
        className,
      )}
    >
      {connecting && <LoaderCircle className="size-5 animate-spin" />}
      {!connecting && !wallet && <Wallet className="size-5" />}
      {!connecting && wallet && <User className="size-5 group-hover:hidden" />}
      {!connecting && wallet && <LogOut className="size-5 hidden group-hover:block" />}

      <span className="ml-2 hidden sm:block">
        {connecting && "Connecting..."}
        {!connecting && !wallet && "Connect"}
        {!connecting && wallet && (
          <>
            <span className="block font-mono group-hover:hidden">
              {shortenAddress(walletAddress)}
            </span>
            <span className="hidden group-hover:block">Disconnect</span>
          </>
        )}
      </span>
    </Button>
  );
}

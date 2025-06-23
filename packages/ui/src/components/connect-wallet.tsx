import { Button } from "@/components/ui/button";
import useWallet from "@/hoc/useWallet";
import shortenAddress from "@/lib/shortenAddress";
import { clsx } from "clsx";
import { LoaderCircle, LogOut, User, Wallet } from "lucide-react";

export default function ConnectWallet({ className }: { className?: string }) {
  const [wallet, walletAddress, isConnecting, isInitializing, connect, disconnect] = useWallet();

  return (
    <Button
      variant={wallet ? "outline" : "default"}
      disabled={isConnecting}
      onClick={() => (wallet ? disconnect(wallet) : connect())}
      className={clsx(
        "group relative",
        wallet && "bg-white hover:bg-destructive hover:text-destructive-foreground",
        className,
      )}
    >
      {isConnecting && <LoaderCircle className="size-5 animate-spin" />}
      {!isConnecting && !wallet && <Wallet className="size-5" />}
      {!isConnecting && wallet && !wallet.icon && <User className="size-5 group-hover:hidden" />}
      {!isConnecting && wallet && wallet.icon && (
        <img src={wallet.icon} alt={`${wallet.label} icon`} className="size-5 group-hover:hidden" />
      )}
      {!isConnecting && wallet && <LogOut className="size-5 hidden group-hover:block" />}

      <span className="ml-2 hidden sm:block">
        {isConnecting && (isInitializing ? "Initializing..." : "Connecting...")}
        {!isConnecting && !wallet && "Connect"}
        {!isConnecting && wallet && (
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

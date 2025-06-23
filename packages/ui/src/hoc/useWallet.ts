import { useConnectWallet } from "@web3-onboard/react";
import { DisconnectOptions, WalletState } from "@web3-onboard/core";
import { useEffect, useRef, useState } from "react";

export default function useWallet(): [
  wallet: WalletState | null,
  walletAddress: string | undefined,
  isConnecting: boolean,
  isInitializing: boolean,
  connect: () => Promise<WalletState[]>,
  disconnect: (wallet: DisconnectOptions) => Promise<WalletState[]>,
] {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [isInitializing, setIsInitializing] = useState(true);
  const hasInitialized = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const walletAddress = wallet?.accounts[0]?.address;

  useEffect(() => {
    // Ya se terminó la inicialización, no hacer nada
    if (hasInitialized.current) return;

    // Condición de salida anticipada
    if (wallet || !connecting) {
      hasInitialized.current = true;
      setIsInitializing(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    // Espera máxima de 500ms
    timeoutRef.current = setTimeout(() => {
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        setIsInitializing(false);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [wallet, connecting]);

  const isConnecting = connecting || isInitializing;

  return [wallet, walletAddress, isConnecting, isInitializing, connect, disconnect] as const;
}

import { useEffect, useState } from "react";

export default function useLoaingDots(value: string, isLoading: boolean) {
  const [loadingDots, setLoadingDots] = useState(".");

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots((dots) => (dots.length >= 3 ? "" : dots + "."));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setLoadingDots(".");
    }
  }, [isLoading]);

  return isLoading ? loadingDots : value;
}

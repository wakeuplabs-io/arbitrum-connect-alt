import parseError from "@/lib/parseError";
import { useState } from "react";
import { toast } from "sonner";

export default function useTransitions() {
  const [isPending, setIsPending] = useState(false);

  const startTransition = async (callback: () => Promise<unknown>) => {
    try {
      setIsPending(true);
      await callback();
    } catch (error) {
      console.error(parseError(error));
      toast.error("Error", {
        description: parseError(error),
      });
    } finally {
      setIsPending(false);
    }
  };

  return [isPending, startTransition] as const;
}

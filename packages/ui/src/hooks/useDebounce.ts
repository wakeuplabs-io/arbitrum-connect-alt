import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up function that clears the timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

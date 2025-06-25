import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const debouncedSetValue = useCallback(
    debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, delay),
    [delay],
  );

  useEffect(() => {
    debouncedSetValue(value);
  }, [value, debouncedSetValue]);

  // Cleanup function to cancel pending debounced calls
  useEffect(() => {
    return () => {
      debouncedSetValue.cancel();
    };
  }, [debouncedSetValue]);

  return debouncedValue;
}

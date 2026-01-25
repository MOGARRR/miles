import { useEffect, useState } from "react";

// ------------------------------------
// useDebounce HOOK
// ------------------------------------
// This hook delays updating a value 
// Preventing excessive API calls


export function useDebounce<ValueType>(
  value: ValueType,
  delay: number = 300
): ValueType {

  // Stores the debounced version of the value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup:
    // If `value` changes again before the delay ends,
    // clear the previous timeout and start a new one.
    return () => clearTimeout(timeout);
  }, [value, delay]);

  // Return the debounced value to the caller
  return debouncedValue;
}

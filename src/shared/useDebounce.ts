import {useState, useEffect} from 'react';

export function useDebounce<T>(
  value: T,
  delay: number = 500
): [T, T, (v: T) => void] {
  let [debouncedValue, setDebouncedValue] = useState<T>(value);
  let [realValue, setRealValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(realValue);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [realValue, delay]);

  return [
    debouncedValue,
    realValue,
    (v) => {
      setRealValue(v);
    },
  ];
}

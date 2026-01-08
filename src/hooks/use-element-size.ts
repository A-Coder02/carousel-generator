import { RefCallback, useState, useCallback, useEffect } from "react";

interface Size {
  width: number;
  height: number;
}

export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  RefCallback<T>,
  Size
] {
  const [ref, setRef] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const handleSize = useCallback(() => {
    if (ref) {
      setSize({
        width: ref.offsetWidth || 0,
        height: ref.offsetHeight || 0,
      });
    }
  }, [ref]);

  useEffect(() => {
    if (!ref) return;

    // Defer the initial size calculation to avoid synchronous state updates
    const timeoutId = setTimeout(handleSize, 0);

    const resizeObserver = new ResizeObserver(() => {
      handleSize();
    });

    resizeObserver.observe(ref);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [ref, handleSize]);

  return [setRef, size];
}

import { useEffect, useRef, useState } from 'react';

export interface UseCountUpOptions {
  duration?: number;
  updateDuration?: number;
}

export function useCountUp(
  targetValue: number,
  options: UseCountUpOptions = {},
): { value: number; isUpdating: boolean } {
  const { duration = 1.4, updateDuration = 0.8 } = options;
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const prevValueRef = useRef<number>(0);
  const isFirstMountRef = useRef<boolean>(true);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      prevValueRef.current = targetValue;
      isFirstMountRef.current = false;
      return;
    }

    const startValue = prevValueRef.current;
    const diff = targetValue - startValue;

    // If no change, do nothing
    if (diff === 0 && !isFirstMountRef.current) {
      return;
    }

    const animDuration = (isFirstMountRef.current ? duration : updateDuration) * 1000;
    const startTime = performance.now();

    if (!isFirstMountRef.current) {
      setIsUpdating(true);
    }

    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / animDuration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.round(startValue + diff * eased);

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
        prevValueRef.current = targetValue;
        isFirstMountRef.current = false;
        setIsUpdating(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [targetValue, duration, updateDuration]);

  return { value: displayValue, isUpdating };
}


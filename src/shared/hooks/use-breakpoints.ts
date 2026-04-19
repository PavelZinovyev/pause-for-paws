"use client";

import { useMemo, useSyncExternalStore } from "react";

const BREAKPOINTS = {
  xs: 360,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

type BreakpointsState = {
  width: number | null;
  isHydrated: boolean;
  isXsUp: boolean;
  isSmUp: boolean;
  isMdUp: boolean;
  isLgUp: boolean;
  isXlUp: boolean;
  isXxlUp: boolean;
  isXsDown: boolean;
  isSmDown: boolean;
  isMdDown: boolean;
  isLgDown: boolean;
  isXlDown: boolean;
  current: BreakpointKey | null;
};

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("resize", onStoreChange);
  window.addEventListener("orientationchange", onStoreChange);

  return () => {
    window.removeEventListener("resize", onStoreChange);
    window.removeEventListener("orientationchange", onStoreChange);
  };
};

const getServerSnapshot = () => null;

const getClientSnapshot = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.innerWidth;
};

const getCurrentBreakpoint = (width: number): BreakpointKey => {
  if (width >= BREAKPOINTS.xxl) return "xxl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
};

export function useBreakpoints(): BreakpointsState {
  const width = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => {
    const isHydrated = width !== null;

    if (!isHydrated) {
      return {
        width: null,
        isHydrated: false,
        isXsUp: false,
        isSmUp: false,
        isMdUp: false,
        isLgUp: false,
        isXlUp: false,
        isXxlUp: false,
        isXsDown: false,
        isSmDown: false,
        isMdDown: false,
        isLgDown: false,
        isXlDown: false,
        current: null,
      };
    }

    return {
      width,
      isHydrated: true,
      isXsUp: width >= BREAKPOINTS.xs,
      isSmUp: width >= BREAKPOINTS.sm,
      isMdUp: width >= BREAKPOINTS.md,
      isLgUp: width >= BREAKPOINTS.lg,
      isXlUp: width >= BREAKPOINTS.xl,
      isXxlUp: width >= BREAKPOINTS.xxl,
      isXsDown: width < BREAKPOINTS.sm,
      isSmDown: width < BREAKPOINTS.md,
      isMdDown: width < BREAKPOINTS.lg,
      isLgDown: width < BREAKPOINTS.xl,
      isXlDown: width < BREAKPOINTS.xxl,
      current: getCurrentBreakpoint(width),
    };
  }, [width]);
}

export { BREAKPOINTS };
export type { BreakpointKey, BreakpointsState };

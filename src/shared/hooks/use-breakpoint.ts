"use client";

import { useEffect, useState } from "react";

const BREAKPOINTS = {
  mobile: 767,
  tablet: 1023,
  laptop: 1279,
  desktop: 1919,
} as const;

type BreakpointsState = {
  width: number;
  isHydrated: boolean;
  mobileLess: boolean;
  tabletLess: boolean;
  laptopLess: boolean;
  desktopLess: boolean;
};

export function useBreakpoints(): BreakpointsState {
  const [width, setWidth] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
      setIsHydrated(true);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return {
    width,
    isHydrated,
    mobileLess: width <= BREAKPOINTS.mobile,
    tabletLess: width <= BREAKPOINTS.tablet,
    laptopLess: width <= BREAKPOINTS.laptop,
    desktopLess: width <= BREAKPOINTS.desktop,
  };
}

export { BREAKPOINTS };
export type { BreakpointsState };

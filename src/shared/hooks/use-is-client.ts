"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getServerSnapshot = () => false;
const getSnapshot = () => true;

/**
 * Hydration-safe check: false on server and first client render,
 * true after hydration on client.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

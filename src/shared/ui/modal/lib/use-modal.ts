"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useIsClient } from "@/shared/hooks";
import { lockBodyScroll, unlockBodyScroll } from "./body-scroll-lock";
import { ensureModalRoot } from "./portal-root";

type UseModalParams = {
  isOpen: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  onCloseAction: () => void;
};

type UseModalResult = {
  isMounted: boolean;
  portalRoot: HTMLElement | null;
  handleOverlayClick: () => void;
};

export function useModal({
  isOpen,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  onCloseAction,
}: UseModalParams): UseModalResult {
  const isClient = useIsClient();

  const portalRoot = useMemo(() => {
    if (!isClient) return null;
    return ensureModalRoot();
  }, [isClient]);

  useEffect(() => {
    if (!portalRoot || !isOpen) return;

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [portalRoot, isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onCloseAction]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) onCloseAction();
  }, [closeOnOverlayClick, onCloseAction]);

  const isMounted = isClient && isOpen && Boolean(portalRoot);

  return {
    isMounted,
    portalRoot,
    handleOverlayClick,
  };
}

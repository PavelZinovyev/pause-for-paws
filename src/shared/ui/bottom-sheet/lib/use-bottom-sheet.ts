"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type PointerEvent,
  type RefObject,
} from "react";
import { useIsClient } from "@/shared/hooks";
import {
  clamp,
  DRAG_DEFAULTS,
  initialDragState,
  readCssVarNumber,
  type DragState,
} from "./drag";
import { lockBodyScroll, unlockBodyScroll } from "./body-scroll-lock";
import { ensureSheetRoot } from "./portal-root";

type UseBottomSheetParams = {
  isOpen: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  draggingClassName?: string;
  onCloseAction: () => void;
};

type UseBottomSheetResult = {
  isMounted: boolean;
  portalRoot: HTMLElement | null;
  overlayRef: RefObject<HTMLDivElement | null>;
  sheetRef: RefObject<HTMLDivElement | null>;
  bodyRef: RefObject<HTMLDivElement | null>;
  handleOverlayClick: () => void;
  handlePointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  handlePointerCancel: (event: PointerEvent<HTMLDivElement>) => void;
};

export function useBottomSheet({
  isOpen,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  draggingClassName = "dragging",
  onCloseAction,
}: UseBottomSheetParams): UseBottomSheetResult {
  const isClient = useIsClient();

  const portalRoot = useMemo(() => {
    if (!isClient) return null;
    return ensureSheetRoot();
  }, [isClient]);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState>(initialDragState);

  useEffect(() => {
    if (!isClient || !isOpen) return;

    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isClient, isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseAction();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onCloseAction]);

  const setDragOffset = useCallback((value: number) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.style.setProperty("--sheet-drag-offset", `${Math.max(0, value)}px`);
  }, []);

  const setOverlayProgress = useCallback((offsetPx: number) => {
    const sheet = sheetRef.current;
    const overlay = overlayRef.current;
    if (!sheet || !overlay) return;

    const closeThreshold = readCssVarNumber(
      sheet,
      "--sheet-drag-close-threshold",
      DRAG_DEFAULTS.closeDistancePx,
    );
    const minOpacity = readCssVarNumber(
      sheet,
      "--sheet-drag-overlay-min-opacity",
      DRAG_DEFAULTS.overlayMinOpacity,
    );

    const progress = clamp(offsetPx / Math.max(closeThreshold, 1), 0, 1);
    const overlayAlpha = 1 - (1 - minOpacity) * progress;

    overlay.style.setProperty(
      "--sheet-overlay-drag-opacity",
      overlayAlpha.toFixed(3),
    );
  }, []);

  const resetDragStyles = useCallback(() => {
    const sheet = sheetRef.current;
    const overlay = overlayRef.current;
    if (!sheet) return;

    sheet.style.setProperty("--sheet-drag-offset", "0px");
    overlay?.style.removeProperty("--sheet-overlay-drag-opacity");
  }, []);

  const startDrag = useCallback(
    (pointerId: number, clientY: number) => {
      const sheet = sheetRef.current;
      if (!sheet) return;

      dragStateRef.current = {
        active: true,
        pointerId,
        startY: clientY,
        startTime: performance.now(),
        currentOffset: 0,
      };

      sheet.classList.add(draggingClassName);
      sheet.setPointerCapture(pointerId);
    },
    [draggingClassName],
  );

  const updateDrag = useCallback(
    (clientY: number) => {
      const drag = dragStateRef.current;
      const sheet = sheetRef.current;
      if (!drag.active || !sheet) return;

      const resistance = readCssVarNumber(
        sheet,
        "--sheet-drag-resistance",
        DRAG_DEFAULTS.resistance,
      );
      const maxOffset = readCssVarNumber(
        sheet,
        "--sheet-drag-max-offset",
        DRAG_DEFAULTS.maxOffsetPx,
      );

      const delta = clientY - drag.startY;
      const resistedDelta = delta > 0 ? delta * resistance : 0;
      const nextOffset = clamp(resistedDelta, 0, maxOffset);

      drag.currentOffset = nextOffset;
      setDragOffset(nextOffset);
      setOverlayProgress(nextOffset);
    },
    [setDragOffset, setOverlayProgress],
  );

  const endDrag = useCallback(() => {
    const drag = dragStateRef.current;
    const sheet = sheetRef.current;
    if (!drag.active || !sheet) return;

    const closeDistance = readCssVarNumber(
      sheet,
      "--sheet-drag-close-threshold",
      DRAG_DEFAULTS.closeDistancePx,
    );
    const closeVelocity = readCssVarNumber(
      sheet,
      "--sheet-drag-close-velocity-threshold",
      DRAG_DEFAULTS.closeVelocityPxPerMs,
    );

    const elapsed = Math.max(performance.now() - drag.startTime, 1);
    const velocity = drag.currentOffset / elapsed;
    const shouldClose =
      drag.currentOffset >= closeDistance || velocity >= closeVelocity;

    sheet.classList.remove(draggingClassName);
    dragStateRef.current = initialDragState;

    if (shouldClose) {
      onCloseAction();
      return;
    }

    resetDragStyles();
  }, [draggingClassName, onCloseAction, resetDragStyles]);

  const cancelDrag = useCallback(() => {
    const drag = dragStateRef.current;
    const sheet = sheetRef.current;
    if (!drag.active) return;

    sheet?.classList.remove(draggingClassName);
    dragStateRef.current = initialDragState;
    resetDragStyles();
  }, [draggingClassName, resetDragStyles]);

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) onCloseAction();
  }, [closeOnOverlayClick, onCloseAction]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      const target = event.target as HTMLElement;
      const isHandle = target.closest('[data-sheet-drag-handle="true"]');
      const body = bodyRef.current;
      const isBodyAtTop = body ? body.scrollTop <= 0 : true;
      if (!isHandle && !isBodyAtTop) return;

      if (!isHandle && body?.contains(target)) return;

      startDrag(event.pointerId, event.clientY);
    },
    [startDrag],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag.active || drag.pointerId !== event.pointerId) return;
      updateDrag(event.clientY);
    },
    [updateDrag],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag.active || drag.pointerId !== event.pointerId) return;

      if (sheetRef.current?.hasPointerCapture(event.pointerId)) {
        sheetRef.current.releasePointerCapture(event.pointerId);
      }

      endDrag();
    },
    [endDrag],
  );

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag.active || drag.pointerId !== event.pointerId) return;

      if (sheetRef.current?.hasPointerCapture(event.pointerId)) {
        sheetRef.current.releasePointerCapture(event.pointerId);
      }

      cancelDrag();
    },
    [cancelDrag],
  );

  useEffect(() => {
    if (!isOpen) {
      dragStateRef.current = initialDragState;
      resetDragStyles();
    }
  }, [isOpen, resetDragStyles]);

  const isMounted = isClient && isOpen && Boolean(portalRoot);

  return {
    isMounted,
    portalRoot,
    overlayRef,
    sheetRef,
    bodyRef,
    handleOverlayClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
}

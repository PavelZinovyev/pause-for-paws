"use client";

import React from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

import { useBottomSheet } from "./lib/use-bottom-sheet";
import s from "./bottom-sheet.module.scss";

type BottomSheetProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  children: ReactNode;
  title?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
};

export const BottomSheet = ({
  isOpen,
  onCloseAction,
  children,
  title = "Меню",
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: BottomSheetProps) => {
  const {
    isMounted,
    portalRoot,
    sheetRef,
    bodyRef,
    handleOverlayClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  } = useBottomSheet({
    isOpen,
    onCloseAction,
    closeOnOverlayClick,
    closeOnEsc,
    draggingClassName: s.dragging,
  });

  if (!isMounted || !portalRoot) return null;

  return createPortal(
    <div
      className={s.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleOverlayClick}
    >
      <div
        ref={sheetRef}
        className={s.sheet}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div className={s.handle} data-sheet-drag-handle="true">
          <span className={s.handleBar} aria-hidden />
        </div>

        <div className={s.header}>
          <h2 className={s.title}>{title}</h2>
          <button
            type="button"
            className={s.close}
            onClick={onCloseAction}
            aria-label="Закрыть шторку"
          >
            ✕
          </button>
        </div>

        <div ref={bodyRef} className={s.body}>
          {children}
        </div>
      </div>
    </div>,
    portalRoot,
  );
};

export default BottomSheet;

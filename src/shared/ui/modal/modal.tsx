"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useModal } from "./lib/use-modal";
import s from "./modal.module.scss";

type ModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  children: React.ReactNode;
  title?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
};

export const Modal = ({
  isOpen,
  onCloseAction,
  children,
  title = "Модальное окно",
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: ModalProps) => {
  const { isMounted, portalRoot, handleOverlayClick } = useModal({
    isOpen,
    onCloseAction,
    closeOnOverlayClick,
    closeOnEsc,
  });

  if (!isMounted || !portalRoot) {
    return null;
  }

  return createPortal(
    <div
      className={s.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleOverlayClick}
    >
      <div className={s.modal} onClick={(event) => event.stopPropagation()}>
        <div className={s.header}>
          <h2 className={s.title}>{title}</h2>

          <button
            type="button"
            onClick={onCloseAction}
            className={s.close}
            aria-label="Закрыть модальное окно"
          >
            ✕
          </button>
        </div>

        <div className={s.body}>{children}</div>
      </div>
    </div>,
    portalRoot,
  );
};

export default Modal;

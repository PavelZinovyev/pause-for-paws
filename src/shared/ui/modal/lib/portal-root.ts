"use client";

const MODAL_ROOT_ID = "modal-root";

export const ensureModalRoot = (): HTMLElement => {
  const existing = document.getElementById(MODAL_ROOT_ID);

  if (existing instanceof HTMLElement) {
    return existing;
  }

  const node = document.createElement("div");
  node.id = MODAL_ROOT_ID;
  document.body.appendChild(node);

  return node;
};

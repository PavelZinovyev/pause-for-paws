const BODY_LOCK_ATTR = "data-bottom-sheet-scroll-lock";

const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

export const lockBodyScroll = () => {
  const { body, documentElement } = document;
  const scrollbarWidth = getScrollbarWidth();

  body.setAttribute(BODY_LOCK_ATTR, "true");
  body.style.overflow = "hidden";
  body.style.paddingRight = `${Math.max(scrollbarWidth, 0)}px`;
  documentElement.style.scrollbarGutter = "stable";
};

export const unlockBodyScroll = () => {
  const { body, documentElement } = document;

  body.removeAttribute(BODY_LOCK_ATTR);
  body.style.overflow = "";
  body.style.paddingRight = "";
  documentElement.style.scrollbarGutter = "";
};

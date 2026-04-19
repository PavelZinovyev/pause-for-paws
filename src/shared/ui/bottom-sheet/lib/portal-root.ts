const SHEET_ROOT_ID = "bottom-sheet-root";

export const ensureSheetRoot = (): HTMLElement => {
  const existing = document.getElementById(SHEET_ROOT_ID);
  if (existing) return existing;

  const node = document.createElement("div");
  node.id = SHEET_ROOT_ID;
  document.body.appendChild(node);
  return node;
};

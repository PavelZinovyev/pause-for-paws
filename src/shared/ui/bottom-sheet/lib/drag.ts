export type DragState = {
  active: boolean;
  pointerId: number | null;
  startY: number;
  startTime: number;
  currentOffset: number;
};

export const DRAG_DEFAULTS = {
  closeDistancePx: 96,
  closeVelocityPxPerMs: 0.55,
  resistance: 0.92,
  maxOffsetPx: 420,
  overlayMinOpacity: 0.08,
} as const;

export const initialDragState: DragState = {
  active: false,
  pointerId: null,
  startY: 0,
  startTime: 0,
  currentOffset: 0,
};

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const readCssVarNumber = (
  element: HTMLElement,
  variableName: string,
  fallback: number,
): number => {
  const raw = getComputedStyle(element).getPropertyValue(variableName).trim();
  if (!raw) return fallback;

  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

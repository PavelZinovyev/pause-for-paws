"use client";

import React, { useEffect, useMemo } from "react";

const PAWS = [
  { side: "left", top: 6, size: 30, rotate: -18, delay: 0.02 },
  { side: "right", top: 16, size: 34, rotate: 14, delay: 0.1 },
  { side: "left", top: 28, size: 32, rotate: -12, delay: 0.18 },
  { side: "right", top: 40, size: 36, rotate: 16, delay: 0.26 },
  { side: "left", top: 54, size: 34, rotate: -14, delay: 0.34 },
  { side: "right", top: 68, size: 32, rotate: 10, delay: 0.42 },
  { side: "left", top: 82, size: 30, rotate: -10, delay: 0.5 },
] as const;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const ScrollPawsDemo = () => {
  const [progress, setProgress] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;

      const start = viewport * 0.9;
      const end = -rect.height * 0.35;

      const raw = (start - rect.top) / (start - end);
      setProgress(clamp(raw));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const lineLength = 890;
  const dashOffset = useMemo(() => lineLength * (1 - progress), [progress]);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          "radial-gradient(90% 60% at 50% 0%, #f7fbff 0%, #ecf3fb 40%, #e7eef8 100%)",
        overflow: "clip",
      }}
      aria-label="Демо скролл-анимации с лапками"
    >
      <div
        ref={containerRef}
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "14vh 24px 12vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "140vh",
            borderRadius: 28,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.44))",
            boxShadow:
              "0 18px 50px rgba(31,43,61,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
            border: "1px solid rgba(90,120,160,0.14)",
            backdropFilter: "blur(4px)",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: "5% 22% 6% 22%",
              width: "56%",
              height: "89%",
              overflow: "visible",
            }}
            aria-hidden
          >
            <defs>
              <linearGradient id="trailGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8c5ef7" />
                <stop offset="55%" stopColor="#6d85ff" />
                <stop offset="100%" stopColor="#4ca2ff" />
              </linearGradient>
            </defs>

            <path
              d="M15,4 C78,12 18,34 70,47 C88,51 62,72 42,78 C19,85 40,96 85,98"
              fill="none"
              stroke="url(#trailGradient)"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={lineLength}
              strokeDasharray={lineLength}
              strokeDashoffset={dashOffset}
              style={{
                filter: "drop-shadow(0 6px 10px rgba(92,122,255,0.25))",
              }}
            />
          </svg>

          {PAWS.map((paw, index) => {
            const left = paw.side === "left" ? "24%" : "62%";
            const appearAt = 0.08 + index * 0.11;
            const local = clamp((progress - appearAt) / 0.2);
            const scale = 0.6 + local * 0.4;
            const y = 18 * (1 - local);

            return (
              <div
                key={`${paw.side}-${index}`}
                style={{
                  position: "absolute",
                  top: `${paw.top}%`,
                  left,
                  transform: `translate(-50%, ${y}px) rotate(${paw.rotate}deg) scale(${scale})`,
                  transformOrigin: "50% 50%",
                  transition: "transform 120ms linear",
                  pointerEvents: "none",
                }}
                aria-hidden
              >
                <PawIcon
                  size={paw.size}
                  color="#27364a"
                  fillAlpha={0.12 + local * 0.7}
                  strokeAlpha={0.2 + local * 0.7}
                />
              </div>
            );
          })}

          <div
            style={{
              position: "sticky",
              top: "14vh",
              marginLeft: "min(8vw, 60px)",
              width: "fit-content",
              padding: "10px 14px",
              borderRadius: 999,
              fontSize: 13,
              color: "#22324a",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(72,98,136,0.2)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            SCROLL: {Math.round(progress * 100)}%
          </div>
        </div>
      </div>
    </section>
  );
};

const PawIcon = ({
  size,
  color,
  fillAlpha,
  strokeAlpha,
}: {
  size: number;
  color: string;
  fillAlpha: number;
  strokeAlpha: number;
}) => {
  const fill = toRgba(color, fillAlpha);
  const stroke = toRgba(color, strokeAlpha);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="presentation"
    >
      <ellipse cx="24" cy="30" rx="10" ry="8.8" fill={fill} stroke={stroke} />
      <ellipse
        cx="14.8"
        cy="20"
        rx="3.8"
        ry="4.8"
        fill={fill}
        stroke={stroke}
      />
      <ellipse cx="22" cy="15.8" rx="3.8" ry="5" fill={fill} stroke={stroke} />
      <ellipse
        cx="30.2"
        cy="15.8"
        rx="3.8"
        ry="5"
        fill={fill}
        stroke={stroke}
      />
      <ellipse
        cx="37.2"
        cy="20.4"
        rx="3.8"
        ry="4.7"
        fill={fill}
        stroke={stroke}
      />
    </svg>
  );
};

function toRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  const normalized =
    sanitized.length === 3
      ? sanitized
          .split("")
          .map((c) => `${c}${c}`)
          .join("")
      : sanitized;

  const int = Number.parseInt(normalized, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

export default ScrollPawsDemo;

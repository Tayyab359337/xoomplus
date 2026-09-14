"use client";

import { useId, useMemo, useRef } from "react";
import DottedMap from "dotted-map";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

import { useIsClient } from "@/hooks/use-is-client";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type MapPoint = { lat: number; lng: number; label?: string };

type MapConnection = {
  start: MapPoint;
  end: MapPoint;
};

interface MapProps {
  dots?: MapConnection[];
  /** Standalone markers (no connection line). Prefer this for a single location. */
  points?: MapPoint[];
  lineColor?: string;
  className?: string;
}

const worldDottedMap = new DottedMap({ height: 100, grid: "diagonal" });

const projectPoint = (lat: number, lng: number) => {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
};

const createCurvedPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
) => {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
};

const pointKey = (point: MapPoint) => `${point.lat.toFixed(4)}:${point.lng.toFixed(4)}`;

/**
 * Aceternity World Map — adapted to Xoomplus tokens.
 * Memoized dotted SVG; markers use theme accent instead of demo cyan.
 */
export default function WorldMap({
  dots = [],
  points = [],
  lineColor,
  className,
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientId = useId();
  const isClient = useIsClient();
  const reduceMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = isClient && resolvedTheme === "dark";
  const accent = lineColor ?? (isDark ? "#4a8f9b" : "#478997");

  const svgMap = useMemo(
    () =>
      worldDottedMap.getSVG({
        radius: 0.22,
        color: isDark ? "#e8f0f240" : "#1a2e3340",
        shape: "circle",
        backgroundColor: "transparent",
      }),
    [isDark],
  );

  const markers = useMemo(() => {
    const unique = new Map<string, MapPoint>();
    for (const point of points) unique.set(pointKey(point), point);
    for (const dot of dots) {
      unique.set(pointKey(dot.start), dot.start);
      unique.set(pointKey(dot.end), dot.end);
    }
    return [...unique.values()];
  }, [dots, points]);

  return (
    <div
      className={cn(
        "relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-transparent font-sans",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG data URL from dotted-map */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_12%,white_88%,transparent)]"
        alt=""
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        aria-hidden
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          if (startPoint.x === endPoint.x && startPoint.y === endPoint.y) {
            return null;
          }
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="1"
                initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : 1,
                  delay: reduceMotion ? 0 : 0.35 * i,
                  ease: "easeOut",
                }}
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="8%" stopColor={accent} stopOpacity="1" />
            <stop offset="92%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {markers.map((marker) => {
          const { x, y } = projectPoint(marker.lat, marker.lng);
          return (
            <g key={pointKey(marker)}>
              {marker.label ? (
                <title>{marker.label}</title>
              ) : null}
              <circle cx={x} cy={y} r="2.4" fill={accent} />
              {reduceMotion ? null : (
                <circle cx={x} cy={y} r="2.4" fill={accent} opacity="0.45">
                  <animate
                    attributeName="r"
                    from="2.4"
                    to="8"
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.45"
                    to="0"
                    dur="1.8s"
                    begin="0s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

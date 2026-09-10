"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * Aceternity Text Hover Effect — SVG stroke reveal that follows the cursor.
 * IDs are scoped so multiple instances (or SSR) stay safe.
 */
export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const reactId = useId().replace(/:/g, "");
  const gradientId = `textGradient-${reactId}`;
  const maskGradientId = `revealMask-${reactId}`;
  const maskId = `textMask-${reactId}`;

  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  const textClass =
    "fill-transparent stroke-[color-mix(in_srgb,var(--foreground)_18%,transparent)] font-display text-7xl font-bold dark:stroke-[color-mix(in_srgb,var(--foreground)_14%,transparent)]";

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 420 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#1f4a52" />
              <stop offset="25%" stopColor="#2f6b76" />
              <stop offset="50%" stopColor="#478997" />
              <stop offset="75%" stopColor="#6aadb8" />
              <stop offset="100%" stopColor="#7ab4be" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id={maskGradientId}
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={maskId}>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${maskGradientId})`}
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={textClass}
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={textClass}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.3"
        mask={`url(#${maskId})`}
        className="fill-transparent font-display text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

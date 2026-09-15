"use client";
import React, { useId, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

/**
 * Aceternity Text Hover Effect — SVG stroke reveal that follows the cursor.
 * Mask position uses MotionValues (no React re-renders on mousemove).
 */
export const TextHoverEffect = ({
  text,
  duration = 0,
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

  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const maskCx = useMotionTemplate`${mouseX}%`;
  const maskCy = useMotionTemplate`${mouseY}%`;

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const svgRect = svg.getBoundingClientRect();
    if (svgRect.width <= 0 || svgRect.height <= 0) return;
    mouseX.set(((e.clientX - svgRect.left) / svgRect.width) * 100);
    mouseY.set(((e.clientY - svgRect.top) / svgRect.height) * 100);
  };

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
      onMouseMove={onMouseMove}
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
          cx={maskCx}
          cy={maskCy}
          transition={{ duration, ease: "easeOut" }}
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

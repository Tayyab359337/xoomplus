"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export type InteractiveParticlesProps = {
  /** Text rendered as the particle source. Defaults to "404". */
  text?: string;
  className?: string;
  /** Particle tint (CSS color). Defaults to currentColor via canvas fill. */
  color?: string;
  /** Max particles after sampling. Defaults to 220. */
  maxParticles?: number;
};

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
};

/**
 * Lightweight interactive particles — 2D canvas only.
 * Samples text into a small particle field with pointer repulsion.
 * Prefer this over the full Three.js registry item for route-level use.
 */
export function InteractiveParticles({
  text = "404",
  className,
  color,
  maxParticles = 220,
}: InteractiveParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let last = 0;
    const frameInterval = 1000 / 30;
    let inView = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const sampleParticles = () => {
      const sample = document.createElement("canvas");
      const sampleCtx = sample.getContext("2d");
      if (!sampleCtx) return [];

      const sampleW = 160;
      const sampleH = 72;
      sample.width = sampleW;
      sample.height = sampleH;
      sampleCtx.fillStyle = "#000";
      sampleCtx.fillRect(0, 0, sampleW, sampleH);
      sampleCtx.fillStyle = "#fff";
      sampleCtx.font = "700 56px var(--font-bricolage), system-ui, sans-serif";
      sampleCtx.textAlign = "center";
      sampleCtx.textBaseline = "middle";
      sampleCtx.fillText(text, sampleW / 2, sampleH / 2 + 2);

      const { data } = sampleCtx.getImageData(0, 0, sampleW, sampleH);
      const candidates: { x: number; y: number }[] = [];
      const step = 2;
      for (let y = 0; y < sampleH; y += step) {
        for (let x = 0; x < sampleW; x += step) {
          if (data[(y * sampleW + x) * 4] > 140) {
            candidates.push({ x, y });
          }
        }
      }

      const stride = Math.max(1, Math.ceil(candidates.length / maxParticles));
      const scaleX = width / sampleW;
      const scaleY = height / sampleH;
      const scale = Math.min(scaleX, scaleY) * 0.72;
      const offsetX = (width - sampleW * scale) / 2;
      const offsetY = (height - sampleH * scale) / 2;

      const next: Particle[] = [];
      for (let i = 0; i < candidates.length; i += stride) {
        const c = candidates[i];
        const px = offsetX + c.x * scale;
        const py = offsetY + c.y * scale;
        next.push({
          x: px,
          y: py,
          ox: px,
          oy: py,
          vx: 0,
          vy: 0,
          r: 1.1 + Math.random() * 1.4,
        });
      }
      return next;
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = sampleParticles();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const draw = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(draw);
      if (!inView || document.hidden) return;
      if (ts - last < frameInterval) return;
      last = ts;

      const fill =
        color ?? (getComputedStyle(container).color || "currentColor");

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = fill;

      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 90) {
            const force = (90 - dist) / 90;
            p.vx += (dx / dist) * force * 4.5;
            p.vy += (dy / dist) * force * 4.5;
          }
        }

        p.vx += (p.ox - p.x) * 0.045;
        p.vy += (p.oy - p.y) * 0.045;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { rootMargin: "80px" },
    );
    io.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [color, maxParticles, reducedMotion, text]);

  if (reducedMotion) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center text-[clamp(4rem,18vw,9rem)] font-semibold tracking-tight",
          className,
        )}
        aria-hidden
      >
        {text}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-hidden
      />
    </div>
  );
}

export default InteractiveParticles;

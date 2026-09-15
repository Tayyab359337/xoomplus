"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

import "./DotGrid.css";

const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canUsePointerInteraction() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * React Bits DotGrid (JS-CSS) — canvas dots + GSAP proximity.
 * InertiaPlugin is Club GSAP; push/return uses core tweens instead.
 * Paints once under reduced motion; pauses while off-screen.
 */
const DotGrid = ({
  dotSize = 16,
  gap = 32,
  baseColor = "#5227FF",
  activeColor = "#5227FF",
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style,
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const visibleRef = useRef(true);
  const pointerRef = useRef({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined" || !window.Path2D) return null;
    const p = new window.Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const paintOnce = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !circlePath) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const { x: px, y: py } = pointerRef.current;
    const proxSq = proximity * proximity;

    for (const dot of dotsRef.current) {
      const ox = dot.cx + dot.xOffset;
      const oy = dot.cy + dot.yOffset;
      const dx = dot.cx - px;
      const dy = dot.cy - py;
      const dsq = dx * dx + dy * dy;

      let fill = baseColor;
      if (dsq <= proxSq) {
        const dist = Math.sqrt(dsq);
        const t = 1 - dist / proximity;
        const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
        const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
        const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        fill = `rgb(${r},${g},${b})`;
      }

      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = fill;
      ctx.fill(circlePath);
      ctx.restore();
    }
  }, [activeRgb, baseColor, baseRgb, circlePath, proximity]);

  const pushDot = useCallback(
    (dot, pushX, pushY) => {
      if (dot._inertiaApplied) return;
      dot._inertiaApplied = true;
      gsap.killTweensOf(dot);
      const duration = Math.min(0.55, Math.max(0.22, resistance / 2000));
      gsap.to(dot, {
        xOffset: pushX,
        yOffset: pushY,
        duration,
        ease: "power3.out",
        onComplete: () => {
          gsap.to(dot, {
            xOffset: 0,
            yOffset: 0,
            duration: returnDuration,
            ease: "elastic.out(1,0.75)",
            onComplete: () => {
              dot._inertiaApplied = false;
            },
          });
        },
      });
    },
    [resistance, returnDuration],
  );

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    if (width < 2 || height < 2) return;

    const rawDpr = window.devicePixelRatio || 1;
    const dpr = Math.min(rawDpr, 1.75);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let cell = dotSize + gap;
    let cols = Math.floor((width + gap) / cell);
    let rows = Math.floor((height + gap) / cell);
    if (cols * rows > 900) {
      cell *= 1.25;
      cols = Math.floor((width + gap) / cell);
      rows = Math.floor((height + gap) / cell);
    }

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          _inertiaApplied: false,
        });
      }
    }
    dotsRef.current = dots;
    paintOnce();
  }, [dotSize, gap, paintOnce]);

  useEffect(() => {
    if (!circlePath) return;

    const reduceMotion = prefersReducedMotion();
    if (reduceMotion) {
      paintOnce();
      return;
    }

    let rafId = 0;
    const draw = () => {
      if (visibleRef.current && !document.hidden) paintOnce();
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [circlePath, paintOnce]);

  useEffect(() => {
    buildGrid();
    const wrap = wrapperRef.current;
    let ro = null;
    if (wrap && "ResizeObserver" in window) {
      ro = new ResizeObserver(buildGrid);
      ro.observe(wrap);
    } else {
      window.addEventListener("resize", buildGrid);
    }

    const io =
      wrap && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              visibleRef.current = Boolean(entry?.isIntersecting);
            },
            { rootMargin: "80px" },
          )
        : null;
    if (wrap && io) io.observe(wrap);

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", buildGrid);
      io?.disconnect();
    };
  }, [buildGrid]);

  useEffect(() => {
    if (prefersReducedMotion() || !canUsePointerInteraction()) return;

    const onMove = (e) => {
      if (!visibleRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvas.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      if (speed <= speedTrigger) return;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (dist < proximity) {
          const pushX = (dot.cx - pr.x + vx * 0.005) * 0.08;
          const pushY = (dot.cy - pr.y + vy * 0.005) * 0.08;
          pushDot(dot, pushX, pushY);
        }
      }
    };

    const onClick = (e) => {
      const canvas = canvasRef.current;
      const wrap = wrapperRef.current;
      if (!canvas || !wrap || !visibleRef.current) return;
      const wrapRect = wrap.getBoundingClientRect();
      if (
        e.clientX < wrapRect.left ||
        e.clientX > wrapRect.right ||
        e.clientY < wrapRect.top ||
        e.clientY > wrapRect.bottom
      ) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius) {
          const falloff = Math.max(0, 1 - dist / shockRadius);
          pushDot(
            dot,
            (dot.cx - cx) * shockStrength * falloff * 0.35,
            (dot.cy - cy) * shockStrength * falloff * 0.35,
          );
        }
      }
    };

    const throttledMove = throttle(onMove, 50);
    const wrap = wrapperRef.current;
    window.addEventListener("mousemove", throttledMove, { passive: true });
    wrap?.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", throttledMove);
      wrap?.removeEventListener("click", onClick);
    };
  }, [maxSpeed, proximity, pushDot, shockRadius, shockStrength, speedTrigger]);

  return (
    <div className={`dot-grid ${className}`} style={style} aria-hidden>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </div>
  );
};

export default DotGrid;

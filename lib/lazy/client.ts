import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

type LazyOptions = {
  /** Optional lightweight placeholder while the chunk loads */
  loading?: () => ReactNode;
  ssr?: boolean;
};

/**
 * Lazy-load heavy visual modules (WebGL / Three / large effects).
 * Defaults to client-only (`ssr: false`) so they never block first paint.
 *
 * @example
 * const HeroCanvas = lazyClient(() => import("@/components/canvas/hero-canvas"));
 */
export function lazyClient<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options: LazyOptions = {},
) {
  return dynamic(loader, {
    ssr: options.ssr ?? false,
    loading: options.loading ?? (() => null),
  });
}

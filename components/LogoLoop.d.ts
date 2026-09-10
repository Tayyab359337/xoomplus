import type { CSSProperties, Key, ReactNode } from "react";

export type LogoItem =
  | {
      node: ReactNode;
      href?: string;
      title?: string;
      ariaLabel?: string;
    }
  | {
      src: string;
      alt?: string;
      href?: string;
      title?: string;
      srcSet?: string;
      sizes?: string;
      width?: number;
      height?: number;
    };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: Key) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

declare const LogoLoop: import("react").MemoExoticComponent<
  (props: LogoLoopProps) => import("react").ReactElement
>;

export default LogoLoop;

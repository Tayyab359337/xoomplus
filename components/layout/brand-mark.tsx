import Link from "next/link";

import { cn } from "@/lib/utils";

const LOGO_BLACK = "/brand/xoomplus-logo-black.svg";
const LOGO_WHITE = "/brand/xoomplus-logo-white.svg";

type BrandMarkProps = {
  className?: string;
  onClick?: () => void;
  /** Visual height in CSS pixels */
  height?: number;
};

/**
 * Xoomplus wordmark — black in light mode, white in dark mode.
 */
export function BrandMark({
  className,
  onClick,
  height = 32,
}: BrandMarkProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Xoomplus home"
      className={cn(
        "relative z-20 inline-flex shrink-0 items-center px-1 py-1",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG wordmarks */}
      <img
        src={LOGO_BLACK}
        alt=""
        width={140}
        height={32}
        className="w-auto dark:hidden"
        style={{ height }}
        decoding="async"
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- local SVG wordmarks */}
      <img
        src={LOGO_WHITE}
        alt=""
        width={140}
        height={32}
        className="hidden w-auto dark:block"
        style={{ height }}
        decoding="async"
      />
    </Link>
  );
}

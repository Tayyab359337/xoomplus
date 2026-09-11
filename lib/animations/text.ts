import { gsap, registerGsapPlugins } from "./gsap";
import { EASE_OUT_EXPO } from "./presets";

export type TextSplitMode = "lines" | "words";

type SplitResult = {
  wraps: HTMLElement[];
  restore: () => void;
};

/**
 * Minimal DOM split for editorial reveals.
 * Preserves accessibility via aria-label on the parent when splitting words.
 * Avoid character splits for body copy.
 */
export function splitText(
  el: HTMLElement,
  mode: TextSplitMode = "words",
): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent ?? "";

  if (mode === "words") {
    el.setAttribute("aria-label", text.trim());
    const words = text.trim().split(/(\s+)/);
    el.innerHTML = words
      .map((token) => {
        if (/^\s+$/.test(token)) return token;
        return `<span class="xp-word" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="xp-word-inner" style="display:inline-block">${token}</span></span>`;
      })
      .join("");
    const wraps = Array.from(
      el.querySelectorAll<HTMLElement>(".xp-word-inner"),
    );
    return {
      wraps,
      restore: () => {
        el.innerHTML = original;
        el.removeAttribute("aria-label");
      },
    };
  }

  // lines — wrap existing block children or soft-split by <br> / block tags
  const lineNodes = el.querySelectorAll<HTMLElement>(":scope > *");
  if (lineNodes.length > 1) {
    const wraps: HTMLElement[] = [];
    lineNodes.forEach((line) => {
      const inner = document.createElement("span");
      inner.className = "xp-line-inner";
      inner.style.display = "block";
      while (line.firstChild) inner.appendChild(line.firstChild);
      line.style.overflow = "hidden";
      line.style.display = "block";
      line.appendChild(inner);
      wraps.push(inner);
    });
    return {
      wraps,
      restore: () => {
        el.innerHTML = original;
      },
    };
  }

  // Fallback: treat as single line
  const wrap = document.createElement("span");
  wrap.className = "xp-line";
  wrap.style.display = "block";
  wrap.style.overflow = "hidden";
  const inner = document.createElement("span");
  inner.className = "xp-line-inner";
  inner.style.display = "block";
  inner.textContent = text;
  wrap.appendChild(inner);
  el.textContent = "";
  el.appendChild(wrap);
  return {
    wraps: [inner],
    restore: () => {
      el.innerHTML = original;
    },
  };
}

/**
 * Clip + translateY editorial text reveal (no bounce).
 */
export function revealTextLines(
  targets: HTMLElement[] | NodeListOf<HTMLElement>,
  opts: {
    delay?: number;
    stagger?: number;
    duration?: number;
    y?: number;
    scrollTrigger?: object;
  } = {},
) {
  registerGsapPlugins();
  const {
    delay = 0,
    stagger = 0.08,
    duration = 0.9,
    y = 110,
    scrollTrigger,
  } = opts;

  gsap.set(targets, { yPercent: y, opacity: 1 });
  return gsap.to(targets, {
    yPercent: 0,
    duration,
    ease: EASE_OUT_EXPO,
    stagger,
    delay,
    scrollTrigger,
  });
}

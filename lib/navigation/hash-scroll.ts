export function scrollToHashId(
  id: string,
  behavior: ScrollBehavior = "smooth",
): void {
  if (typeof document === "undefined" || !id) return;
  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

export function scrollToCurrentHash(
  behavior: ScrollBehavior = "smooth",
): void {
  if (typeof window === "undefined") return;
  const id = window.location.hash.replace(/^#/, "");
  scrollToHashId(id, behavior);
}

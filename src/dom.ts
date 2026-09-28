const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Coordinated entrance animation: adds .in when an element scrolls into view. */
export function observeReveal(root: ParentNode = document): void {
  const targets = root.querySelectorAll<HTMLElement>(".reveal");
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add("in");
          io.unobserve(el);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((el) => io.observe(el));
}

/** Brief transform+opacity pulse to mark a live value as freshly updated. */
export function flashUpdate(el: Element | null): void {
  if (!el) return;
  if (prefersReducedMotion()) return;
  el.classList.remove("flash");
  // Force reflow so the animation restarts on rapid successive updates.
  void (el as HTMLElement).offsetWidth;
  el.classList.add("flash");
}

export function qs<T extends Element = Element>(root: ParentNode, selector: string): T | null {
  return root.querySelector<T>(selector);
}

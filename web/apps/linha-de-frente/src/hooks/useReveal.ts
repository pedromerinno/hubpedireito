import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type Opts = {
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  threshold?: number;
};

export function useReveal<T extends HTMLElement = HTMLDivElement>(opts: Opts = {}) {
  const ref = useRef<T>(null);
  const { y = 16, duration = 0.7, delay = 0, stagger, threshold = 0.15 } = opts;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets: gsap.TweenTarget = stagger != null ? Array.from(el.children) : el;

    gsap.set(targets, { opacity: 0, y: reduced ? 0 : y });

    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.35 : duration,
            ease: "power2.out",
            stagger: stagger ?? 0,
            delay,
          });
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [y, duration, delay, stagger, threshold]);

  return ref;
}

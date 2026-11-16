"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".scroll-reveal");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -35px 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    document.documentElement.classList.add("scroll-animations-ready");

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("scroll-animations-ready");
    };
  }, []);

  return null;
}

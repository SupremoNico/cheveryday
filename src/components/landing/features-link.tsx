"use client";

import type { MouseEvent } from "react";

export default function FeaturesLink({
  className = "landing-features-link",
  label = "Take a look",
  targetId = "features",
}: {
  className?: string;
  label?: string;
  targetId?: string;
}) {
  function scrollToTarget(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", `#${targetId}`);
  }

  return (
    <a className={className} href={`#${targetId}`} onClick={scrollToTarget}>
      {label}{className === "landing-text-link" && <span>↓</span>}
    </a>
  );
}

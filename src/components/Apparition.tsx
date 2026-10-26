"use client";

import { useEffect, useRef } from "react";

// Fait apparaître son contenu quand il entre dans l'écran (classes .apparait / .visible de globals.css).
export default function Apparition({
  children,
  className = "",
  delai = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delai?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`apparait ${className}`} style={{ transitionDelay: `${delai}ms` }}>
      {children}
    </div>
  );
}

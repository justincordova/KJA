"use client";

import { useEffect, useRef, useState } from "react";

export function PresentationProgress({ total }: { total: number }) {
  const [active, setActive] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const slides = document.querySelectorAll("[data-slide]");
        const vh = window.innerHeight;
        let current = 0;
        slides.forEach((slide, i) => {
          const rect = slide.getBoundingClientRect();
          if (rect.top < vh * 0.5) current = i;
        });
        setActive(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: "1.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <a
          key={i}
          href={`#slide-${i}`}
          onClick={(e) => {
            e.preventDefault();
            document
              .querySelector(`[data-slide="${i}"]`)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            width: active === i ? "10px" : "6px",
            height: active === i ? "10px" : "6px",
            borderRadius: "50%",
            background:
              active === i
                ? "var(--accent, #c8a97e)"
                : "rgba(245,245,240,0.3)",
            transition: "all 0.3s ease",
            display: "block",
          }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

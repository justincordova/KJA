"use client";

import { useEffect } from "react";

export function KeyboardScroll({ total }: { total: number }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.code !== "Space" ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      ) {
        return;
      }
      e.preventDefault();

      const slides = Array.from(document.querySelectorAll("[data-slide]"));
      const scrollY = window.scrollY + window.innerHeight * 0.5;

      let current = 0;
      slides.forEach((slide, i) => {
        if ((slide as HTMLElement).offsetTop <= scrollY) current = i;
      });

      const target = e.shiftKey ? Math.max(0, current - 1) : Math.min(total - 1, current + 1);

      slides[target]?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  return null;
}

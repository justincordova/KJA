"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { SlideContext } from "./SlideContext";

export function PresentationSlide({
  children,
  index,
  height = "170vh",
}: {
  children: React.ReactNode;
  index: number;
  height?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const ctxValue = index === 0 ? { scrollYProgress } : { scrollYProgress };

  return (
    <SlideContext.Provider value={ctxValue}>
      <section
        ref={ref}
        style={{
          height,
          position: "relative",
          zIndex: index,
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </section>
    </SlideContext.Provider>
  );
}

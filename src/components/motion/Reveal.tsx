"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export function Reveal({ children, delay = 0, direction = "up" }: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15, margin: "0px 0px -8% 0px" });
  const reduced = useReducedMotion();

  const initial =
    direction === "left"
      ? { opacity: 0, x: -40 }
      : direction === "right"
        ? { opacity: 0, x: 40 }
        : { opacity: 0, y: 30 };

  const animate =
    direction === "left"
      ? { opacity: 1, x: 0 }
      : direction === "right"
        ? { opacity: 1, x: 0 }
        : { opacity: 1, y: 0 };

  return (
    <div ref={ref}>
      <motion.div
        initial={initial}
        animate={inView || reduced ? animate : initial}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

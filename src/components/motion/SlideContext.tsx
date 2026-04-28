import type { MotionValue } from "framer-motion";
import { createContext, useContext } from "react";

export interface SlideContextValue {
  scrollYProgress: MotionValue<number>;
}

export const SlideContext = createContext<SlideContextValue | null>(null);
export const useSlideContext = () => useContext(SlideContext);

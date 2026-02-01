declare module "framer-motion" {
  import type { ComponentType } from "react";
  export const motion: Record<string, ComponentType<any>>;
  export const AnimatePresence: ComponentType<any>;
}

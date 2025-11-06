"use client";

import { motion, PanInfo } from "framer-motion";
import React from "react";

/**
 * A simple motion-enabled main element that detects horizontal swipe gestures.
 * @param {object} props The component props.
 * @param {React.ReactNode} props.children The content to render inside the main element.
 * @param {(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void} props.onPanEnd The callback function to execute when a swipe gesture ends.
 * @returns {JSX.Element}
 */
export const MotionMain = ({
  children,
  onPanEnd,
}: {
  children: React.ReactNode;
  onPanEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
}) => {
  return (
    <motion.main onPanEnd={onPanEnd} className="p-6 md:p-8 md:pl-72">
      {children}
    </motion.main>
  );
};

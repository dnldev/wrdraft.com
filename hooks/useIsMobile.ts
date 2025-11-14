// hooks/useIsMobile.ts
"use client";

import { useEffect, useState } from "react";

const getIsMobile = () => {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * A hook to determine if the current device is a mobile device.
 * It checks the user agent string and ensures it only runs on the client.
 * This pattern avoids hydration mismatches and UI flicker.
 * @returns {boolean} True if the device is identified as mobile, false otherwise.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    const handleResize = () => setIsMobile(getIsMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

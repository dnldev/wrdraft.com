"use client";

import "swiper/css";

import { Tab, Tabs, TabsProps } from "@heroui/react";
import React, { Key, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";

/**
 * The props for our custom SwipeableTabs component.
 * It omits the original `onSelectionChange` to redefine it with a stricter `string` type,
 * creating a clean and type-safe API for parent components.
 */
interface SwipeableTabsProps
  extends Omit<TabsProps, "children" | "onSelectionChange"> {
  readonly items: { key: string; title: string }[];
  readonly onSelectionChange?: (key: string) => void;
}

/**
 * A wrapper around the @heroui/react Tabs component that makes the tab list
 * horizontally swipeable on touch devices using the Swiper library.
 * This component acts as an adapter, providing a simple string-based API
 * while handling the library's more complex `Key` type internally.
 */
export function SwipeableTabs({
  items,
  selectedKey,
  onSelectionChange,
  ...props
}: SwipeableTabsProps) {
  const swiperRef = useRef<SwiperClass | null>(null);

  /**
   * Internal handler for the @heroui/react Tabs `onSelectionChange` event.
   * It receives a `Key` (string | number), converts it to a string,
   * and then calls the parent component's handler.
   */
  const handleTabChange = (key: Key) => {
    const keyAsString = String(key);

    if (onSelectionChange) {
      onSelectionChange(keyAsString);
    }

    const selectedIndex = items.findIndex((item) => item.key === keyAsString);
    if (swiperRef.current && selectedIndex !== -1) {
      swiperRef.current.slideTo(selectedIndex);
    }
  };

  return (
    <div className="relative">
      <Tabs
        selectedKey={selectedKey}
        onSelectionChange={handleTabChange}
        {...props}
      >
        {items.map((item) => (
          <Tab key={item.key} title={item.title} />
        ))}
      </Tabs>
      <div className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView="auto"
          initialSlide={items.findIndex((item) => item.key === selectedKey)}
          className="w-full h-full"
        >
          {items.map((item) => (
            <SwiperSlide key={item.key} style={{ width: "auto" }} />
          ))}
        </Swiper>
      </div>
    </div>
  );
}

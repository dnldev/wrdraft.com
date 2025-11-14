"use client";

import "swiper/css";

import { Tab, Tabs, TabsProps } from "@heroui/react";
import React, { Key, ReactNode, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper/types";

interface SwipeableTabsProps
  extends Omit<TabsProps, "children" | "onSelectionChange" | "items"> {
  readonly children: ReactNode;
  readonly onSelectionChange?: (key: string) => void;
}

interface TabItem {
  key: string;
  title: ReactNode;
}

/**
 * A wrapper around the @heroui/react Tabs component that makes the tab list
 * horizontally swipeable on touch devices using the Swiper library.
 */
export function SwipeableTabs({
  children,
  selectedKey,
  onSelectionChange,
  ...props
}: SwipeableTabsProps) {
  const swiperRef = useRef<SwiperClass | null>(null);

  const items = React.Children.toArray(children)
    .map((child): TabItem | null => {
      if (
        React.isValidElement(child) &&
        child.type === Tab &&
        child.key != null
      ) {
        // After validating the type, we can safely assert the props shape
        const { title } = child.props as { title?: ReactNode };
        if (title) {
          return {
            key: String(child.key),
            title,
          };
        }
      }
      return null;
    })
    .filter((item): item is TabItem => item !== null);

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
        {children}
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

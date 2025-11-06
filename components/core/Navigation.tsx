"use client";

import { Button, Tab, Tabs } from "@heroui/react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { icons } from "lucide-react";
import React, { useState } from "react";

import { useQueryState } from "@/hooks/useQueryState";

import { LucideIcon } from "./LucideIcon";
import { MotionMain } from "./MotionMain";

export type MainView =
  | "drafting"
  | "team-comps"
  | "pairings"
  | "champions"
  | "calculator";

interface NavItem {
  id: MainView;
  label: string;
  mobileLabel: string;
  icon: keyof typeof icons;
}

interface NavigationProps {
  views: Record<MainView, React.ReactNode>;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export function Navigation({ views }: NavigationProps) {
  const [activeView, setActiveView] = useQueryState<MainView>(
    "view",
    "drafting"
  );
  const [[direction, prevActiveView], setNavigationState] = useState([
    0,
    activeView,
  ]);

  const navItems: NavItem[] = [
    {
      id: "drafting",
      label: "Tier List",
      mobileLabel: "Tiers",
      icon: "Swords",
    },
    {
      id: "team-comps",
      label: "Team Comps",
      mobileLabel: "Comps",
      icon: "Users",
    },
    {
      id: "pairings",
      label: "Pairings",
      mobileLabel: "Pairs",
      icon: "Handshake",
    },
    {
      id: "champions",
      label: "Champions",
      mobileLabel: "Champs",
      icon: "BookOpen",
    },
    {
      id: "calculator",
      label: "Calculator",
      mobileLabel: "Calc",
      icon: "Calculator",
    },
  ];

  const changeView = (newView: MainView) => {
    const currentIndex = navItems.findIndex(
      (item) => item.id === prevActiveView
    );
    const newIndex = navItems.findIndex((item) => item.id === newView);
    const newDirection = newIndex > currentIndex ? 1 : -1;

    setNavigationState([newDirection, newView]);
    setActiveView(newView);
  };

  const handlePanEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 50;
    const currentIndex = navItems.findIndex((item) => item.id === activeView);

    if (info.offset.x > swipeThreshold && currentIndex > 0) {
      changeView(navItems[currentIndex - 1].id);
    } else if (
      info.offset.x < -swipeThreshold &&
      currentIndex < navItems.length - 1
    ) {
      changeView(navItems[currentIndex + 1].id);
    }
  };

  return (
    <>
      <aside className="fixed top-0 left-0 z-40 h-screen w-64 p-4 flex-col hidden md:flex">
        <div className="text-center my-6">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            DRAGON LANE
            <br />
            PLAYBOOK
          </h1>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <Button
              key={item.id}
              color={activeView === item.id ? "primary" : "default"}
              onPress={() => changeView(item.id)}
              className="justify-start h-14 text-lg"
              startContent={<LucideIcon name={item.icon} size={20} />}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      <div className="md:hidden p-2 bg-content1 border-b border-divider sticky top-0 z-40">
        <Tabs
          aria-label="Mobile Navigation"
          selectedKey={activeView}
          onSelectionChange={(key) => changeView(key as MainView)}
          color="primary"
          variant="underlined"
          fullWidth
          classNames={{
            tab: "py-4 h-auto cursor-pointer",
            tabContent: "flex flex-col items-center gap-1 text-xs",
          }}
        >
          {navItems.map((item) => (
            <Tab
              key={item.id}
              title={
                <div className="flex flex-col items-center gap-1">
                  <LucideIcon name={item.icon} size={20} />
                  <span>{item.mobileLabel}</span>
                </div>
              }
            />
          ))}
        </Tabs>
      </div>

      <MotionMain onPanEnd={handlePanEnd}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeView}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {views[activeView]}
          </motion.div>
        </AnimatePresence>
      </MotionMain>
    </>
  );
}

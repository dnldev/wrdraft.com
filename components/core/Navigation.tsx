"use client";

import { Button, Tab, Tabs } from "@heroui/react";
import { icons } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { LucideIcon } from "./LucideIcon";

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly mobileLabel: string;
  readonly icon: keyof typeof icons;
}

const navItems: NavItem[] = [
  {
    path: "/",
    label: "Tier List",
    mobileLabel: "Tiers",
    icon: "Swords",
  },
  {
    path: "/team-comps",
    label: "Team Comps",
    mobileLabel: "Comps",
    icon: "Users",
  },
  {
    path: "/pairings",
    label: "Pairings",
    mobileLabel: "Pairs",
    icon: "Handshake",
  },
  {
    path: "/champions/adc",
    label: "Champions",
    mobileLabel: "Champs",
    icon: "BookOpen",
  },
  {
    path: "/calculator",
    label: "Calculator",
    mobileLabel: "Calc",
    icon: "Calculator",
  },
  {
    path: "/history",
    label: "History",
    mobileLabel: "History",
    icon: "History",
  },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getSelectedKey = () => {
    if (pathname === "/") return "/";
    if (pathname.startsWith("/team-comps")) return "/team-comps";
    if (pathname.startsWith("/pairings")) return "/pairings";
    if (pathname.startsWith("/champions")) return "/champions/adc";
    if (pathname.startsWith("/calculator")) return "/calculator";
    if (pathname.startsWith("/history")) return "/history";
    return "/";
  };

  const handleMobileTabChange = (key: React.Key) => {
    router.push(key as string);
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
              key={item.path}
              as={Link}
              href={item.path}
              color={isActive(item.path) ? "primary" : "default"}
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
          selectedKey={getSelectedKey()}
          onSelectionChange={handleMobileTabChange}
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
              key={item.path}
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
    </>
  );
}

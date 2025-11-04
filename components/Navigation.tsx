"use client";

import { Button, Tab, Tabs } from "@heroui/react";
import { icons } from "lucide-react";
import React from "react";

import { useQueryState } from "@/hooks/useQueryState";

import { LucideIcon } from "./LucideIcon";

export type MainView =
    | "drafting"
    | "team-comps"
    | "pairings"
    | "champions"
    | "calculator";

interface NavItem {
    id: MainView;
    label: string;
    icon: keyof typeof icons;
}

interface NavigationProps {
    views: Record<MainView, React.ReactNode>;
}

export function Navigation({ views }: NavigationProps) {
    const [activeView, setActiveView] = useQueryState<MainView>(
        "view",
        "drafting"
    );

    const navItems: NavItem[] = [
        { id: "drafting", label: "Drafting", icon: "Swords" },
        { id: "team-comps", label: "Team Comps", icon: "Users" },
        { id: "pairings", label: "Pairings", icon: "Handshake" },
        { id: "champions", label: "Champions", icon: "BookOpen" },
        { id: "calculator", label: "Calculator", icon: "Calculator" },
    ];

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
                            variant="solid"
                            color={activeView === item.id ? "primary" : "default"}
                            onClick={() => setActiveView(item.id)}
                            className="justify-start h-14 text-lg rounded-xl"
                            startContent={<LucideIcon name={item.icon} size={20} />}
                        >
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </aside>

            <div className="md:hidden p-2 bg-card border-b border-border sticky top-0 z-40">
                <Tabs
                    aria-label="Mobile Navigation"
                    selectedKey={activeView}
                    onSelectionChange={(key) => setActiveView(key as MainView)}
                    color="primary"
                    variant="underlined"
                    fullWidth
                >
                    <Tab key="drafting" title="Drafting" />
                    <Tab key="team-comps" title="Comps" />
                    <Tab key="pairings" title="Pairings" />
                    <Tab key="champions" title="Champs" />
                    <Tab key="calculator" title="Calc" />
                </Tabs>
            </div>

            <main className="p-6 md:p-8 md:pl-72">{views[activeView]}</main>
        </>
    );
}
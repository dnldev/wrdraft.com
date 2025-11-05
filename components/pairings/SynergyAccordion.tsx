// FILE: components/pairings/SynergyAccordion.tsx
"use client";

import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import { icons } from "lucide-react";
import React from "react";

import { Synergy } from "@/data/synergyData";

import { LucideIcon } from "../core/LucideIcon";

const ratingMap: Record<
  Synergy["rating"],
  {
    tier: string;
    chipColor: "success" | "warning" | "default" | "danger";
  }
> = {
  Excellent: { tier: "S", chipColor: "success" },
  Good: { tier: "A", chipColor: "warning" },
  Neutral: { tier: "B", chipColor: "default" },
  Poor: { tier: "C", chipColor: "danger" },
};

const borderColorMap: Record<string, string> = {
  success: "border-success",
  warning: "border-primary", // Special case for A-Tier
  default: "border-default",
  danger: "border-danger",
};

interface SynergyEntryCardProps {
  synergy: Synergy;
  parentItemId: string;
  roleToList: "adc" | "support";
}

const SynergyEntryCard: React.FC<SynergyEntryCardProps> = ({
  synergy,
  parentItemId,
  roleToList,
}) => {
  const partner = roleToList === "adc" ? synergy.adc : synergy.support;
  const ratingInfo = ratingMap[synergy.rating];
  const borderColor = borderColorMap[ratingInfo.chipColor];

  return (
    <Card
      key={`${parentItemId}-${partner}`}
      className={`p-4 border-l-4 ${borderColor}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h4 className="font-bold text-lg">{partner}</h4>
          <p className="text-sm text-foreground/70 mt-1">{synergy.note}</p>
        </div>
        <Chip
          color={ratingInfo.chipColor}
          variant="flat"
          className="font-bold shrink-0"
        >
          {ratingInfo.tier} Tier
        </Chip>
      </div>
    </Card>
  );
};

interface AccordionItemData {
  id: string;
  name: string;
  synergies: Synergy[];
}

interface SynergyAccordionProps {
  title: string;
  icon: keyof typeof icons;
  iconColor: string;
  items: AccordionItemData[];
  defaultExpandedKeys: string[];
  roleToList: "adc" | "support";
}

export function SynergyAccordion({
  title,
  icon,
  iconColor,
  items,
  defaultExpandedKeys,
  roleToList,
}: SynergyAccordionProps) {
  return (
    <Card className="p-0">
      <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6">
        <LucideIcon name={icon} className={iconColor} />
        <h2 className={`text-3xl font-bold ${iconColor} text-center`}>
          {title}
        </h2>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 md:p-6">
        <Accordion
          selectionMode="multiple"
          defaultExpandedKeys={defaultExpandedKeys}
        >
          {items.map((item) => (
            <AccordionItem
              key={item.id}
              aria-label={item.name}
              title={item.name}
              classNames={{
                title: "text-xl font-bold text-white",
              }}
            >
              <div className="space-y-4">
                {item.synergies.map((synergy) => (
                  <SynergyEntryCard
                    key={synergy.adc + synergy.support}
                    synergy={synergy}
                    parentItemId={item.id}
                    roleToList={roleToList}
                  />
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </CardBody>
    </Card>
  );
}

"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";

import { LucideIcon } from "./LucideIcon";

export function MatchupCalculator() {
  return (
    <Card className="p-0">
      <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6 bg-card/50">
        <LucideIcon name="Calculator" className="text-amber-400" />
        <h2 className="text-3xl font-bold text-amber-400 text-center">
          Matchup Calculator
        </h2>
      </CardHeader>
      <CardBody className="p-4 md:p-6 text-center">
        <p className="text-foreground/80">This feature is coming soon.</p>
        <p className="mt-2 text-sm text-foreground/60">
          You will be able to input your team and the enemy team to get a
          weighted score for your best champion picks.
        </p>
        <div className="mt-8 space-y-4 max-w-lg mx-auto">
          <Input
            type="text"
            label="Your Support"
            placeholder="e.g., Leona"
            variant="bordered"
          />
          <Input
            type="text"
            label="Enemy ADC"
            placeholder="e.g., Caitlyn"
            variant="bordered"
          />
          <Input
            type="text"
            label="Enemy Support"
            placeholder="e.g., Morgana"
            variant="bordered"
          />
          <Button color="primary" className="w-full font-bold mt-4">
            Calculate Best Pick
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

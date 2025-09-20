"use client";

import React from "react";
import { Card } from "@/components/ui/card";

export default function OverviewStats({ stats }: { stats: { label: string; value: number; delta?: string }[] }) {
  return (
    <>
      {stats.map((s) => (
        <Card key={s.label} className="p-4">
          <div>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-foreground">{s.value.toLocaleString()}</span>
              {s.delta && <span className="text-sm text-muted-foreground">{s.delta}</span>}
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}

"use client";

import React from "react";
import { ChartContainer } from "@/components/ui/chart";
import * as Recharts from "recharts";

export default function TrafficChart({ data }: { data: { date: string; views: number }[] }) {
  const config = {
    views: { label: "Views", color: "#3b82f6" },
  };

  return (
    <ChartContainer id="traffic" config={config} className="h-72">
      <Recharts.LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.XAxis dataKey="date" />
        <Recharts.YAxis />
        <Recharts.Tooltip />
        <Recharts.Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
      </Recharts.LineChart>
    </ChartContainer>
  );
}

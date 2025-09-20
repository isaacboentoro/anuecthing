"use client";

import React from "react";
import OverviewStats from "@/components/analytics/OverviewStats";
import TrafficChart from "@/components/analytics/TrafficChart";
import TopPosts from "@/components/analytics/TopPosts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Views", value: 124_532, delta: "+12%" },
    { label: "Engagement", value: 14_321, delta: "+8%" },
    { label: "Clicks", value: 4_212, delta: "-1%" },
    { label: "Conversions", value: 412, delta: "+3%" },
  ];

  const chartData = [
    { date: "Sep 1", views: 4000 },
    { date: "Sep 5", views: 6000 },
    { date: "Sep 10", views: 8000 },
    { date: "Sep 15", views: 12000 },
    { date: "Sep 20", views: 10000 },
    { date: "Sep 25", views: 14000 },
    { date: "Sep 30", views: 16000 },
  ];

  const topPosts = [
    { id: "1", title: "New Product Launch", views: 45213, engagement: 5231 },
    { id: "2", title: "How-to Guide", views: 23124, engagement: 2134 },
    { id: "3", title: "Behind the Scenes", views: 15213, engagement: 1321 },
    { id: "4", title: "Customer Story", views: 10213, engagement: 912 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Overview of recent traffic and engagement (dummy data)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 size={16} />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <OverviewStats stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Traffic (last 30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <TrafficChart data={chartData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top posts</CardTitle>
            </CardHeader>
            <CardContent>
              <TopPosts posts={topPosts} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

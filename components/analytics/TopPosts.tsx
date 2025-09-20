"use client";

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function TopPosts({ posts }: { posts: { id: string; title: string; views: number; engagement: number }[] }) {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead>Post</TableHead>
          <TableHead className="text-right">Views</TableHead>
          <TableHead className="text-right">Engagement</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {posts.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.title}</TableCell>
            <TableCell className="text-right font-mono">{p.views.toLocaleString()}</TableCell>
            <TableCell className="text-right font-mono">{p.engagement.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

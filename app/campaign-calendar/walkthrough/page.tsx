"use client";

import React from 'react';
import Link from 'next/link';

export default function CampaignCreatorWalkthrough() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold">Campaign Creator Walkthrough</h1>
        <p className="text-gray-600 mt-2">
          Follow these steps to plan, create, and schedule posts for your campaign.
        </p>

        <div className="mt-8 space-y-6">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold">1. Upload your content</h2>
            <p className="text-gray-600 mt-2">
              Use the Content Uploader to add images, videos, and other media you want to include in posts.
            </p>
            <p className="mt-3 text-sm text-gray-500">Tip: You can upload multiple files and tag them per platform.</p>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold">2. Create posts</h2>
            <p className="text-gray-600 mt-2">
              Open the Post Editor to write captions, choose platforms, and attach media. Save drafts if you want to iterate.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold">3. Schedule in the calendar</h2>
            <p className="text-gray-600 mt-2">
              Drag posts onto dates or use the create action from a specific date to schedule. Preview scheduled times before publishing.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold">4. Publish or queue</h2>
            <p className="text-gray-600 mt-2">
              When you're ready, publish immediately or let the scheduler post at the chosen time. Connect analytics to measure performance.
            </p>
          </section>

          <div className="flex gap-3">
            <Link href="/campaign-calendar" className="px-4 py-2 bg-white border rounded-lg">Back to Calendar</Link>
            <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Open Content Uploader</a>
          </div>
        </div>
      </div>
    </div>
  );
}

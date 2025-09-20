import React from 'react';
import Link from 'next/link';

export default function IdeaPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900">Idea — {id}</h1>
        <p className="mt-4 text-gray-600">
          Full idea content not available. Implement server-side fetch or pass article data to render real content.
        </p>

        <div className="mt-6">
          <Link href="/ideas-tab" className="text-blue-600">Back to ideas</Link>
        </div>
      </div>
    </div>
  );
}
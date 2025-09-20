import React from 'react';
import Link from 'next/link';

export default function IdeaPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900">Idea — {id}</h1>
        <p className="mt-4 text-gray-600">
          Short-form video continues to dominate digital engagement in 2025, fueled by bite-sized storytelling that captures attention within seconds. Vertical transitions have become a creative signature, making content flow seamlessly for mobile-first audiences. At the same time, a sound-first approach—from viral audio snippets to immersive music layers—drives interaction, ensuring that video isn’t just watched but experienced. Together, these trends define how brands, creators, and platforms are shaping the next wave of attention economies.
        </p>

        <div className="mt-6">
          <Link href="/ideas-tab" className="text-blue-600">Back to ideas</Link>
        </div>
      </div>
    </div>
  );
}

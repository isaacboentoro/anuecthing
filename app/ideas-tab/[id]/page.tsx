import React from 'react';
import Link from 'next/link';

export default function IdeaPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Map of ids to titles
  const titles: Record<string, string> = {
    a1: "Short-form Video Trends for 2025",
    a2: "Hashtags to Watch This Week",
    a3: "Creator Collab Formats That Convert",
  };
  const bodys: Record<string, string> = {
    a1: "Short-form video continues to dominate digital engagement in 2025, fueled by bite-sized storytelling that captures attention within seconds. Vertical transitions have become a creative signature, making content flow seamlessly for mobile-first audiences. At the same time, a sound-first approach—from viral audio snippets to immersive music layers—drives interaction, ensuring that video isn’t just watched but experienced. Together, these trends define how brands, creators, and platforms are shaping the next wave of attention economies.",
    a2: "Sustainability and mindful living are leading the conversation online.  #EcoStyle is gaining momentum as creators spotlight eco-friendly fashion and everyday sustainable swaps. At the same time, #MindfulTech is trending as audiences explore balanced digital habits, from screen-time resets to tech tools designed for wellbeing. Both hashtags are climbing fast across Instagram and X, signaling a shift toward conscious choices in lifestyle and technology.",
    a3: "Collaborations are evolving into a powerful growth engine, where the blend of long-form storytelling and short-form amplification is proving to deliver the strongest funnel results. In-depth collabs allow creators to build authentic narratives and establish trust, while short-form highlights push that content to wider audiences in bite-sized, shareable moments. Together, this format balances depth with reach, creating a content flow that not only captures attention but also drives meaningful conversions.",
  };

  // Pick the title based on the id, fallback if not found
  const title = titles[id] || "Unknown Idea";
  const body = body[id] || "Unknown Idea";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-4 text-gray-600">
          {body}
        </p>

        <div className="mt-6">
          <Link href="/ideas-tab" className="text-blue-600">
            Back to ideas
          </Link>
        </div>
      </div>
    </div>
  );
}


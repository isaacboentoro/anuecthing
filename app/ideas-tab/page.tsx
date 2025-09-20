import React from 'react';
import ArticleList from '@/components/ideas/ArticleList';

const sampleArticles = [
  {
    id: 'a1',
    title: 'Short-form Video Trends for 2025',
    excerpt: 'Bite-sized storytelling, vertical transitions, and sound-first concepts are driving engagement.',
    content: 'Full article content here...',
    tags: ['tiktok', 'shorts', 'video'],
    source: 'SocialPulse',
    publishedAt: '2025-09-10'
  },
  {
    id: 'a2',
    title: 'Hashtags to Watch This Week',
    excerpt: '#EcoStyle and #MindfulTech are climbing across Instagram and X.',
    content: 'Full article content here...',
    tags: ['hashtags', 'instagram', 'x'],
    source: 'Trendly',
    publishedAt: '2025-09-18'
  },
  {
    id: 'a3',
    title: 'Creator Collab Formats That Convert',
    excerpt: 'Long-form collabs + short-form amplification yields the best funnel results.',
    content: 'Full article content here...',
    tags: ['collab', 'creator'],
    source: 'CreatorWire',
    publishedAt: '2025-09-15'
  }
];

const sampleTrends = [
  '#EcoStyle',
  '#AIArt',
  '#StudyTok',
  '#MicroVlog',
  'Reels Remix',
  'Live Shopping'
];

export default function IdeasTabPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ideas</h1>
            <p className="text-gray-600 mt-1">Trends, hashtags and article ideas for social media right now.</p>
          </div>
        </div>

        <ArticleList articles={sampleArticles} trends={sampleTrends} />
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Bookmark } from 'lucide-react';

export default function IdeaCard({
  article,
  isFavorite,
  onToggleFavorite
}: {
  article: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    source?: string;
    publishedAt?: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="bg-gray-50 p-6 rounded-lg border hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{article.title}</h2>
          <p className="text-sm text-gray-500">{article.source} • {article.publishedAt}</p>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={onToggleFavorite} 
            title="Save idea" 
            className="p-2 rounded-lg hover:bg-white transition-colors"
          >
            <Heart size={18} className={isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'} />
          </button>
          <button
            title="Copy idea"
            onClick={() => navigator.clipboard?.writeText(`${article.title}\n\n${article.excerpt}`)}
            className="p-2 rounded-lg hover:bg-white transition-colors"
          >
            <Bookmark size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-gray-700 leading-relaxed">{article.excerpt}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map(tag => (
          <span key={tag} className="text-xs bg-white text-gray-700 px-3 py-1 rounded-full border">
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <Link
          href={`/ideas-tab/${article.id}`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Read full idea →
        </Link>
      </div>
    </article>
  );
}
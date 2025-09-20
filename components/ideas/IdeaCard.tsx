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
    <article className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{article.title}</h2>
          <p className="text-sm text-gray-500">{article.source} • {article.publishedAt}</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onToggleFavorite} title="Save idea" className="p-2 rounded hover:bg-gray-100">
            <Heart size={18} className={isFavorite ? 'text-red-500' : 'text-gray-400'} />
          </button>
          <button
            title="Copy idea"
            onClick={() => navigator.clipboard?.writeText(`${article.title}\n\n${article.excerpt}`)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Bookmark size={18} />
          </button>
        </div>
      </div>

      <p className="mt-3 text-gray-700">{article.excerpt}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map(tag => (
          <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>
        ))}
      </div>

      <div className="mt-4">
        <Link
          href={`/ideas-tab/${article.id}`}
          className="text-sm text-white bg-blue-600 px-3 py-2 rounded inline-block"
        >
          Open idea
        </Link>
      </div>
    </article>
  );
}
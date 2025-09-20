'use client';

import React, { useEffect, useState } from 'react';
import IdeaCard from './IdeaCard';

type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  source?: string;
  publishedAt?: string;
};

export default function ArticleList({ articles, trends }: { articles: Article[]; trends: string[] }) {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ideas:favs');
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ideas:favs', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFav = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const filtered = articles.filter(a =>
    (a.title + ' ' + a.excerpt + ' ' + (a.tags || []).join(' ')).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1 bg-white rounded-lg p-4 shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search ideas</label>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Search titles, hashtags, sources..."
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Trending</h3>
          <ul className="space-y-2">
            {trends.map(t => (
              <li key={t} className="text-sm text-blue-600">
                #{t.replace(/^#/, '')}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="lg:col-span-3 space-y-4">
        {filtered.map(article => (
          <IdeaCard
            key={article.id}
            article={article}
            isFavorite={favorites.includes(article.id)}
            onToggleFavorite={() => toggleFav(article.id)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow text-gray-600">No ideas match your search.</div>
        )}
      </main>
    </div>
  );
}
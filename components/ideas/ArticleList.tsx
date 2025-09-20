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
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Article Ideas</h2>
        <p className="text-sm text-gray-600">Curated content ideas and trending topics</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <aside className="lg:col-span-1">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search ideas</label>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search titles, hashtags, sources..."
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">General Trends</h3>
            <ul className="space-y-2">
              {trends.map(t => (
                <li key={t} className="text-sm">
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    #{t.replace(/^#/, '')}
                  </span>
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
            <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
              <p>No ideas match your search.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
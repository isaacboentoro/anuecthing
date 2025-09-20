'use client';

import React from 'react';
import { TikTokHashtag } from '@/lib/tiktok-api';
import { TrendingUp, Hash } from 'lucide-react';

interface TikTokHashtagListProps {
  hashtags: TikTokHashtag[];
  onHashtagClick?: (hashtag: string) => void;
}

const formatViewCount = (count: number): string => {
  if (count >= 1000000000) {
    return (count / 1000000000).toFixed(1) + 'B';
  } else if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

export default function TikTokHashtagList({ hashtags, onHashtagClick }: TikTokHashtagListProps) {
  const handleHashtagClick = (hashtag: string) => {
    if (onHashtagClick) {
      onHashtagClick(hashtag);
    } else {
      // Default behavior: search TikTok for the hashtag
      window.open(`https://www.tiktok.com/tag/${hashtag.replace('#', '')}`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900">Trending Hashtags</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {hashtags.map((hashtag, index) => (
            <div
              key={hashtag.hashtag_id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleHashtagClick(hashtag.hashtag_name)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <span className="text-blue-600 font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Hash size={14} className="text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {hashtag.hashtag_name}
                    </span>
                    {hashtag.is_commerce && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        Commerce
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatViewCount(hashtag.view_count)} views
                  </p>
                </div>
              </div>
              
              <div className="text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        {hashtags.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Hash size={32} className="mx-auto mb-2 opacity-50" />
            <p>No trending hashtags available</p>
          </div>
        )}
      </div>
    </div>
  );
}
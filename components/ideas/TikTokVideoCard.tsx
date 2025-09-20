'use client';

import React from 'react';
import { TikTokVideo } from '@/lib/tiktok-api';
import { Play, Heart, MessageCircle, Share, Download } from 'lucide-react';

interface TikTokVideoCardProps {
  video: TikTokVideo;
  showEmbed?: boolean;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `0:${secs.toString().padStart(2, '0')}`;
};

export default function TikTokVideoCard({ video, showEmbed = false }: TikTokVideoCardProps) {
  const handleVideoClick = () => {
    window.open(video.share_url, '_blank');
  };

  const copyVideoUrl = () => {
    navigator.clipboard?.writeText(video.share_url);
  };

  if (showEmbed) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="relative">
          {/* TikTok Embed */}
          <div className="aspect-[9/16] max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
            <blockquote 
              className="tiktok-embed" 
              cite={video.share_url} 
              data-video-id={video.id}
              style={{ maxWidth: '605px', minWidth: '325px', margin: '0 auto' }}
            >
              <section>
                <a target="_blank" title={`@${video.author.unique_id}`} href={`https://www.tiktok.com/@${video.author.unique_id}?refer=embed`}>
                  @{video.author.unique_id}
                </a>
                {' '}{video.desc}
              </section>
            </blockquote>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={video.author.avatar_thumb.url_list[0]}
              alt={video.author.nickname}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-sm">@{video.author.unique_id}</p>
              <p className="text-gray-600 text-xs">{video.author.nickname}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-800 mb-3 line-clamp-3">{video.desc}</p>
          
          <div className="flex items-center justify-between text-gray-600 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {formatNumber(video.statistics.digg_count)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                {formatNumber(video.statistics.comment_count)}
              </span>
              <span className="flex items-center gap-1">
                <Share size={14} />
                {formatNumber(video.statistics.share_count)}
              </span>
            </div>
            <button
              onClick={copyVideoUrl}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="Copy link"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer" onClick={handleVideoClick}>
      <div className="relative">
        <img
          src={video.video.cover}
          alt={video.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-t-lg">
          <Play size={40} className="text-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.video.duration)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={video.author.avatar_thumb.url_list[0]}
            alt={video.author.nickname}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">@{video.author.unique_id}</p>
            <p className="text-gray-600 text-xs truncate">{video.author.nickname}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-800 mb-3 line-clamp-2">{video.desc}</p>
        
        <div className="flex items-center justify-between text-gray-600 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart size={12} />
              {formatNumber(video.statistics.digg_count)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={12} />
              {formatNumber(video.statistics.comment_count)}
            </span>
            <span className="flex items-center gap-1">
              <Share size={12} />
              {formatNumber(video.statistics.share_count)}
            </span>
          </div>
          <span className="text-gray-500">
            {formatNumber(video.statistics.play_count)} views
          </span>
        </div>
      </div>
    </div>
  );
}
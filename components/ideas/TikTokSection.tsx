'use client';

import React, { useState, useEffect } from 'react';
import { tiktokApi, TikTokVideo, TikTokHashtag } from '@/lib/tiktok-api';
import TikTokVideoCard from './TikTokVideoCard';
import TikTokHashtagList from './TikTokHashtagList';
import { RefreshCw, PlayCircle, Hash } from 'lucide-react';
import Script from 'next/script';

interface TikTokSectionProps {
  className?: string;
}

export default function TikTokSection({ className = '' }: TikTokSectionProps) {
  // Dummy data directly in component to ensure it always displays
  const dummyVideos: TikTokVideo[] = [
    {
      id: '7549110798036028694',
      title: 'District Court Witnessing',
      desc: 'Just so happen to be working right out side of district court today to witness this 🫠 #yungfilly #perthcbd',
      video: {
        duration: 32,
        ratio: '720p',
        cover: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Court+Witness',
        dynamic_cover: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Court+Witness',
        origin_cover: 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Court+Witness',
        play_addr: {
          uri: '7549110798036028694',
          url_list: ['https://www.tiktok.com/@avatoulson/video/7549110798036028694']
        }
      },
      author: {
        id: 'avatoulson_id',
        unique_id: 'avatoulson',
        nickname: 'avatoulson',
        avatar_thumb: {
          uri: 'avatoulson_avatar',
          url_list: ['https://via.placeholder.com/50x50/ff6b6b/ffffff?text=AV']
        }
      },
      statistics: {
        comment_count: 847,
        digg_count: 12400,
        download_count: 234,
        play_count: 89500,
        share_count: 567
      },
      create_time: Date.now() - 3600000,
      share_url: 'https://www.tiktok.com/@avatoulson/video/7549110798036028694'
    },
    {
      id: '7550480059090390290',
      title: 'Cheesy Toastie',
      desc: 'So cheesy #cheese #toastie',
      video: {
        duration: 24,
        ratio: '720p',
        cover: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=Cheese+Toastie',
        dynamic_cover: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=Cheese+Toastie',
        origin_cover: 'https://via.placeholder.com/300x400/2ecc71/ffffff?text=Cheese+Toastie',
        play_addr: {
          uri: '7550480059090390290',
          url_list: ['https://www.tiktok.com/@j_top/video/7550480059090390290']
        }
      },
      author: {
        id: 'j_top_id',
        unique_id: 'j_top',
        nickname: 'J Top',
        avatar_thumb: {
          uri: 'j_top_avatar',
          url_list: ['https://via.placeholder.com/50x50/2ecc71/ffffff?text=JT']
        }
      },
      statistics: {
        comment_count: 1230,
        digg_count: 45600,
        download_count: 890,
        play_count: 156000,
        share_count: 2340
      },
      create_time: Date.now() - 7200000,
      share_url: 'https://www.tiktok.com/@j_top/video/7550480059090390290'
    },
    {
      id: '7550555019594960149',
      title: 'iOS 26 Update Review',
      desc: 'ios 26 looks SOOOO ahh 🫩🥀💔 i\'m gonna stay on 18 as long as possible #iphone #newupdate #newfeature #yikes #ihateit',
      video: {
        duration: 41,
        ratio: '720p',
        cover: 'https://via.placeholder.com/300x400/3498db/ffffff?text=iOS+26+Review',
        dynamic_cover: 'https://via.placeholder.com/300x400/3498db/ffffff?text=iOS+26+Review',
        origin_cover: 'https://via.placeholder.com/300x400/3498db/ffffff?text=iOS+26+Review',
        play_addr: {
          uri: '7550555019594960149',
          url_list: ['https://www.tiktok.com/@ebayscam/video/7550555019594960149']
        }
      },
      author: {
        id: 'ebayscam_id',
        unique_id: 'ebayscam',
        nickname: 'ebayscam',
        avatar_thumb: {
          uri: 'ebayscam_avatar',
          url_list: ['https://via.placeholder.com/50x50/3498db/ffffff?text=ES']
        }
      },
      statistics: {
        comment_count: 2340,
        digg_count: 78900,
        download_count: 1560,
        play_count: 234000,
        share_count: 4560
      },
      create_time: Date.now() - 10800000,
      share_url: 'https://www.tiktok.com/@ebayscam/video/7550555019594960149'
    }
  ];

  const dummyHashtags: TikTokHashtag[] = [
    { hashtag_name: 'yungfilly', hashtag_id: '1', view_count: 45600000, is_commerce: false },
    { hashtag_name: 'perthcbd', hashtag_id: '2', view_count: 12300000, is_commerce: false },
    { hashtag_name: 'cheese', hashtag_id: '3', view_count: 890000000, is_commerce: true },
    { hashtag_name: 'toastie', hashtag_id: '4', view_count: 156000000, is_commerce: true },
    { hashtag_name: 'iphone', hashtag_id: '5', view_count: 2800000000, is_commerce: true },
    { hashtag_name: 'newupdate', hashtag_id: '6', view_count: 340000000, is_commerce: false },
    { hashtag_name: 'newfeature', hashtag_id: '7', view_count: 290000000, is_commerce: false },
    { hashtag_name: 'yikes', hashtag_id: '8', view_count: 678000000, is_commerce: false },
    { hashtag_name: 'ihateit', hashtag_id: '9', view_count: 123000000, is_commerce: false },
    { hashtag_name: 'fyp', hashtag_id: '10', view_count: 5200000000, is_commerce: false }
  ];

  const [videos, setVideos] = useState<TikTokVideo[]>(dummyVideos);
  const [hashtags, setHashtags] = useState<TikTokHashtag[]>(dummyHashtags);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'hashtags'>('videos');

  const fetchTikTokData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = await tiktokApi.getTrendingContent();
      setVideos(data.videos.length > 0 ? data.videos : dummyVideos);
      setHashtags(data.hashtags.length > 0 ? data.hashtags : dummyHashtags);
    } catch (err) {
      setError('Failed to fetch TikTok trending content');
      console.error('TikTok API error:', err);
      // Fallback to dummy data on error
      setVideos(dummyVideos);
      setHashtags(dummyHashtags);
    } finally {
      setLoading(false);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    // You could implement search functionality here
    console.log('Hashtag clicked:', hashtag);
  };

  return (
    <>
      <Script 
        async 
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
      />
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                <PlayCircle size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">TikTok Trending</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchTikTokData}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <PlayCircle size={18} />
            Trending Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('hashtags')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'hashtags'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Hash size={18} />
            Trending Hashtags ({hashtags.length})
          </button>
        </div>
      </div>

      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600">Loading TikTok content...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">
              <PlayCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p className="font-medium">Failed to load TikTok content</p>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchTikTokData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <TikTokVideoCard key={video.id} video={video} />
                ))}
                {videos.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <PlayCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No trending videos available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hashtags' && (
              <div className="max-w-2xl">
                <TikTokHashtagList hashtags={hashtags} onHashtagClick={handleHashtagClick} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}
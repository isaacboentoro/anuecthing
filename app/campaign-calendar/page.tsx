'use client';

import React, { useState, useCallback } from 'react';
import { CalendarView } from '@/components/campaign-calendar/CalendarView';
import { PostEditor } from '@/components/campaign-calendar/PostEditor';
import { ContentUploader } from '@/components/campaign-calendar/ContentUploader';
import { Plus, Settings, BarChart3 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published';
  media?: string[];
}

export default function CampaignCalendarPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'New Product Launch',
      content: 'Excited to announce our latest product! 🚀 #newproduct #innovation',
      platforms: ['instagram', 'facebook', 'linkedin'],
      scheduledDate: new Date(2024, 0, 15, 10, 0),
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Behind the Scenes',
      content: 'Take a look behind the scenes of our creative process! ✨',
      platforms: ['instagram', 'tiktok'],
      scheduledDate: new Date(2024, 0, 18, 14, 30),
      status: 'draft'
    }
  ]);

  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [showUploader, setShowUploader] = useState(false);

  const handlePostMove = useCallback((postId: string, newDate: Date) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, scheduledDate: newDate }
        : post
    ));
  }, []);

  const handleCreatePost = useCallback((date: Date) => {
    setSelectedDate(date);
    setEditingPost(undefined);
    setShowPostEditor(true);
  }, []);

  const handleEditPost = useCallback((post: Post) => {
    setEditingPost(post);
    setSelectedDate(undefined);
    setShowPostEditor(true);
  }, []);

  const handleSavePost = useCallback((post: Post) => {
    if (editingPost) {
      setPosts(prev => prev.map(p => p.id === post.id ? post : p));
    } else {
      setPosts(prev => [...prev, post]);
    }
  }, [editingPost]);

  const handlePublishPost = useCallback(async (post: Post) => {
    // Here you would integrate with social media APIs
    console.log('Publishing post:', post);
    
    // Update post status
    setPosts(prev => prev.map(p => 
      p.id === post.id ? { ...post, status: 'published' } : p
    ));
  }, []);

  const handleMediaUpload = useCallback((media: any[]) => {
    console.log('Media uploaded:', media);
    // Handle media upload logic
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Calendar</h1>
            <p className="text-gray-600 mt-1">
              Plan, schedule, and manage your social media content
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus size={16} />
              Upload Content
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 size={16} />
              Analytics
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings size={16} />
              Settings
            </button>
          </div>
        </div>

        {/* Content Uploader */}
        {showUploader && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Content</h2>
            <ContentUploader
              onMediaUpload={handleMediaUpload}
              selectedPlatforms={['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin']}
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {posts.filter(p => p.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-green-600">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <CalendarView
          posts={posts}
          onPostMove={handlePostMove}
          onCreatePost={handleCreatePost}
        />

        {/* Post Editor Modal */}
        <PostEditor
          post={editingPost}
          initialDate={selectedDate}
          isOpen={showPostEditor}
          onClose={() => setShowPostEditor(false)}
          onSave={handleSavePost}
          onPublish={handlePublishPost}
        />
      </div>
    </div>
  );
}

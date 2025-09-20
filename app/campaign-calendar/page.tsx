"use client";

import React, { useState, useCallback } from 'react';
import { CalendarView } from '@/components/campaign-calendar/CalendarView';
import { PostEditor } from '@/components/campaign-calendar/PostEditor';
import type { Post } from '@/components/campaign-calendar/types';
import { ContentUploader } from '@/components/campaign-calendar/ContentUploader';
import { Plus, Settings, BarChart3 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Form } from "@/components/ui/form";

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

  const handlePostMove = useCallback((postId: string, newDate: Date) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, scheduledDate: newDate }
          : post
      )
    );
  }, []);

  const handleCreatePost = useCallback((date: Date) => {
    setEditingPost(undefined);
    setSelectedDate(date);
    setShowPostEditor(true);
  }, []);

  const handleEditPost = useCallback((post: Post) => {
    setEditingPost(post);
    setSelectedDate(undefined);
    setShowPostEditor(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setShowPostEditor(false);
    setEditingPost(undefined);
    setSelectedDate(undefined);
  }, []);

  const handleSavePost = useCallback((post: Post | undefined) => {
    if (!post) return; // Prevent error if post is undefined
    setPosts(prev => {
      const exists = prev.some(p => p.id === post.id);
      if (exists) {
        return prev.map(p => p.id === post.id ? post : p);
      } else {
        return [...prev, post];
      }
    });
    setShowPostEditor(false);
  }, []);

  const handlePublishPost = useCallback((post: Post) => {
    console.log('Publishing post (walkthrough placeholder):', post);
    setPosts(prev => prev.map(p => 
      p.id && post.id && p.id === post.id ? { ...post, status: 'published' } : p
    ));
  }, []);

  const handleMediaUpload = useCallback((media: any[]) => {
    console.log('Media uploaded:', media);
  }, []);

  const handleDeleteScheduledPost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  const handleDeleteDraftPost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  // Function to handle the plus button click
  const handleQuickCreatePost = useCallback(() => {
    setEditingPost(undefined);
    setSelectedDate(new Date()); // Set to current date
    setShowPostEditor(true);
  }, []);

  const handleDeletePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setShowPostEditor(false);
    setEditingPost(undefined);
    setSelectedDate(undefined);
  }, []);

  return (
    <div className="min-h-screen bg-white">
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
             {/* Quick Create Post Button */}
             <button
               onClick={handleQuickCreatePost}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
             >
               <Plus size={16} />
               Create Post
             </button>

             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
               <BarChart3 size={16} />
               Analytics
             </button>
             
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
               <Settings size={16} />
               Settings
             </button>
           </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {posts.filter(p => p.status === 'scheduled').length}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {posts.filter(p => p.status === 'scheduled').map(post => (
                <div key={post.id} className="flex items-center justify-between text-sm bg-blue-50 rounded px-2 py-1">
                  <span className="truncate text-gray-800">{post.title}</span>
                  <button
                    className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => typeof post.id === 'string' && handleDeleteScheduledPost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-green-600">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {posts.filter(p => p.status === 'draft').map(post => (
                <div key={post.id} className="flex items-center justify-between text-sm bg-gray-50 rounded px-2 py-1">
                  <span className="truncate text-gray-800">{post.title}</span>
                  <button
                    className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => typeof post.id === 'string' && handleDeleteDraftPost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <CalendarView
          posts={posts}
          onPostMove={handlePostMove}
          onCreatePost={handleCreatePost}
          onEditPost={handleEditPost}
        />

        {/* Post Editor Modal */}
        <PostEditor
          post={editingPost}
          initialDate={selectedDate}
          isOpen={showPostEditor}
          onClose={handleCloseEditor}
          onSave={handleSavePost}
          onPublish={handlePublishPost}
          onDelete={handleDeletePost}
          contentUploader={
            <ContentUploader
              onMediaUpload={handleMediaUpload}
              selectedPlatforms={['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin']}
            />
          }
          FormComponent={Form}
          CalendarComponent={Calendar}
        />
      </div>
    </div>
  );
}
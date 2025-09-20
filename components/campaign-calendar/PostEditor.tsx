'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Send, Save, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id?: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: Date;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
  media?: string[];
}

interface PostEditorProps {
  post?: Post;
  initialDate?: Date;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Post) => void;
  onPublish?: (post: Post) => void;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-black' },
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
  { id: 'youtube', name: 'YouTube', color: 'bg-red-600' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' }
];

export const PostEditor: React.FC<PostEditorProps> = ({
  post,
  initialDate,
  isOpen,
  onClose,
  onSave,
  onPublish
}) => {
  const [formData, setFormData] = useState<Post>({
    title: '',
    content: '',
    platforms: [],
    scheduledDate: initialDate || new Date(),
    scheduledTime: '12:00',
    status: 'draft'
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        scheduledTime: format(post.scheduledDate, 'HH:mm')
      });
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        scheduledDate: initialDate
      }));
    }
  }, [post, initialDate]);

  const handleSubmit = (action: 'save' | 'schedule' | 'publish') => {
    const [hours, minutes] = formData.scheduledTime.split(':').map(Number);
    const scheduledDateTime = new Date(formData.scheduledDate);
    scheduledDateTime.setHours(hours, minutes);

    const postData = {
      ...formData,
      id: post?.id || Date.now().toString(),
      scheduledDate: scheduledDateTime,
      status: action === 'publish' ? 'published' as const : 
              action === 'schedule' ? 'scheduled' as const : 'draft' as const
    };

    if (action === 'publish' && onPublish) {
      onPublish(postData);
    } else {
      onSave(postData);
    }
    onClose();
  };

  const togglePlatform = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  if (!isOpen) return null;

  return (
    // make overlay scrollable and allow modal to be centered while still scrolling when needed
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden mx-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye size={16} />
              Preview
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 
          Use a flex container with max-height and min-h-0 so children can scroll.
          Give panels overflow-y-auto + min-h-0 so internal scrolling works on long content.
        */}
        <div className="flex max-h-[calc(100vh-120px)] min-h-0">
          {/* Editor Panel */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto border-r min-h-0`}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter post title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your post content..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.content.length} characters
                </p>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platforms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        formData.platforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={format(formData.scheduledDate, 'yyyy-MM-dd')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      scheduledDate: new Date(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} className="inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto min-h-0">
              <h3 className="font-medium text-gray-800 mb-4">Preview</h3>
              <div className="space-y-4">
                {formData.platforms.map((platformId) => {
                  const platform = PLATFORMS.find(p => p.id === platformId);
                  return (
                    <div key={platformId} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${platform?.color}`}></div>
                        <span className="font-medium text-sm">{platform?.name}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{formData.title}</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {formData.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Scheduled for {format(formData.scheduledDate, 'MMM d, yyyy')} at {formData.scheduledTime}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit('save')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Save size={16} />
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit('schedule')}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Calendar size={16} />
              Schedule
            </button>
            {onPublish && (
              <button
                onClick={() => handleSubmit('publish')}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Send size={16} />
                Publish Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

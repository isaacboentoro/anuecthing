"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar, Clock, Send, Save, Eye } from "lucide-react";
import { format } from "date-fns";
import type { Post } from './types';

interface PostEditorProps {
  post?: Post;
  // initial single date when opening from a calendar drop
  initialDate?: Date;
  // optionally allow opening with multiple initial ISO dates (yyyy-mm-dd)
  initialDates?: string[];
  // optional media to preview / attach
  mediaId?: string;
  mediaUrl?: string;
  isOpen: boolean;
  onClose: () => void;
  // legacy single save
  onSave: (post: Post) => void;
  // new: save multiple posts at once
  onSaveMultiple?: (posts: Post[]) => void;
  onPublish?: (post: Post) => void;
  // Add contentUploader prop
  contentUploader?: React.ReactNode;
}

const PLATFORMS = [
  { id: "instagram", name: "Instagram", color: "bg-pink-500" },
  { id: "tiktok", name: "TikTok", color: "bg-black" },
  { id: "facebook", name: "Facebook", color: "bg-blue-600" },
  { id: "youtube", name: "YouTube", color: "bg-red-600" },
  { id: "linkedin", name: "LinkedIn", color: "bg-blue-700" },
];

export const PostEditor: React.FC<PostEditorProps> = ({
  post,
  initialDate,
  initialDates,
  isOpen,
  onClose,
  onSave,
  onSaveMultiple,
  onPublish,
  mediaId,
  mediaUrl,
  contentUploader, // add here
}) => {
  const [formData, setFormData] = useState<Post>(() => {
    if (post) return post;
    return {
      id: '',
      title: '',
      content: '',
      platforms: [],
      scheduledDate: initialDate ?? new Date(),
      status: 'draft',
    };
  });

  const [showPreview, setShowPreview] = useState(false);
  const [additionalDates, setAdditionalDates] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData({
        id: '',
        title: '',
        content: '',
        platforms: [],
        scheduledDate: initialDate ?? new Date(),
        status: 'draft',
      });
    }
  }, [post, initialDate, isOpen]);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        scheduledTime: format(post.scheduledDate, "HH:mm"),
      });
    } else if (initialDate) {
      setFormData((prev) => ({
        ...prev,
        scheduledDate: initialDate,
      }));
    }
    if (initialDates && initialDates.length) {
      setAdditionalDates(initialDates.slice(1));
      // if initialDates provided, set the primary scheduledDate to the first
      try {
        const d = new Date(initialDates[0]);
        if (!isNaN(d.getTime())) setFormData((prev) => ({ ...prev, scheduledDate: d }));
      } catch (err) {
        // ignore
      }
    }
  }, [post, initialDate, initialDates]);

  const handleSubmit = (action: "save" | "schedule" | "publish") => {
    const timeStr = formData.scheduledTime || '12:00';
    const [hours, minutes] = timeStr.split(":").map(Number);

    const baseDates = [formData.scheduledDate, ...additionalDates.map((d) => new Date(d))];
    const postsToCreate: Post[] = baseDates.map((d) => {
      const scheduledDateTime = new Date(d);
      scheduledDateTime.setHours(hours, minutes);
      return {
        ...formData,
        id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
        scheduledDate: scheduledDateTime,
        status:
          action === "publish"
            ? "published"
            : action === "schedule"
            ? "scheduled"
            : "draft",
        mediaId: (post as any)?.mediaId || mediaId,
      };
    });

    if (action === "publish" && onPublish) {
      // publish the first one via onPublish for compatibility
      onPublish(postsToCreate[0]);
    }

    if (onSaveMultiple) {
      onSaveMultiple(postsToCreate);
    } else if (postsToCreate.length > 0) {
      // fallback: call onSave for the first item
      onSave(postsToCreate[0]);
    }

    onClose();
  };

  const togglePlatform = (platformId: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId) ? prev.platforms.filter((p) => p !== platformId) : [...prev.platforms, platformId],
    }));
  };

  if (!isOpen) return null;

  return (
    // overlay centers modal; modal is a flex column so header/content/footer layout allows inner scrolling
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-start justify-center overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden mx-auto">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">{post ? "Edit Post" : "Create New Post"}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Eye size={16} />
              Preview
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>
        {/* content area: flex row with editor and preview. Make it grow and allow inner scrolling */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Editor Panel */}
          <div className={`${showPreview ? "w-1/2" : "w-full"} p-6 overflow-y-auto border-r min-h-0`}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} placeholder="Enter post title..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea value={formData.content} onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))} placeholder="Write your post content..." rows={8} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                <p className="text-xs text-gray-500 mt-1">{formData.content.length} characters</p>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((platform) => (
                    <button key={platform.id} onClick={() => togglePlatform(platform.id)} className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${formData.platforms.includes(platform.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar size={16} className="inline mr-1" />Date</label>
                  <input
                    type="date"
                    value={
                      formData.scheduledDate instanceof Date && !isNaN(formData.scheduledDate.getTime())
                        ? format(formData.scheduledDate, "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) => {
                      const prev = formData.scheduledDate instanceof Date && !isNaN(formData.scheduledDate.getTime())
                        ? formData.scheduledDate
                        : new Date();
                      const [year, month, day] = e.target.value.split('-').map(Number);
                      // preserve time from previous date
                      const newDate = new Date(
                        year,
                        month - 1,
                        day,
                        prev.getHours(),
                        prev.getMinutes(),
                        prev.getSeconds()
                      );
                      setFormData((prevForm) => ({
                        ...prevForm,
                        scheduledDate: newDate,
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Clock size={16} className="inline mr-1" />Time</label>
                  <input type="time" value={formData.scheduledTime} onChange={(e) => setFormData((prev) => ({ ...prev, scheduledTime: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              {/* Additional dates */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Also schedule on</label>
                <div className="space-y-2">
                  {additionalDates.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="date" value={d} onChange={(e) => setAdditionalDates((prev) => prev.map((x, i) => (i === idx ? e.target.value : x)))} className="px-3 py-2 border border-gray-300 rounded-lg" />
                      <button onClick={() => setAdditionalDates((prev) => prev.filter((_, i) => i !== idx))} className="px-2 py-1 text-sm text-red-500">Remove</button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <input id="new-add-date" type="date" className="px-3 py-2 border border-gray-300 rounded-lg" />
                    <button onClick={() => {
                      const el = document.getElementById('new-add-date') as HTMLInputElement | null;
                      if (el && el.value) {
                        setAdditionalDates((prev) => [...prev, el.value]);
                        el.value = '';
                      }
                    }} className="px-3 py-2 bg-blue-600 text-white rounded-lg">Add</button>
                  </div>
                </div>
              </div>

              {/* Content Uploader */}
              {contentUploader}

              {/* Media preview if provided */}
              {mediaUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attached media</label>
                  <div className="w-48 h-28 rounded overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mediaUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto min-h-0">
              <h3 className="font-medium text-gray-800 mb-4">Preview</h3>
              <div className="space-y-4">
                {formData.platforms.map((platformId) => {
                  const platform = PLATFORMS.find((p) => p.id === platformId);
                  return (
                    <div key={platformId} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${platform?.color}`}></div>
                        <span className="font-medium text-sm">{platform?.name}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{formData.title}</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{formData.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="text-sm text-gray-600">Scheduled for {format(formData.scheduledDate, 'MMM d, yyyy')} at {formData.scheduledTime}</div>
          <div className="flex gap-3">
            <button onClick={() => handleSubmit('save')} className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
              <Save size={16} />
              Save Draft
            </button>
            <button onClick={() => handleSubmit('schedule')} className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Calendar size={16} />
              Schedule
            </button>
            {onPublish && (
              <button onClick={() => handleSubmit('publish')} className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
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

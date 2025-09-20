"use client";

import React, { useEffect, useState } from "react";
import { X, Eye } from "lucide-react";
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
  // Accept FormComponent and CalendarComponent as props
  FormComponent?: React.ComponentType<any>;
  CalendarComponent?: React.ComponentType<any>;
  onDelete?: (postId: string) => void;
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
  contentUploader,
  FormComponent,
  CalendarComponent,
  onDelete,
}) => {
  // Form state
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [platforms, setPlatforms] = useState<string[]>(post?.platforms ?? []);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(post?.scheduledDate ?? initialDate);
  const [showPreview, setShowPreview] = useState(false);
  const [additionalDates, setAdditionalDates] = useState<string[]>([]);

  // Add mount/animate state to enable enter/exit animations
  const [mounted, setMounted] = useState<boolean>(isOpen);
  const [animateIn, setAnimateIn] = useState<boolean>(false);

  // close on Escape key
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPlatforms(post.platforms);
      setScheduledDate(post.scheduledDate);
    } else {
      setTitle("");
      setContent("");
      setPlatforms([]);
      setScheduledDate(initialDate);
    }
  }, [post, initialDate, isOpen]);

  useEffect(() => {
    if (initialDates && initialDates.length) {
      setAdditionalDates(initialDates.slice(1));
      // if initialDates provided, set the primary scheduledDate to the first
      try {
        const d = new Date(initialDates[0]);
        if (!isNaN(d.getTime())) setScheduledDate(d);
      } catch (err) {
        // ignore
      }
    }
  }, [initialDates]);

  useEffect(() => {
    let t: number | undefined;
    if (isOpen) {
      // ensure animate state is reset, mount, then trigger enter animation on next tick
      setAnimateIn(false);
      setMounted(true);
      t = window.setTimeout(() => setAnimateIn(true), 10); // small delay to ensure classes transition
    } else {
      // start exit animation, then unmount after duration
      setAnimateIn(false);
      t = window.setTimeout(() => setMounted(false), 200); // match duration below
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isOpen]);

  // detect editing early so we can branch logic
  const isEditing = typeof post?.id === "string" && post?.id.length > 0;

  const handleSubmit = (action: "save" | "schedule" | "publish") => {
    const timeStr = '12:00';
    const [hours, minutes] = timeStr.split(":").map(Number);

    // compute one scheduled date/time
    const baseDate = scheduledDate ?? new Date();
    const scheduledDateTime = new Date(baseDate);
    scheduledDateTime.setHours(hours, minutes);

    if (isEditing) {
      // update the existing post (keep the same id)
      const updated: Post = {
        id: post!.id,
        title,
        content,
        platforms,
        scheduledDate: scheduledDateTime,
        status:
          action === "publish"
            ? "published"
            : action === "schedule"
            ? "scheduled"
            : "draft",
        mediaId: (post as any)?.mediaId || mediaId,
      };

      if (action === "publish" && onPublish) {
        onPublish(updated);
      }
      onSave(updated);
    } else {
      // creating new post(s); include additionalDates if provided
      const baseDates = [scheduledDate, ...additionalDates.map((d) => new Date(d))].filter(
        (d): d is Date => d !== undefined
      );
      const postsToCreate: Post[] = baseDates.map((d) => {
        const dt = new Date(d);
        dt.setHours(hours, minutes);
        return {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
          title,
          content,
          platforms,
          scheduledDate: dt,
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
        onPublish(postsToCreate[0]);
      }
      if (onSaveMultiple) {
        onSaveMultiple(postsToCreate);
      } else if (postsToCreate.length > 0) {
        onSave(postsToCreate[0]);
      }
    }

    onClose();
  };

  const togglePlatform = (platformId: string) => {
    setPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  };

  if (!mounted) return null;

  return (
    // overlay centers modal; modal is a flex column so header/content/footer layout allows inner scrolling
    <div
      className={`fixed inset-0 z-50 p-4 flex items-center justify-center overflow-hidden overscroll-contain transition-opacity duration-200 ${animateIn ? "opacity-100" : "opacity-0"} backdrop-blur-sm bg-black/40`}
      aria-hidden={!animateIn}
      style={{ willChange: 'opacity' }}
    >
      <div
        className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden mx-auto transform-gpu transition-all duration-200 ${animateIn ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
        style={{ willChange: 'transform, opacity' }}
      >
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
          <div
            className={`${showPreview ? "w-1/2" : "w-full"} p-6 overflow-y-auto overscroll-contain border-r min-h-0`}
            style={{ contain: 'layout paint style' }}
          >
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post content..." rows={8} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((platform) => (
                    <button key={platform.id} onClick={() => togglePlatform(platform.id)} className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${platforms.includes(platform.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                      <span className="font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="rounded border">
                    {CalendarComponent ? (
                      <CalendarComponent
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-red-500 text-sm">Calendar component not provided.</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={
                      scheduledDate !== undefined && scheduledDate !== null
                        ? scheduledDate.toTimeString().slice(0,5)
                        : ""
                    }
                    onChange={(e) =>
                      setScheduledDate((prev) => {
                        if (!prev) return prev;
                        const [hours, minutes] = e.target.value.split(":").map(Number);
                        const newDate = new Date(prev);
                        newDate.setHours(hours, minutes);
                        return newDate;
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
            <div
              className="w-1/2 p-6 bg-gray-50 overflow-y-auto overscroll-contain min-h-0"
              style={{ contain: 'layout paint style' }}
            >
              <h3 className="font-medium text-gray-800 mb-4">Preview</h3>
              <div className="space-y-4">
                {platforms.map((platformId) => {
                  const platform = PLATFORMS.find((p) => p.id === platformId);
                  return (
                    <div key={platformId} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${platform?.color}`}></div>
                        <span className="font-medium text-sm">{platform?.name}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">{title}</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{content}</p>
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
          <div className="text-sm text-gray-600">Scheduled for {format(scheduledDate ?? new Date(), 'MMM d, yyyy')} at {'12:00'}</div>
          <div className="flex gap-3">
            <button onClick={() => handleSubmit('save')} className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
              Save Draft
            </button>
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit('schedule')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('publish')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Publish
                </button>
                {onDelete && post?.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (post?.id) {
                        onDelete(post.id);
                      }
                      onClose();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                ) : null}
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit('schedule')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Schedule
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

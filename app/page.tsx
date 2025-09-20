'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Upload, Send, BarChart3, Users, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { PostEditor } from '../components/campaign-calendar/PostEditor';
import { ContentUploader } from '../components/campaign-calendar/ContentUploader';

type PlatformId = 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'linkedin';

const PLATFORMS: { id: PlatformId; label: string; color: string }[] = [
  { id: 'instagram', label: 'Instagram', color: 'bg-pink-500' },
  { id: 'tiktok', label: 'TikTok', color: 'bg-black text-white' },
  { id: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
  { id: 'youtube', label: 'YouTube', color: 'bg-red-600' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' }
];

interface MediaItem {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video' | 'other';
  name: string;
  platforms: PlatformId[];
}

interface ScheduledPost {
  id: string;
  mediaId: string;
  date: string; // ISO date yyyy-mm-dd
  platforms: PlatformId[];
  title?: string;
  status: 'scheduled' | 'published' | 'draft';
}

export default function Home() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMediaId, setEditorMediaId] = useState<string | null>(null);
  const [editorMediaUrl, setEditorMediaUrl] = useState<string | null>(null);
  const [editorInitialDates, setEditorInitialDates] = useState<string[] | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropHoverDate, setDropHoverDate] = useState<string | null>(null);

  // --- uploader ---
  const onFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).map((file) => {
      const type = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : 'other';
      return {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        file,
        url: URL.createObjectURL(file),
        type,
        name: file.name,
        platforms: [] as PlatformId[]
      } as MediaItem;
    });
    setMedia((m) => [...arr, ...m]);
  }, []);

  const toggleMediaPlatform = useCallback((mediaId: string, platform: PlatformId) => {
    setMedia((m) =>
      m.map((it) =>
        it.id === mediaId
          ? { ...it, platforms: it.platforms.includes(platform) ? it.platforms.filter((p) => p !== platform) : [...it.platforms, platform] }
          : it
      )
    );
  }, []);

  // --- drag handlers (improved) ---
  const onDragStart = (e: React.DragEvent, mediaId: string) => {
    try {
      e.dataTransfer.setData('text/plain', mediaId);
      e.dataTransfer.effectAllowed = 'copyMove';
      // try to set a drag image if possible
      const img = (e.currentTarget as HTMLElement).querySelector('img') as HTMLImageElement | null;
      if (img) e.dataTransfer.setDragImage(img, 40, 40);
    } catch (err) {
      // ignore
    }
    setDraggingId(mediaId);
  };

  const onDragEnd = (e: React.DragEvent) => {
    setDraggingId(null);
    setDropHoverDate(null);
  };

  // --- calendar helpers ---
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = new Date(year, monthIndex, i + 1);
      const iso = day.toISOString().slice(0, 10);
      return { day, iso };
    });
  }, [year, monthIndex, daysInMonth]);

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleDropToDay = (e: React.DragEvent, isoDate: string) => {
    e.preventDefault();
    const mediaId = e.dataTransfer.getData('text/plain');
    const item = media.find((m) => m.id === mediaId);
    if (!item) {
      setDraggingId(null);
      setDropHoverDate(null);
      return;
    }
    // open PostEditor modal prefilled with this media and the drop date
    setEditorMediaId(item.id);
    setEditorMediaUrl(item.url);
    // store the initial date so editor can prepopulate multiple dates if needed
    setEditorInitialDates([isoDate]);
    setIsEditorOpen(true);
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // visual feedback on calendar cell
  const onCellDragEnter = (e: React.DragEvent, isoDate: string) => {
    e.preventDefault();
    setDropHoverDate(isoDate);
  };
  const onCellDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDropHoverDate(null);
  };

  const removePost = (id: string) => setPosts((p) => p.filter((x) => x.id !== id));
  const removeMedia = (id: string) => {
    setMedia((m) => m.filter((x) => x.id !== id));
    setPosts((p) => p.filter((post) => post.mediaId !== id));
  };

  // handler when PostEditor saves multiple posts
  const handleSaveMultiplePosts = (createdPosts: any[]) => {
    const newScheduled: ScheduledPost[] = createdPosts.map((cp) => ({
      id: cp.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)),
      mediaId: cp.mediaId || editorMediaId || '',
      date: cp.scheduledDate instanceof Date ? cp.scheduledDate.toISOString().slice(0, 10) : (new Date(cp.scheduledDate)).toISOString().slice(0,10),
      platforms: cp.platforms || ['instagram'],
      title: cp.title || '',
      status: cp.status || 'scheduled'
    }));

    setPosts((p) => [...p, ...newScheduled]);
    // close editor and clear
    setIsEditorOpen(false);
    setEditorMediaId(null);
    setEditorMediaUrl(null);
    setEditorInitialDates(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AnueCthing</h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/campaign-calendar" className="text-gray-600 hover:text-blue-600 transition-colors">
                Campaign Calendar
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-blue-600 transition-colors">
                Analytics
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Get Started</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main: uploader + calendar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Uploader */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upload Content</h2>
            <div className="text-sm text-gray-500">Drag media onto calendar to schedule</div>
          </div>

          <div className="flex gap-4 flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <ContentUploader
                selectedPlatforms={PLATFORMS.map(p => p.id)}
                onMediaUpload={(uploaded) => {
                  // map uploaded MediaFile -> MediaItem used in this page
                  const mapped = uploaded.map((u) => ({
                    id: u.id,
                    file: u.file,
                    url: u.url,
                    type: u.type === 'image' ? ('image' as const) : (u.type === 'video' ? ('video' as const) : ('other' as const)),
                    name: u.file.name,
                    platforms: (u.platforms.map((pf) => pf.platform.split('-')[0]) as unknown) as PlatformId[],
                  }));

                  setMedia((m) => [...mapped, ...m]);
                }}
              />
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-12">No media uploaded</div>
              )}

              {media.map((m) => (
                <div
                  key={m.id}
                  // keep wrapper draggable too, but make preview elements draggable as well
                  draggable
                  onDragStart={(e) => onDragStart(e, m.id)}
                  onDragEnd={onDragEnd}
                  className={`bg-gray-50 rounded-lg p-2 border border-gray-200 ${draggingId === m.id ? 'opacity-70 cursor-grabbing' : 'cursor-grab'}`}
                >
                  <div className="aspect-video rounded overflow-hidden bg-black/5">
                    {m.type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt={m.name}
                        className="w-full h-full object-cover"
                        draggable
                        onDragStart={(e) => onDragStart(e, m.id)}
                        onDragEnd={onDragEnd}
                      />
                    ) : m.type === 'video' ? (
                      <video
                        src={m.url}
                        className="w-full h-full object-cover"
                        muted
                        draggable
                        onDragStart={(e) => onDragStart(e, m.id)}
                        onDragEnd={onDragEnd}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-gray-600">Preview not available</div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-gray-700 truncate">{m.name}</div>
                    <button onClick={() => removeMedia(m.id)} className="text-xs text-red-500 ml-2">Remove</button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => toggleMediaPlatform(m.id, p.id)}
                        className={`text-xs px-2 py-1 rounded-full border ${m.platforms.includes(p.id) ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}
                        title={`Toggle ${p.label}`}
                      >
                        {p.label.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">Drag me to a day to schedule</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calendar */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendar — {format(currentMonth, 'MMMM yyyy')}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="px-3 py-1 rounded bg-gray-100">Prev</button>
              <button onClick={nextMonth} className="px-3 py-1 rounded bg-gray-100">Next</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center font-medium text-gray-600">{d}</div>
            ))}

            {daysArray.map(({ day, iso }) => {
              const dayPosts = posts.filter((p) => p.date === iso);
              const isHover = dropHoverDate === iso;
              return (
                <div
                  key={iso}
                  onDragOver={allowDrop}
                  onDragEnter={(e) => onCellDragEnter(e, iso)}
                  onDragLeave={onCellDragLeave}
                  onDrop={(e) => handleDropToDay(e, iso)}
                  className={`min-h-[120px] p-2 border border-gray-200 rounded bg-white ${isHover ? 'ring-2 ring-blue-300' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium">{day.getDate()}</div>
                    <div className="text-xs text-gray-400">{format(day, 'MMM d, yyyy')}</div>
                  </div>

                  <div className="space-y-2">
                    {dayPosts.length === 0 && <div className="text-xs text-gray-300">Drop media here</div>}
                    {dayPosts.map((p) => {
                      const m = media.find((mm) => mm.id === p.mediaId);
                      return (
                        <div key={p.id} className="bg-gray-50 rounded p-2 border border-gray-100 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="truncate pr-2">{p.title}</div>
                            <button onClick={() => removePost(p.id)} className="text-red-500 text-xxs ml-2">X</button>
                          </div>
                          <div className="mt-1 flex gap-1 flex-wrap">
                            {(p.platforms || []).map((pl) => (
                              <span key={pl} className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px]">{pl}</span>
                            ))}
                            {m && (
                              <div className="ml-auto text-[11px] text-gray-500">
                                {m.type}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Small analytics / counts */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded p-4 text-center">
            <div className="text-sm text-gray-500">Uploaded</div>
            <div className="text-2xl font-semibold">{media.length}</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="text-sm text-gray-500">Scheduled</div>
            <div className="text-2xl font-semibold">{posts.length}</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="text-sm text-gray-500">Platforms used</div>
            <div className="text-2xl font-semibold">
              {Array.from(new Set(media.flatMap((m) => m.platforms))).length}
            </div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="text-sm text-gray-500">Drafts</div>
            <div className="text-2xl font-semibold">{posts.filter((p) => p.status === 'draft').length}</div>
          </div>
        </section>
      </main>

      {/* render PostEditor modal */}
      <PostEditor
        isOpen={isEditorOpen}
        onClose={() => { setIsEditorOpen(false); setEditorMediaId(null); setEditorMediaUrl(null); setEditorInitialDates(undefined); }}
        onSave={() => { /* fallback single save not used */ }}
        onSaveMultiple={handleSaveMultiplePosts}
        mediaId={editorMediaId || undefined}
        mediaUrl={editorMediaUrl || undefined}
        initialDates={editorInitialDates}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">AnueCthing</h4>
              </div>
              <p className="text-gray-400 mb-4">
                Social media marketing tools designed for small teams who need enterprise features without the enterprise price.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/campaign-calendar" className="hover:text-white transition-colors">Campaign Calendar</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AnueCthing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

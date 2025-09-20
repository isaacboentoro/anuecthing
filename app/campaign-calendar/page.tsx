"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { parse, parseISO, isValid, isSameDay, format as formatDate } from 'date-fns';
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
      scheduledDate: new Date(2025, 8, 23, 10, 10),
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Behind the Scenes',
      content: 'Take a look behind the scenes of our creative process! ✨',
      platforms: ['instagram', 'tiktok'],
      scheduledDate: new Date(2025, 8, 25, 10, 10),
      status: 'draft'
    },
    {
      id: '3',
      title: 'Customer Testimonial',
      content: '“This product changed our workflow!” — Happy Customer',
      platforms: ['linkedin'],
      scheduledDate: new Date(2025, 8, 23, 9, 0),
      status: 'scheduled'
    },
    {
      id: '4',
      title: 'IG Reel: Feature Highlight',
      content: 'Quick reel showcasing top features.',
      platforms: ['instagram', 'tiktok'],
      scheduledDate: new Date(2025, 8, 23, 12, 30),
      status: 'draft'
    },
    {
      id: '5',
      title: 'Facebook Post: Promo',
      content: 'Limited-time promo — don’t miss out!',
      platforms: ['facebook'],
      scheduledDate: new Date(2025, 8, 23, 17, 45),
      status: 'scheduled'
    },
    {
      id: '6',
      title: 'Tips & Tricks Thread',
      content: '5 tips to get more from Marketinc.',
      platforms: ['twitter' as any, 'linkedin'], // if twitter not used, it will just render as a tag
      scheduledDate: new Date(2025, 8, 15, 8, 0),
      status: 'published'
    },
    {
      id: '7',
      title: 'YouTube Tutorial',
      content: 'Deep-dive tutorial on scheduling.',
      platforms: ['youtube'],
      scheduledDate: new Date(2025, 8, 10, 14, 0),
      status: 'scheduled'
    },
    {
      id: '8',
      title: 'Weekend Wrap-up',
      content: 'This week in product updates.',
      platforms: ['linkedin', 'facebook'],
      scheduledDate: new Date(2025, 8, 28, 11, 0),
      status: 'draft'
    },
    {
      id: '9',
      title: 'Month Kickoff',
      content: 'September goals and roadmap.',
      platforms: ['instagram'],
      scheduledDate: new Date(2025, 8, 1, 9, 30),
      status: 'published'
    },
    {
      id: '10',
      title: 'Q&A Live Session',
      content: 'Join us live to ask anything!',
      platforms: ['youtube', 'instagram'],
      scheduledDate: new Date(2025, 8, 25, 16, 0),
      status: 'scheduled'
    },
    {
      id: '11',
      title: 'Monthly Recap',
      content: 'Highlights from September.',
      platforms: ['facebook', 'linkedin'],
      scheduledDate: new Date(2025, 8, 30, 18, 0),
      status: 'draft'
    },
    {
      id: '12',
      title: 'Feature Sneak Peek',
      content: 'A sneak peek of what’s coming next week.',
      platforms: ['instagram', 'facebook'],
      scheduledDate: new Date(2025, 8, 18, 10, 0),
      status: 'scheduled'
    },
    {
      id: '13',
      title: 'Case Study Drop',
      content: 'How Acme scaled content with Marketinc.',
      platforms: ['linkedin'],
      scheduledDate: new Date(2025, 8, 18, 15, 0),
      status: 'scheduled'
    },
  ]);

  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Command palette state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchMounted, setSearchMounted] = useState(false);
  const [searchAnimateIn, setSearchAnimateIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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

  // Open with Alt+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if ((e.key === 'Escape' || e.key === 'Esc') && searchOpen) {
        e.preventDefault();
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  // Mount/animate sequence for palette (same pattern as modals)
  useEffect(() => {
    let t: number | undefined;
    if (searchOpen) {
      setSearchAnimateIn(false);
      setSearchMounted(true);
      t = window.setTimeout(() => {
        setSearchAnimateIn(true);
        // focus input after animation starts
        searchInputRef.current?.focus();
      }, 10);
    } else {
      setSearchAnimateIn(false);
      t = window.setTimeout(() => setSearchMounted(false), 200);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [searchOpen]);

  // Allow NavBar button to open the command palette via global helper or custom event
  useEffect(() => {
    const openPaletteEventHandler = () => setSearchOpen(true);
    document.addEventListener('marketinc:openCommandPalette' as any, openPaletteEventHandler as any);

    // expose a global function for convenience: window.marketincOpenCommandPalette()
    (window as any).marketincOpenCommandPalette = () => {
      document.dispatchEvent(new Event('marketinc:openCommandPalette'));
    };

    return () => {
      document.removeEventListener('marketinc:openCommandPalette' as any, openPaletteEventHandler as any);
      delete (window as any).marketincOpenCommandPalette;
    };
  }, []);

  // platform normalization (aliases -> canonical)
  const platformAliases = useMemo<Record<string, string>>(
    () => ({
      ig: 'instagram',
      insta: 'instagram',
      fb: 'facebook',
      yt: 'youtube',
      li: 'linkedin',
      'linked-in': 'linkedin',
    }),
    []
  );
  const knownPlatforms = useMemo(
    () => new Set(['instagram', 'tiktok', 'facebook', 'youtube', 'linkedin']),
    []
  );
  const canonicalizePlatform = useCallback(
    (t: string): string | undefined => {
      const tok = t.toLowerCase();
      if (knownPlatforms.has(tok)) return tok;
      const alias = platformAliases[tok];
      return alias && knownPlatforms.has(alias) ? alias : undefined;
    },
    [knownPlatforms, platformAliases]
  );

  // Parse date from entire query, any token, or adjacent token pairs like "Sep 21"
  const tryParseDate = useCallback((q: string, tokens?: string[]): Date | undefined => {
    const s = q.trim();
    const candidates: string[] = [];
    if (s) candidates.push(s);
    const toks = (tokens ?? s.split(/\s+/)).filter(Boolean);
    // single-token candidates
    candidates.push(...toks);
    // adjacent pairs like "Sep 21" or "September 21"
    for (let i = 0; i < toks.length - 1; i++) {
      candidates.push(`${toks[i]} ${toks[i + 1]}`);
    }

    for (const c of candidates) {
      // ISO like 2025-09-21
      if (/^\d{4}-\d{2}-\d{2}$/.test(c)) {
        const d = parseISO(c);
        if (isValid(d)) return d;
      }
      const fmts = ['MMM d, yyyy', 'MMM d', 'MMMM d, yyyy', 'MMMM d', 'M/d/yyyy', 'd/M/yyyy'];
      for (const fmt of fmts) {
        const d = parse(c, fmt, new Date());
        if (isValid(d)) return d;
      }
    }
    return undefined;
  }, []);

  const searchFilters = useMemo(() => {
    const raw = searchQuery.trim();
    const q = raw.toLowerCase();
    const tokensRaw = raw.split(/\s+/).filter(Boolean);
    const tokens = tokensRaw.map((t) => t.toLowerCase());
    // detect platforms in query (lowercased)
    const matchedPlatformList = tokens
      .map((t) => canonicalizePlatform(t))
      .filter((v): v is string => !!v);
    const matchedPlatforms = new Set(matchedPlatformList);
    // tokens that are not platforms are treated as text filters (lowercased)
    const nonPlatformTokens = tokens.filter((t) => !canonicalizePlatform(t));
    // parse date from original (non-lowercased) tokens or full query
    const matchedDate = tryParseDate(raw, tokensRaw);

    const postsFiltered = posts.filter((p) => {
      const lcTitle = p.title.toLowerCase();
      const lcContent = p.content.toLowerCase();
      const wantsPlatform = matchedPlatforms.size > 0;
      const wantsDate = !!matchedDate;
      const wantsText = nonPlatformTokens.length > 0;

      const platformOK =
        !wantsPlatform ||
        p.platforms.some((pl) => matchedPlatforms.has(pl.toLowerCase()));

      const dateOK =
        !wantsDate || (matchedDate ? isSameDay(p.scheduledDate, matchedDate) : true);

      const textOK =
        !wantsText ||
        nonPlatformTokens.every(
          (tok) => lcTitle.includes(tok) || lcContent.includes(tok)
        );

      return platformOK && dateOK && textOK;
    });

    // Sort by upcoming first
    postsFiltered.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

    return { postsFiltered, matchedDate };
  }, [posts, searchQuery, canonicalizePlatform, tryParseDate]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);

  // Derived lists
  const scheduledPosts = useMemo(() => posts.filter(p => p.status === 'scheduled'), [posts]);
  const publishedPosts = useMemo(() => posts.filter(p => p.status === 'published'), [posts]);
  const draftPosts = useMemo(() => posts.filter(p => p.status === 'draft'), [posts]);

  // Reusable section card
  const SectionCard: React.FC<{
    title: string;
    count: number;
    countClass?: string;
    items?: Post[];
    onDelete?: (id: string) => void;
    emptyText?: string;
  }> = ({ title, count, countClass = 'text-gray-900', items, onDelete, emptyText }) => (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-semibold ${countClass}`}>{count}</p>
      </div>
      {items && (
        <div className="mt-4 space-y-2 overflow-y-auto max-h-48 pr-1">
          {items.length > 0 ? (
            items.map(post => (
              <div key={post.id} className="flex items-center justify-between text-sm bg-gray-50 rounded px-2 py-1">
                <span className="truncate text-gray-800">{post.title}</span>
                {onDelete ? (
                  <button
                    className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    onClick={() => typeof post.id === 'string' && onDelete(post.id)}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">{emptyText ?? 'Nothing here yet.'}</div>
          )}
        </div>
      )}
    </div>
  );

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
            <p className="text-xs text-gray-400 mt-1">Tip: Press Alt+K to search posts, dates, or platforms</p>
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

             {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
               <BarChart3 size={16} />
               Analytics
             </button>
             
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
               <Settings size={16} />
               Settings
             </button> */}
           </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total posts summary (no list) */}
          <SectionCard title="Total Posts" count={posts.length} />

          {/* Scheduled with list + delete */}
          <SectionCard
            title="Scheduled"
            count={scheduledPosts.length}
            countClass="text-blue-600"
            items={scheduledPosts}
            onDelete={handleDeleteScheduledPost}
            emptyText="No scheduled posts."
          />

          {/* Published summary (no delete) */}
          <SectionCard
            title="Published"
            count={publishedPosts.length}
            countClass="text-green-600"
            items={[]} // no list needed; pass empty to skip list rendering
          />

          {/* Drafts with list + delete */}
          <SectionCard
            title="Drafts"
            count={draftPosts.length}
            countClass="text-gray-600"
            items={draftPosts}
            onDelete={handleDeleteDraftPost}
            emptyText="No drafts."
          />
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

        {/* Command Palette (Alt+K) */}
        {searchMounted && (
          <div
            className={`fixed inset-0 z-[60] p-4 flex items-center justify-center transition-opacity duration-200 ${
              searchAnimateIn ? 'opacity-100' : 'opacity-0'
            } backdrop-blur-sm bg-black/40`}
            aria-hidden={!searchAnimateIn}
            onClick={closeSearch}
          >
            <div
              className={`bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col mx-auto transform transition-all duration-200 ${
                searchAnimateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              {/* Input */}
              <div className="p-3 border-b">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, dates (e.g., 2025-09-21 or Sep 21), or platforms (instagram, tiktok, ...)"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              {/* Results */}
              <div className="p-3 overflow-y-auto min-h-0">
                <div className="space-y-4">
                  {/* Date match */}
                  {searchFilters.matchedDate && (
                    <div>
                      <div className="text-xs font-semibold text-gray-500 px-1 mb-2">Date</div>
                      <button
                        className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50"
                        onClick={() => {
                          handleCreatePost(searchFilters.matchedDate as Date);
                          closeSearch();
                        }}
                      >
                        Create post on {formatDate(searchFilters.matchedDate, 'EEE, MMM d, yyyy')}
                      </button>
                    </div>
                  )}
                  {/* Posts */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 px-1 mb-2">
                      Posts {searchQuery ? `(matching "${searchQuery}")` : ''}
                    </div>
                    <div className="space-y-2">
                      {searchFilters.postsFiltered.map((p) => (
                        <button
                          key={p.id ?? p.title}
                          className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50"
                          onClick={() => {
                            handleEditPost(p);
                            closeSearch();
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-800">{p.title}</div>
                            <div className="text-xs text-gray-500">
                              {formatDate(p.scheduledDate, 'MMM d, yyyy')}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {p.platforms.join(', ')} • {p.status}
                          </div>
                        </button>
                      ))}
                      {searchFilters.postsFiltered.length === 0 && (
                        <div className="text-sm text-gray-500 px-1">No matching posts.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Footer hint */}
              <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-500">
                Press Esc to close • Alt+K to open
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
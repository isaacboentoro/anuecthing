'use client';

import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import type { Post } from './types';

interface CalendarViewProps {
  posts: Post[];
  onPostMove: (postId: string, newDate: Date) => void;
  onCreatePost: (date: Date) => void;
  onEditPost?: (post: Post) => void; // <-- add this prop
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'post',
    item: { id: post.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      className={`bg-white rounded-lg p-2 mb-2 shadow-sm border border-gray-200 cursor-move text-xs ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="font-medium text-gray-800 truncate">{post.title}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {post.platforms.map((platform) => (
          <span
            key={platform}
            className="px-1 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
          >
            {platform}
          </span>
        ))}
      </div>
      <div className={`mt-1 text-xs font-medium ${
        post.status === 'published' ? 'text-green-600' : 
        post.status === 'scheduled' ? 'text-blue-600' : 'text-gray-500'
      }`}>
        {post.status}
      </div>
    </div>
  );
};

const CalendarDay: React.FC<{
  date: Date;
  posts: Post[];
  isCurrentMonth: boolean;
  onPostMove: (postId: string, newDate: Date) => void;
  onCreatePost: (date: Date) => void;
  onEditPost?: (post: Post) => void;
  onOpenDay?: (date: Date) => void;
}> = ({ date, posts, isCurrentMonth, onPostMove, onCreatePost, onEditPost, onOpenDay }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'post',
    drop: (item: { id: string }) => {
      onPostMove(item.id, date);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const dayPosts = posts.filter(post => isSameDay(post.scheduledDate, date));
  const today = startOfDay(new Date());
  const isPast = isBefore(startOfDay(date), today);
  const isToday = isSameDay(date, today);

  return (
    <div
      ref={drop as any}
      onDoubleClick={() => onOpenDay?.(date)}
      // use an inset ring and bring the cell above neighbors so the highlight isn't clipped/overlapped
      className={`min-h-[120px] p-2 border border-gray-200 ${
        !isCurrentMonth ? 'bg-gray-50 text-gray-400' : isPast ? 'bg-gray-100 text-gray-400' : 'bg-white'
      } ${isOver ? 'bg-blue-50' : ''} ${isToday ? 'ring-inset ring-2 ring-blue-400 bg-blue-50 relative z-10' : ''}`}
      aria-current={isToday ? 'date' : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-sm ${isToday ? 'font-semibold text-blue-700' : 'font-medium'}`}>{format(date, 'd')}</span>
        <button
          onClick={() => !isPast && onCreatePost(date)}
          className={`text-gray-400 hover:text-blue-600 transition-colors ${isPast ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
          disabled={isPast}
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="space-y-1">
        {dayPosts.map((post) => (
          <div key={post.id} className="flex flex-wrap gap-1">
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                onEditPost?.(post);
              }}
            >
              <PostCard post={post} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onPostMove,
  onCreatePost,
  onEditPost,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const reduceMotion = useReducedMotion();
  const [dayModalDate, setDayModalDate] = useState<Date | null>(null);
  const [dayModalMounted, setDayModalMounted] = useState<boolean>(false);
  const [dayModalAnimateIn, setDayModalAnimateIn] = useState<boolean>(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Crossfade + subtle scale + vertical offset variants (different animation type)
  const variants = {
    enter: (_dir: 'next' | 'prev') => ({
      y: reduceMotion ? 0 : 10,
      scale: reduceMotion ? 1 : 0.98,
      opacity: 0,
    }),
    center: { y: 0, scale: 1, opacity: 1 },
    exit: (_dir: 'next' | 'prev') => ({
      y: reduceMotion ? 0 : -10,
      scale: reduceMotion ? 1 : 0.98,
      opacity: 0,
    }),
  };
  
  const titleVariants = {
    enter: { y: reduceMotion ? 0 : 6, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: reduceMotion ? 0 : -6, opacity: 0 },
  };

  const navigateMonth = useCallback((dir: 'prev' | 'next') => {
    setDirection(dir === 'prev' ? 'prev' : 'next');
    setCurrentDate(prev => (dir === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)));
  }, []);

  const openDayModal = (date: Date) => setDayModalDate(date);
  const closeDayModal = () => setDayModalDate(null);

  // mount/animate effect for the day modal (match PostEditor behavior)
  React.useEffect(() => {
    let t: number | undefined;
    if (dayModalDate) {
      setDayModalAnimateIn(false);
      setDayModalMounted(true);
      t = window.setTimeout(() => setDayModalAnimateIn(true), 10);
    } else {
      setDayModalAnimateIn(false);
      t = window.setTimeout(() => setDayModalMounted(false), 200);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [dayModalDate]);

  // Close day modal on Escape
  React.useEffect(() => {
    if (!dayModalMounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeDayModal();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dayModalMounted]);

  return (
    <DndProvider backend={HTML5Backend}>
     <div className="bg-white rounded-lg shadow-lg p-6">
       <div className="flex items-center justify-between mb-6">
         <div>
           <AnimatePresence mode="wait" initial={false}>
             <motion.h2
               key={format(currentDate, 'yyyy-MM')}
               variants={titleVariants}
               initial="enter"
               animate="center"
               exit="exit"
               transition={{ duration: reduceMotion ? 0 : 0.22 }}
               className="text-2xl font-bold text-gray-800"
             >
               {format(currentDate, 'MMMM yyyy')}
             </motion.h2>
           </AnimatePresence>
         </div>
         <div className="flex gap-2">
           <button
             onClick={() => navigateMonth('prev')}
             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
           >
             <ChevronLeft size={20} />
           </button>
           <button
             onClick={() => navigateMonth('next')}
             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
           >
             <ChevronRight size={20} />
           </button>
         </div>
       </div>

      <AnimatePresence initial={false} custom={direction} mode="wait">
         <div className="border border-gray-200 rounded-lg overflow-hidden">
          <motion.div
            key={format(monthStart, 'yyyy-MM')}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
            className="grid grid-cols-7 gap-0 max-h-[70vh] overflow-y-auto"
            style={{ minHeight: 320 }} // keeps layout stable during animation
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-gray-50 p-3 text-center font-medium text-gray-700 border-b border-gray-200 sticky top-0 z-10"
              >
                {day}
              </div>
            ))}
            
            {calendarDays.map((date) => (
              <CalendarDay
                key={date.toISOString()}
                date={date}
                posts={posts}
                isCurrentMonth={isSameMonth(date, currentDate)}
                onPostMove={onPostMove}
                onCreatePost={onCreatePost}
                onEditPost={onEditPost}
                onOpenDay={openDayModal}
              />
            ))}
          </motion.div>
         </div>
       </AnimatePresence>
       {/* Day modal: show all posts for a day (uses same animation classes as PostEditor) */}
       {dayModalMounted && (
         <div
           className={`fixed inset-0 z-50 p-4 flex items-center justify-center overflow-hidden transition-opacity duration-200 ${dayModalAnimateIn ? 'opacity-100' : 'opacity-0'} backdrop-blur-sm bg-black/40`}
           aria-hidden={!dayModalAnimateIn}
         >
           <div className={`bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col mx-auto transform transition-all duration-200 ${dayModalAnimateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
             <div className="flex items-center justify-between p-4 border-b">
               <div>
                 <div className="text-lg font-semibold">Posts on {format(dayModalDate ?? new Date(), 'MMM d, yyyy')}</div>
                 <div className="text-sm text-gray-500">{posts.filter(p => dayModalDate && isSameDay(p.scheduledDate, dayModalDate)).length} item(s)</div>
               </div>
               <div className="flex items-center gap-2">
                 <button
                   onClick={() => {
                     if (dayModalDate) {
                       onCreatePost(dayModalDate);
                     }
                     closeDayModal();
                   }}
                   className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                 >
                   Create Post
                 </button>
                 <button onClick={closeDayModal} className="text-gray-500 p-2 rounded hover:bg-gray-100">
                   <X size={18} />
                 </button>
               </div>
             </div>

             <div className="p-4 overflow-y-auto min-h-0 flex-1">
               <div className="space-y-3">
                 {posts.filter(p => dayModalDate && isSameDay(p.scheduledDate, dayModalDate)).map((p) => (
                   <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                     <div>
                       <div className="font-medium text-gray-800">{p.title}</div>
                       <div className="text-xs text-gray-500 mt-1">
                         {p.platforms.join(', ')} • {p.status}
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => {
                           onEditPost?.(p);
                           closeDayModal();
                         }}
                         className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 text-sm"
                       >
                         Edit
                       </button>
                     </div>
                   </div>
                 ))}
                 {posts.filter(p => dayModalDate && isSameDay(p.scheduledDate, dayModalDate)).length === 0 && (
                   <div className="text-sm text-gray-500">No posts for this day.</div>
                 )}
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   </DndProvider>
   );
 };

import React, { useState, useEffect, useMemo } from 'react';
import { Notice, ExaminationRecord, ExaminationNotice } from '../types';
import { resultService } from '../services/resultStorage';
import { storageService } from '../services/storage';
import {
  Bell,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Pause,
  Play,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';

export interface NewsTickerItem {
  id: string;
  type: 'RESULT_PUBLISHED' | 'EXAM_NOTICE' | 'INSTITUTIONAL_NOTICE';
  tag: string;
  tagColor: string;
  title: string;
  subtitle?: string;
  date?: string;
  link: string;
  isUrgent?: boolean;
  isNew?: boolean;
  isResult?: boolean;
}

export interface NewsTickerProps {
  notices?: Notice[];
  onNavigate?: (path: string) => void;
  className?: string;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({
  notices: propNotices,
  onNavigate,
  className = '',
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [examinations, setExaminations] = useState<ExaminationRecord[]>([]);
  const [examNotices, setExamNotices] = useState<ExaminationNotice[]>([]);
  const [localNotices, setLocalNotices] = useState<Notice[]>(propNotices || []);

  // Fetch examination updates and institutional notices
  const fetchTickerData = () => {
    try {
      resultService.init();
      const allExams = resultService.getExaminations();
      const allExamNotices = resultService.getNotices();
      setExaminations(allExams);
      setExamNotices(allExamNotices);

      if (!propNotices || propNotices.length === 0) {
        const instNotices = storageService.getNotices();
        setLocalNotices(instNotices);
      } else {
        setLocalNotices(propNotices);
      }
    } catch {
      // Fallback gracefully
    }
  };

  useEffect(() => {
    fetchTickerData();

    // Listen to storage events & periodic check for newly published results
    const handleStorageChange = () => {
      fetchTickerData();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(fetchTickerData, 10000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [propNotices]);

  // Build unified ticker items list
  const tickerItems = useMemo<NewsTickerItem[]>(() => {
    const items: NewsTickerItem[] = [];

    // 1. Examination Result Publication Updates (Published Exams)
    const publishedExams = examinations.filter(
      (e) => e.publicationStatus === 'published'
    );

    publishedExams.forEach((exam) => {
      const pubDate = exam.publishedAt
        ? new Date(exam.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Active';

      const classesText = exam.classes && exam.classes.length > 0
        ? exam.classes.join(', ')
        : 'All Streams';

      items.push({
        id: `exam-pub-${exam.id}`,
        type: 'RESULT_PUBLISHED',
        tag: 'RESULT OUT',
        tagColor: 'bg-emerald-600 text-white ring-1 ring-emerald-400/50',
        title: `${exam.examinationName} (${exam.academicYear}) Results Published!`,
        subtitle: `Classes: ${classesText} • Click to verify marksheet`,
        date: pubDate,
        link: '/results',
        isResult: true,
        isNew: true,
      });
    });

    // 2. Examination Result Notices (from examination board / resultService)
    examNotices.forEach((n) => {
      const isResult = n.category === 'Result' || n.category === 'Re-evaluation';
      items.push({
        id: `exam-notice-${n.id}`,
        type: 'EXAM_NOTICE',
        tag: isResult ? 'EXAM RESULT' : 'EXAM UPDATE',
        tagColor: isResult
          ? 'bg-amber-600 text-white ring-1 ring-amber-400/40'
          : 'bg-indigo-600 text-white ring-1 ring-indigo-400/40',
        title: n.title,
        subtitle: n.description,
        date: n.date,
        link: '/results',
        isUrgent: n.isImportant,
        isResult,
      });
    });

    // 3. Institutional Notices
    const activeInstNotices = localNotices.filter(
      (n) => n.status === 'published' || n.isImportant || n.isNew
    );

    activeInstNotices.forEach((n) => {
      items.push({
        id: `inst-notice-${n.id}`,
        type: 'INSTITUTIONAL_NOTICE',
        tag: n.isImportant ? 'URGENT' : n.isNew ? 'NEW' : 'NOTICE',
        tagColor: n.isImportant
          ? 'bg-rose-600 text-white animate-pulse'
          : n.isNew
          ? 'bg-amber-500 text-slate-950 font-bold'
          : 'bg-slate-700 text-slate-200',
        title: n.title,
        date: n.noticeDate,
        link: '/notice',
        isUrgent: n.isImportant,
        isNew: n.isNew,
      });
    });

    // If empty fallback
    if (items.length === 0) {
      items.push({
        id: 'fallback-1',
        type: 'RESULT_PUBLISHED',
        tag: 'ONLINE PORTAL',
        tagColor: 'bg-amber-600 text-white',
        title: 'Academic Session 2025-2026 Examination & Institutional Notice Portal is Live',
        subtitle: 'Search individual student marksheets and verify online credentials',
        link: '/results',
        isResult: true,
      });
    }

    return items;
  }, [examinations, examNotices, localNotices]);

  const handleItemClick = (item: NewsTickerItem) => {
    if (onNavigate) {
      onNavigate(item.link);
    }
  };

  return (
    <div
      className={`w-full bg-slate-900 border-b border-amber-500/30 text-white overflow-hidden py-2 px-3 sm:px-4 shadow-md select-none relative z-30 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Latest examination results and institutional announcements ticker"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
        {/* Ticker Badge with Live Blinking Beacon */}
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] sm:text-[11px] uppercase tracking-wider shrink-0 shadow-sm border border-amber-400/40">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
          <span className="font-heading font-black whitespace-nowrap">
            UPDATES & RESULTS
          </span>
        </div>

        {/* Ticker Content Reel */}
        <div className="relative flex-1 overflow-hidden h-6 sm:h-7 flex items-center">
          <div
            className={`flex items-center gap-8 sm:gap-10 whitespace-nowrap transition-transform ${
              isPaused ? '' : 'animate-[ticker_40s_linear_infinite]'
            }`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {/* Duplicated list for infinite seamless marquee */}
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleItemClick(item)}
                className="inline-flex items-center gap-2 text-xs text-slate-200 hover:text-amber-300 cursor-pointer transition-colors group shrink-0"
                title={`${item.title} ${item.subtitle ? `— ${item.subtitle}` : ''} (Click to open)`}
              >
                {/* Visual Category / Status Pill */}
                <span
                  className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-xs ${item.tagColor}`}
                >
                  {item.isResult ? (
                    <GraduationCap className="w-3 h-3" />
                  ) : item.isUrgent ? (
                    <AlertCircle className="w-3 h-3" />
                  ) : item.isNew ? (
                    <Sparkles className="w-3 h-3" />
                  ) : (
                    <Bell className="w-2.5 h-2.5" />
                  )}
                  <span>{item.tag}</span>
                </span>

                {/* Title */}
                <span className="font-semibold text-slate-100 group-hover:underline flex items-center gap-1 text-[11px] sm:text-xs">
                  {item.title}
                </span>

                {/* Subtitle / Classes if available */}
                {item.subtitle && (
                  <span className="hidden md:inline text-[11px] text-amber-200/80 font-normal">
                    [{item.subtitle}]
                  </span>
                )}

                {/* Date Tag */}
                {item.date && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({item.date})
                  </span>
                )}

                {/* Action arrow indicator on hover */}
                <ArrowRight className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />

                {/* Separator Dot */}
                <span className="text-amber-500/50 font-bold mx-1 sm:mx-2">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Navigation Buttons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-1">
          {/* Direct Results Link */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('/results')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-[10px] sm:text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
              title="Search and verify Student Results online"
            >
              <FileSpreadsheet className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Check Results</span>
              <span className="sm:hidden">Results</span>
            </button>
          )}

          {/* Pause / Play Toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? (
              <Play className="w-3 h-3 text-amber-400" />
            ) : (
              <Pause className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

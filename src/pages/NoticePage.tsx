import React, { useState, useMemo } from 'react';
import { Notice, Wing, NoticeCategory } from '../types';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Building2,
  AlertCircle,
  X,
  FileDown,
  Sparkles,
} from 'lucide-react';

interface NoticePageProps {
  notices: Notice[];
  wings: Wing[];
}

export const NoticePage: React.FC<NoticePageProps> = ({ notices, wings }) => {
  const [search, setSearch] = useState('');
  const [selectedWing, setSelectedWing] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [filterImportant, setFilterImportant] = useState<boolean>(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Extract distinct years from notices
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    notices.forEach((n) => {
      if (n.noticeDate) {
        years.add(n.noticeDate.substring(0, 4));
      }
    });
    return Array.from(years).sort().reverse();
  }, [notices]);

  const categories: NoticeCategory[] = [
    'Academic',
    'Admission',
    'Examination',
    'General',
    'Recruitment',
    'Tender',
  ];

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      // Must be published
      if (n.status !== 'published') return false;

      // Filter by wing
      if (selectedWing !== 'all') {
        if (n.wingId !== selectedWing && n.wingId !== 'all') return false;
      }

      // Filter by category
      if (selectedCategory !== 'all' && n.category !== selectedCategory) {
        return false;
      }

      // Filter by year
      if (selectedYear !== 'all') {
        if (!n.noticeDate.startsWith(selectedYear)) return false;
      }

      // Filter by important
      if (filterImportant && !n.isImportant) {
        return false;
      }

      // Filter by search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesDesc = n.shortDescription.toLowerCase().includes(q);
        const matchesContent = n.fullContent.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesContent) return false;
      }

      return true;
    });
  }, [notices, selectedWing, selectedCategory, selectedYear, filterImportant, search]);

  const getWingName = (wingId: string) => {
    if (wingId === 'all') return 'All Institutions / Central Trust';
    const found = wings.find((w) => w.id === wingId || w.slug === wingId);
    return found ? found.shortName : wingId;
  };

  const handleDownload = (n: Notice) => {
    if (!n.attachmentUrl) {
      // Generate text blob for download
      const content = `VISHWA VINAYAK TRUST GROUP OF INSTITUTIONS\n\nTitle: ${n.title}\nDate: ${n.noticeDate}\nCategory: ${n.category}\nWing: ${getWingName(n.wingId)}\n\n${n.fullContent}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${n.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const a = document.createElement('a');
    a.href = n.attachmentUrl;
    a.download = n.attachmentName || 'Notice_Attachment.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-100 px-3.5 py-1 rounded-full">
            Official Circulars & Notifications
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            NOTICE BOARD
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            Stay updated with official academic schedules, examination notifications, admission forms,
            recruitment drives, and administrative announcements across all trust wings.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notices by keyword, examination, admission..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
              />
            </div>

            {/* Quick Important Toggle */}
            <button
              onClick={() => setFilterImportant(!filterImportant)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all w-full md:w-auto justify-center ${
                filterImportant
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Important Notices Only</span>
            </button>
          </div>

          {/* Secondary Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
            {/* Wing Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Filter By Wing
              </label>
              <select
                value={selectedWing}
                onChange={(e) => setSelectedWing(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none"
              >
                <option value="all">All Wings / Central</option>
                {wings.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.shortName} - {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none"
              >
                <option value="all">All Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedWing('all');
                  setSelectedCategory('all');
                  setSelectedYear('all');
                  setFilterImportant(false);
                }}
                className="cursor-pointer w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors text-center"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Notices Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing {filteredNotices.length} notifications</span>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/90 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left Notice Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {notice.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {getWingName(notice.wingId)}
                    </span>
                    {notice.isImportant && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse">
                        Important
                      </span>
                    )}
                    {notice.isNew && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                        New
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{notice.noticeDate}</span>
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedNotice(notice)}
                    className="cursor-pointer font-heading text-base sm:text-lg font-bold text-slate-900 hover:text-amber-800 transition-colors leading-snug"
                  >
                    {notice.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                    {notice.shortDescription}
                  </p>
                </div>

                {/* Right Action Buttons */}
                <div className="shrink-0 flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>View Notice</span>
                  </button>

                  <button
                    onClick={() => handleDownload(notice)}
                    className="cursor-pointer px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200 space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-base font-bold text-slate-700">No notices found</p>
              <p className="text-xs text-slate-400">
                Try modifying your search or clearing the category and wing filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                    {selectedNotice.category}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Published: {selectedNotice.noticeDate}
                  </span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white leading-tight">
                  {selectedNotice.title}
                </h3>
                <p className="text-xs text-amber-300">
                  Target Wing: {getWingName(selectedNotice.wingId)}
                </p>
              </div>

              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {selectedNotice.shortDescription}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Full Announcement
                </h4>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                  {selectedNotice.fullContent}
                </div>
              </div>

              {/* Attachment Box */}
              {selectedNotice.attachmentUrl ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-100 text-red-700">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {selectedNotice.attachmentName || 'Official_Document.pdf'}
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {selectedNotice.attachmentSize || 'Document file'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(selectedNotice)}
                    className="cursor-pointer px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ) : null}

              {selectedNotice.createdBy && (
                <div className="text-right text-xs text-slate-500 pt-2 border-t border-slate-100">
                  Issued By: <strong className="text-slate-800">{selectedNotice.createdBy}</strong>
                  <br />
                  Vishwa Vinayak Trust Administrative Office
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="cursor-pointer px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

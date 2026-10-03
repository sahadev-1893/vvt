import React, { useState, useMemo } from 'react';
import { Wing, Notice, EventItem, GalleryAlbum } from '../types';
import { Search, X, FileText, Calendar, GraduationCap, Image, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  wings: Wing[];
  notices: Notice[];
  events: EventItem[];
  albums: GalleryAlbum[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  wings,
  notices,
  events,
  albums,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { wings: [], notices: [], events: [], albums: [] };

    const matchedWings = wings.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.shortName.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.courses.some((c) => c.name.toLowerCase().includes(q))
    );

    const matchedNotices = notices.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.shortDescription.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );

    const matchedEvents = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );

    const matchedAlbums = albums.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    );

    return {
      wings: matchedWings,
      notices: matchedNotices,
      events: matchedEvents,
      albums: matchedAlbums,
    };
  }, [query, wings, notices, events, albums]);

  if (!isOpen) return null;

  const totalResults =
    results.wings.length +
    results.notices.length +
    results.events.length +
    results.albums.length;

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search degrees, notices, events, courses, albums..."
            className="w-full text-base bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-6">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <p>Type to search across Vishwa Vinayak Trust institutions, notices, and events.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Admission', 'Degree College', 'Science Lab', '+2 Examination', 'Vinayakotsav', 'Physics'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-2.5 py-1 text-xs bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800 rounded-full transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="font-semibold text-slate-700">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try another keyword or search term.</p>
            </div>
          ) : (
            <>
              {/* Wings */}
              {results.wings.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Academic Wings ({results.wings.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.wings.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => handleSelect(`/wings/${w.slug}`)}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-amber-50/80 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-amber-800">
                            {w.name}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">{w.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices */}
              {results.notices.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>Notices & Circulars ({results.notices.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.notices.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleSelect(`/notice`)}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-amber-50/80 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              {n.category}
                            </span>
                            <span className="text-[11px] text-slate-400">{n.noticeDate}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800 mt-1">
                            {n.title}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {results.events.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Events ({results.events.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.events.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleSelect(`/event`)}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-amber-50/80 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                            {e.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {e.eventDate} • {e.venue}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {results.albums.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-amber-600" />
                    <span>Gallery Albums ({results.albums.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.albums.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleSelect(`/gallery`)}
                        className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-amber-50/80 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                            {a.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {a.category} • {a.photos.length} Photos
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

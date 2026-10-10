import React, { useState } from 'react';
import { EventItem, Wing, EventStatus } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  Search,
  Filter,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface EventPageProps {
  events: EventItem[];
  wings: Wing[];
}

export const EventPage: React.FC<EventPageProps> = ({ events, wings }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWing, setSelectedWing] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [activeEventModal, setActiveEventModal] = useState<EventItem | null>(null);

  const getWingName = (wingId: string) => {
    if (wingId === 'all') return 'All Trust Wings';
    const found = wings.find((w) => w.id === wingId || w.slug === wingId);
    return found ? found.shortName : wingId;
  };

  const filteredEvents = events.filter((e) => {
    if (!e.isPublished) return false;
    if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
    if (selectedWing !== 'all' && e.wingId !== selectedWing && e.wingId !== 'all') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case 'upcoming':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ongoing':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse';
      case 'completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Campus Life & Confluences
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            EVENTS & ACTIVITIES
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            Explore academic seminars, cultural galas like Vinayakotsav, annual sports meets, science
            exhibitions, and community outreach organized by Vishwa Vinayak Trust.
          </p>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by title or venue..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="ongoing">Ongoing Events</option>
              <option value="completed">Completed Events</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:outline-none"
            >
              <option value="all">All Wings</option>
              {wings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-[100px] overflow-hidden bg-slate-900">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[100px] object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ height: '100px' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${getStatusBadge(
                        evt.status
                      )}`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  {/* Wing Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-white/20">
                      {getWingName(evt.wingId)}
                    </span>
                  </div>

                  {/* Date Over Image */}
                  <div className="absolute bottom-3 left-4 text-white flex items-center gap-1.5 text-xs font-bold drop-shadow">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{evt.eventDate}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      onClick={() => setActiveEventModal(evt)}
                      className="cursor-pointer font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2"
                    >
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        {evt.startTime} {evt.endTime ? `- ${evt.endTime}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setActiveEventModal(evt)}
                      className="cursor-pointer text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline"
                    >
                      View Full Details →
                    </button>

                    {evt.registrationUrl && evt.status === 'upcoming' && (
                      <a
                        href={evt.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <span>Register</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No events matched your selection</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the status or wing filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Image Header */}
            <div className="relative h-56 bg-slate-900">
              <img
                src={activeEventModal.coverImage}
                alt={activeEventModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setActiveEventModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(
                    activeEventModal.status
                  )}`}
                >
                  {activeEventModal.status}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold leading-tight">
                  {activeEventModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
              {/* Event Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
                  <span className="font-bold text-slate-800">{activeEventModal.eventDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
                  <span className="font-bold text-slate-800">
                    {activeEventModal.startTime} - {activeEventModal.endTime}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Wing</span>
                  <span className="font-bold text-amber-800">
                    {getWingName(activeEventModal.wingId)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Venue Location
                </span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{activeEventModal.venue}</span>
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Event Description & Schedule
                </span>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                  {activeEventModal.fullContent || activeEventModal.description}
                </div>
              </div>

              {/* Photos if any */}
              {activeEventModal.images && activeEventModal.images.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Event Gallery Preview
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {activeEventModal.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Event snap"
                        className="rounded-xl h-32 w-full object-cover border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {activeEventModal.registrationUrl ? (
                <a
                  href={activeEventModal.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Attend / Register Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-xs text-slate-500">Free open attendance for all.</span>
              )}

              <button
                onClick={() => setActiveEventModal(null)}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

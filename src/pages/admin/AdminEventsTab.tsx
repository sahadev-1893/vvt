import React, { useState } from 'react';
import { EventItem, Wing, EventStatus } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Search,
  Download,
  X,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface AdminEventsTabProps {
  events: EventItem[];
  wings: Wing[];
  onRefresh: () => void;
  isOpenModalInitial?: boolean;
}

export const AdminEventsTab: React.FC<AdminEventsTabProps> = ({
  events,
  wings,
  onRefresh,
}) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedWing, setSelectedWing] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [formData, setFormData] = useState<Partial<EventItem>>({
    title: '',
    eventDate: new Date().toISOString().substring(0, 10),
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venue: 'Vishwa Vinayak Central Campus, Khireitangiri',
    wingId: 'all',
    description: '',
    fullContent: '',
    registrationUrl: '',
    status: 'upcoming',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
  });

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      eventDate: new Date().toISOString().substring(0, 10),
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      venue: 'Vishwa Vinayak Central Campus, Khireitangiri',
      wingId: 'all',
      description: '',
      fullContent: '',
      registrationUrl: '',
      status: 'upcoming',
      coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setFormData({ ...evt });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    storageService.deleteEvent(id, currentAdmin || undefined);
    onRefresh();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.venue) {
      alert('Please fill in Event Title and Venue.');
      return;
    }

    const eventToSave: EventItem = {
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      title: formData.title.trim(),
      eventDate: formData.eventDate || new Date().toISOString().substring(0, 10),
      startTime: formData.startTime || '10:00 AM',
      endTime: formData.endTime || '',
      venue: formData.venue.trim(),
      wingId: formData.wingId || 'all',
      description: formData.description || '',
      fullContent: formData.fullContent || formData.description || '',
      registrationUrl: formData.registrationUrl || '',
      status: (formData.status as EventStatus) || 'upcoming',
      coverImage:
        formData.coverImage ||
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      images: editingEvent ? editingEvent.images : [],
      isPublished: formData.isPublished !== undefined ? formData.isPublished : true,
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString(),
    };

    storageService.saveEvent(eventToSave, currentAdmin || undefined);
    setIsModalOpen(false);
    onRefresh();
  };

  const handleExportCSV = () => {
    const rows = events.map((e) => ({
      ID: e.id,
      Title: e.title,
      Date: e.eventDate,
      Time: `${e.startTime} - ${e.endTime}`,
      Venue: e.venue,
      Wing: e.wingId,
      Status: e.status,
    }));
    storageService.exportToCSV('VVT_Events_Report', rows);
  };

  const filteredEvents = events.filter((e) => {
    if (selectedWing !== 'all' && e.wingId !== selectedWing) return false;
    if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q);
    }
    return true;
  });

  const getWingName = (wingId: string) => {
    if (wingId === 'all') return 'All Wings';
    const found = wings.find((w) => w.id === wingId || w.slug === wingId);
    return found ? found.shortName : wingId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Events Management</h2>
          <p className="text-xs text-slate-400">
            Organize cultural fests, annual sports, examinations, seminars, and health camps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openCreateModal}
            className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Event</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search event title or venue..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={selectedWing}
          onChange={(e) => setSelectedWing(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">Filter by Wing (All)</option>
          {wings.map((w) => (
            <option key={w.id} value={w.id}>
              {w.shortName} - {w.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">Filter by Status (All)</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44">
              <img
                src={evt.coverImage}
                alt={evt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                  {evt.status}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 text-amber-300 text-[10px] font-bold">
                  {getWingName(evt.wingId)}
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-heading text-sm font-bold leading-snug drop-shadow">
                  {evt.title}
                </h3>
                <span className="text-[11px] text-amber-300 block">{evt.eventDate}</span>
              </div>
            </div>

            <div className="p-4 space-y-2 text-xs text-slate-400 flex-1">
              <p className="line-clamp-2">{evt.description}</p>
              <p className="text-[11px] text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span className="truncate">{evt.venue}</span>
              </p>
            </div>

            <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {evt.startTime} {evt.endTime ? `- ${evt.endTime}` : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(evt)}
                  className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-200 shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h3 className="font-heading text-lg font-bold text-white">
                {editingEvent ? 'Edit Event' : 'Schedule New Event'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. VINAYAKOTSAV 2026 - Annual Fest"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate || ''}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status || 'upcoming'}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as EventStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Host Wing</label>
                  <select
                    value={formData.wingId || 'all'}
                    onChange={(e) => setFormData({ ...formData, wingId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="all">All Wings / Central Trust</option>
                    {wings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.shortName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={formData.startTime || ''}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">End Time</label>
                  <input
                    type="text"
                    value={formData.endTime || ''}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="e.g. 05:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Venue Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue || ''}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Central Auditorium, Khireitangiri Campus"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Short Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Registration / RSVP Link (Optional)
                </label>
                <input
                  type="text"
                  value={formData.registrationUrl || ''}
                  onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                  placeholder="https://forms.google.com/... or event page"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

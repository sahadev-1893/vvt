import React, { useState, useMemo } from 'react';
import { ContactEnquiry } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  Eye,
  X,
  Phone,
} from 'lucide-react';

interface AdminEnquiriesTabProps {
  enquiries: ContactEnquiry[];
  onRefresh: () => void;
}

export const AdminEnquiriesTab: React.FC<AdminEnquiriesTabProps> = ({
  enquiries,
  onRefresh,
}) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeEnquiry, setActiveEnquiry] = useState<ContactEnquiry | null>(null);
  const [replyText, setReplyText] = useState('');

  const openEnquiry = (enq: ContactEnquiry) => {
    setActiveEnquiry(enq);
    setReplyText(enq.replyNotes || '');
    if (enq.status === 'unread') {
      storageService.updateEnquiryStatus(enq.id, 'read', undefined, currentAdmin || undefined);
      onRefresh();
    }
  };

  const handleSaveStatus = (status: 'unread' | 'read' | 'replied') => {
    if (!activeEnquiry) return;
    storageService.updateEnquiryStatus(
      activeEnquiry.id,
      status,
      replyText,
      currentAdmin || undefined
    );
    setActiveEnquiry(null);
    onRefresh();
  };

  const handleDelete = (id: string, subject: string) => {
    if (!window.confirm(`Delete enquiry "${subject}"?`)) return;
    storageService.deleteEnquiry(id, currentAdmin || undefined);
    onRefresh();
  };

  const handleExportCSV = () => {
    const rows = enquiries.map((e) => ({
      ID: e.id,
      Name: e.name,
      Mobile: e.mobile,
      Email: e.email,
      Subject: e.subject,
      Message: e.message,
      Status: e.status,
      Notes: e.replyNotes || '',
      Date: e.createdAt,
    }));
    storageService.exportToCSV('VVT_Contact_Enquiries', rows);
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q) ||
          e.mobile.includes(q)
        );
      }
      return true;
    });
  }, [enquiries, statusFilter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Contact Enquiries</h2>
          <p className="text-xs text-slate-400">
            Messages received from prospective students, parents, and community members
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All to CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries by name, subject, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                <th className="py-3.5 px-4">Sender Details</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Message Snippet</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Received Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-xs">{enq.name}</p>
                    <span className="text-[11px] text-amber-400 font-mono">{enq.mobile}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{enq.subject}</td>
                  <td className="py-3.5 px-4 max-w-xs text-slate-400 truncate">{enq.message}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        enq.status === 'unread'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : enq.status === 'replied'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEnquiry(enq)}
                        className="cursor-pointer px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px]"
                      >
                        View & Reply
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDelete(enq.id, enq.subject)}
                          className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">
                  Enquiry Details
                </span>
                <h3 className="font-heading text-base font-bold text-white">
                  {activeEnquiry.subject}
                </h3>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block font-bold text-[10px]">Name</span>
                  <span className="font-bold text-white">{activeEnquiry.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold text-[10px]">Mobile</span>
                  <a href={`tel:${activeEnquiry.mobile}`} className="text-amber-400 font-bold">
                    {activeEnquiry.mobile}
                  </a>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block font-bold text-[10px]">Email</span>
                  <span className="text-slate-300">{activeEnquiry.email}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase mb-1">
                  Message Content
                </span>
                <p className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed">
                  {activeEnquiry.message}
                </p>
              </div>

              <div>
                <label className="text-slate-400 block font-bold text-[10px] uppercase mb-1">
                  Resolution / Reply Action Notes
                </label>
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Record phone call notes or action taken..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveStatus('unread')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Mark Unread
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveStatus('read')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold"
                >
                  Mark Read
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveStatus('replied')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                >
                  Mark as Replied
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

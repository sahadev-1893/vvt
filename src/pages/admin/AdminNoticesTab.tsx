import React, { useState, useMemo } from 'react';
import { Notice, Wing, NoticeCategory } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Download,
  Search,
  Filter,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  FileDown,
} from 'lucide-react';

interface AdminNoticesTabProps {
  notices: Notice[];
  wings: Wing[];
  onRefresh: () => void;
  isOpenModalInitial?: boolean;
}

export const AdminNoticesTab: React.FC<AdminNoticesTabProps> = ({
  notices,
  wings,
  onRefresh,
}) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedWing, setSelectedWing] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const [formData, setFormData] = useState<Partial<Notice>>({
    title: '',
    noticeDate: new Date().toISOString().substring(0, 10),
    category: 'Academic',
    shortDescription: '',
    fullContent: '',
    wingId: 'all',
    isImportant: false,
    isNew: true,
    status: 'published',
    attachmentUrl: '',
    attachmentName: '',
    attachmentType: 'none',
  });

  const categories: NoticeCategory[] = [
    'Academic',
    'Admission',
    'Examination',
    'General',
    'Recruitment',
    'Tender',
  ];

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      noticeDate: new Date().toISOString().substring(0, 10),
      category: 'Academic',
      shortDescription: '',
      fullContent: '',
      wingId: 'all',
      isImportant: false,
      isNew: true,
      status: 'published',
      attachmentUrl: '',
      attachmentName: '',
      attachmentType: 'none',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({ ...notice });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Delete notice "${title}"?`)) return;
    storageService.deleteNotice(id, currentAdmin || undefined);
    onRefresh();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        attachmentUrl: reader.result as string,
        attachmentName: file.name,
        attachmentType: file.name.endsWith('.pdf') ? 'pdf' : 'doc',
        attachmentSize: `${(file.size / 1024).toFixed(1)} KB`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription) {
      alert('Please fill in Title and Short Description.');
      return;
    }

    const noticeToSave: Notice = {
      id: editingNotice ? editingNotice.id : `not-${Date.now()}`,
      title: formData.title.trim(),
      noticeDate: formData.noticeDate || new Date().toISOString().substring(0, 10),
      category: (formData.category as NoticeCategory) || 'General',
      shortDescription: formData.shortDescription.trim(),
      fullContent: formData.fullContent || formData.shortDescription || '',
      wingId: formData.wingId || 'all',
      isImportant: !!formData.isImportant,
      isNew: !!formData.isNew,
      status: formData.status || 'published',
      attachmentUrl: formData.attachmentUrl || '',
      attachmentName: formData.attachmentName || '',
      attachmentType: formData.attachmentType || 'none',
      attachmentSize: formData.attachmentSize || '',
      createdBy: currentAdmin?.fullName || 'VVT Administrator',
      createdAt: editingNotice ? editingNotice.createdAt : new Date().toISOString(),
    };

    storageService.saveNotice(noticeToSave, currentAdmin || undefined);
    setIsModalOpen(false);
    onRefresh();
  };

  const handleExportCSV = () => {
    const rows = notices.map((n) => ({
      ID: n.id,
      Title: n.title,
      Date: n.noticeDate,
      Category: n.category,
      Wing: n.wingId,
      Status: n.status,
      Important: n.isImportant ? 'Yes' : 'No',
      Attachment: n.attachmentName || 'None',
      CreatedBy: n.createdBy || 'Admin',
    }));
    storageService.exportToCSV('VVT_Notices_Report', rows);
  };

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      if (selectedWing !== 'all' && n.wingId !== selectedWing) return false;
      if (selectedCategory !== 'all' && n.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.shortDescription.toLowerCase().includes(q);
      }
      return true;
    });
  }, [notices, selectedWing, selectedCategory, search]);

  const getWingName = (wingId: string) => {
    if (wingId === 'all') return 'All Wings';
    const found = wings.find((w) => w.id === wingId || w.slug === wingId);
    return found ? found.shortName : wingId;
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Notices & Circulars</h2>
          <p className="text-xs text-slate-400">
            Publish academic announcements, examination schedules, tenders, and downloadable PDFs
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
            <span>Publish New Notice</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notice title or content..."
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">Filter by Category (All)</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Notices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                <th className="py-3.5 px-4">Title & Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Wing</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Attachment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredNotices.map((n) => (
                <tr key={n.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-bold text-white text-xs leading-snug">{n.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {n.shortDescription}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-amber-300">
                      {n.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-slate-300 font-medium">{getWingName(n.wingId)}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {n.noticeDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      {n.isImportant && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-950 text-red-400 border border-red-800">
                          Important
                        </span>
                      )}
                      {n.isNew && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {n.attachmentUrl ? (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1">
                        <FileDown className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[100px]">
                          {n.attachmentName || 'PDF'}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px]">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(n)}
                        className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id, n.title)}
                        className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-200 shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h3 className="font-heading text-lg font-bold text-white">
                {editingNotice ? 'Edit Notice' : 'Publish New Notice'}
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
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Schedule for +3 Final Semester Practical Examinations 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Notice Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.noticeDate || ''}
                    onChange={(e) => setFormData({ ...formData, noticeDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category || 'Academic'}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as NoticeCategory })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target Wing</label>
                  <select
                    value={formData.wingId || 'all'}
                    onChange={(e) => setFormData({ ...formData, wingId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="all">All Wings / Central</option>
                    {wings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.shortName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Short Summary (Visible on lists) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Announcement Content
                </label>
                <textarea
                  rows={4}
                  value={formData.fullContent || ''}
                  onChange={(e) => setFormData({ ...formData, fullContent: e.target.value })}
                  placeholder="Detailed text of notification..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              {/* Upload Attachment */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Attachment / Document Upload (PDF, DOC, Images)
                </span>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Choose File to Upload</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.attachmentName && (
                    <span className="text-xs text-emerald-400 font-semibold truncate max-w-xs">
                      Attached: {formData.attachmentName} ({formData.attachmentSize})
                    </span>
                  )}
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!formData.isImportant}
                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                    className="rounded border-slate-700 text-red-600 focus:ring-red-500"
                  />
                  <span>Mark as Important (Flashing Badge)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Mark as "New"</span>
                </label>
              </div>

              {/* Modal Actions */}
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { ActivityLog } from '../types';
import { storageService } from '../services/storage';
import {
  History,
  X,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  Database,
} from 'lucide-react';

interface AdminAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
}

export const AdminAuditModal: React.FC<AdminAuditModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');

  const modules = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.module));
    return Array.from(set);
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedModule !== 'all' && log.module !== selectedModule) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          log.recordTitle.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.adminName.toLowerCase().includes(q) ||
          (log.details && log.details.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [logs, selectedModule, search]);

  const handleExportCSV = () => {
    const rows = logs.map((l) => ({
      Timestamp: l.timestamp,
      Administrator: l.adminName,
      Email: l.adminEmail,
      Module: l.module,
      Action: l.action,
      RecordTitle: l.recordTitle,
      Details: l.details || '',
    }));
    storageService.exportToCSV('VVT_Website_Audit_And_Updates_Log', rows);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[88vh] flex flex-col shadow-2xl animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-black text-white">
                Details That Have Been Done on the Website
              </h2>
              <p className="text-xs text-slate-400">
                Complete audit trail of all edits, updates, uploads, and publications synchronized with Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Download audit log to CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search changes by title, admin, or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Modules ({logs.length} changes recorded)</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Audit Log Entries List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {log.module}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                    {log.action}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">{log.recordTitle}</h3>
                {log.details && (
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">{log.details}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>
                    Done by: <strong className="text-slate-300">{log.adminName}</strong> ({log.adminEmail})
                  </span>
                </div>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Database className="w-3 h-3" />
                  Synced to Supabase
                </span>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
              No matching activity records found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Connected Project: heeevwvzlleubaikuoua</span>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

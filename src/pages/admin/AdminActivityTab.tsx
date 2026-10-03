import React, { useState } from 'react';
import { ActivityLog } from '../../types';
import { storageService } from '../../services/storage';
import { History, Search, Download, ShieldCheck, User } from 'lucide-react';

interface AdminActivityTabProps {
  logs: ActivityLog[];
}

export const AdminActivityTab: React.FC<AdminActivityTabProps> = ({ logs }) => {
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase()) ||
      l.adminName.toLowerCase().includes(search.toLowerCase()) ||
      l.recordTitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const rows = logs.map((l) => ({
      Timestamp: l.timestamp,
      Admin: l.adminName,
      Email: l.adminEmail,
      Action: l.action,
      Module: l.module,
      Record: l.recordTitle,
      Details: l.details || '',
    }));
    storageService.exportToCSV('VVT_Activity_Audit_Log', rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">System Activity Audit Trail</h2>
          <p className="text-xs text-slate-400">
            Immutable log recording administrative modifications across wings, notices, and applicant
            records
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search activity by admin, action, or record..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Record / Target</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-xs">{log.adminName}</p>
                    <span className="text-[10px] text-slate-500">{log.adminEmail}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-950 text-amber-300 border border-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{log.module}</td>
                  <td className="py-3.5 px-4 text-white font-medium">{log.recordTitle}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

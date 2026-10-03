import React, { useState } from 'react';
import { AdminUser, AdminRole, AdminAccountStatus } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Trash2,
  CheckCircle,
  XCircle,
  Key,
  Lock,
} from 'lucide-react';

interface AdminAdminsTabProps {
  onRefresh: () => void;
}

export const AdminAdminsTab: React.FC<AdminAdminsTabProps> = ({ onRefresh }) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const admins = storageService.getAdmins();

  const handleApprove = (admin: AdminUser) => {
    const updated: AdminUser = {
      ...admin,
      status: 'active',
    };
    storageService.saveAdmin(updated, currentAdmin || undefined);
    onRefresh();
  };

  const handleRoleChange = (admin: AdminUser, newRole: AdminRole) => {
    const updated: AdminUser = {
      ...admin,
      role: newRole,
    };
    storageService.saveAdmin(updated, currentAdmin || undefined);
    onRefresh();
  };

  const handleDelete = (id: string, name: string) => {
    if (admins.length <= 1) {
      alert('Cannot delete the last remaining Super Administrator.');
      return;
    }
    if (!window.confirm(`Permanently remove administrator "${name}"?`)) return;
    storageService.deleteAdmin(id, currentAdmin || undefined);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">
            Administrators & Role Governance
          </h2>
          <p className="text-xs text-slate-400">
            Control Super Admin, Admin, and Editor permissions, approve pending sign-up requests
          </p>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Role Access</th>
                <th className="py-3.5 px-4">Approval Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-xs">{adm.fullName}</p>
                    <span className="text-[11px] text-slate-400">{adm.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{adm.mobile}</td>
                  <td className="py-3.5 px-4">
                    <select
                      disabled={!isSuperAdmin || adm.id === currentAdmin?.id}
                      value={adm.role}
                      onChange={(e) => handleRoleChange(adm, e.target.value as AdminRole)}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-amber-300 font-bold disabled:opacity-60 cursor-pointer"
                    >
                      <option value="super_admin">SUPER ADMIN</option>
                      <option value="admin">ADMIN</option>
                      <option value="editor">EDITOR</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        adm.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : adm.status === 'pending_approval'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {adm.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {adm.lastLogin ? new Date(adm.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {adm.status === 'pending_approval' && isSuperAdmin && (
                        <button
                          onClick={() => handleApprove(adm)}
                          className="cursor-pointer px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                        >
                          Approve
                        </button>
                      )}

                      {isSuperAdmin && adm.id !== currentAdmin?.id && (
                        <button
                          onClick={() => handleDelete(adm.id, adm.fullName)}
                          className="cursor-pointer p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete Admin"
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
    </div>
  );
};

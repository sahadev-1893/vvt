import React, { useState, useMemo } from 'react';
import { CareerApplication, Wing, ApplicationStatus } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  UserCheck,
  XCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  X,
  FileDown,
} from 'lucide-react';

interface AdminApplicationsTabProps {
  applications: CareerApplication[];
  wings: Wing[];
  onRefresh: () => void;
}

export const AdminApplicationsTab: React.FC<AdminApplicationsTabProps> = ({
  applications,
  wings,
  onRefresh,
}) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWing, setSelectedWing] = useState<string>('all');
  const [activeApp, setActiveApp] = useState<CareerApplication | null>(null);

  // Status update state for active modal
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('new');
  const [editRemarks, setEditRemarks] = useState('');

  const openAppDetails = (app: CareerApplication) => {
    setActiveApp(app);
    setEditStatus(app.status);
    setEditRemarks(app.adminRemarks || '');
  };

  const handleStatusSave = () => {
    if (!activeApp) return;
    storageService.updateApplicationStatus(
      activeApp.id,
      editStatus,
      editRemarks,
      currentAdmin || undefined
    );
    setActiveApp(null);
    onRefresh();
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Permanently remove application of ${name}?`)) return;
    storageService.deleteApplication(id, currentAdmin || undefined);
    onRefresh();
  };

  const handleDownloadCV = (app: CareerApplication) => {
    if (!app.cvFileData) {
      alert('No CV file payload found for this record.');
      return;
    }
    const a = document.createElement('a');
    a.href = app.cvFileData;
    a.download = app.cvFileName || `Resume_${app.applicationId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportCSV = () => {
    const rows = applications.map((a) => ({
      ApplicationID: a.applicationId,
      FullName: a.fullName,
      ParentName: a.parentName,
      Gender: a.gender,
      Mobile: a.mobile,
      Email: a.email,
      Position: a.applyingFor,
      Qualification: a.qualification,
      Experience: a.experience,
      PreferredWing: a.preferredWingId,
      Status: a.status,
      AdminRemarks: a.adminRemarks || 'None',
      SubmittedDate: a.createdAt,
    }));
    storageService.exportToCSV('VVT_Career_Applications_Report', rows);
  };

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
      if (selectedWing !== 'all' && app.preferredWingId !== selectedWing) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          app.fullName.toLowerCase().includes(q) ||
          app.applicationId.toLowerCase().includes(q) ||
          app.applyingFor.toLowerCase().includes(q) ||
          app.qualification.toLowerCase().includes(q) ||
          app.mobile.includes(q)
        );
      }
      return true;
    });
  }, [applications, selectedStatus, selectedWing, search]);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'under_review':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'shortlisted':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'interview':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'selected':
        return 'bg-green-950 text-green-300 border-green-800';
      case 'rejected':
        return 'bg-red-950 text-red-400 border-red-800';
    }
  };

  const getWingName = (wingId: string) => {
    if (wingId === 'all') return 'Any Wing';
    const found = wings.find((w) => w.id === wingId || w.slug === wingId);
    return found ? found.shortName : wingId;
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Career & CV Applications</h2>
          <p className="text-xs text-slate-400">
            Review job applicants, qualifications, downloaded resumes, and update recruitment status
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

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, qualification, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">All Application Statuses</option>
          <option value="new">New</option>
          <option value="under_review">Under Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={selectedWing}
          onChange={(e) => setSelectedWing(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">All Preferred Wings</option>
          {wings.map((w) => (
            <option key={w.id} value={w.id}>
              {w.shortName} - {w.name}
            </option>
          ))}
        </select>
      </div>

      {/* Applications Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                <th className="py-3.5 px-4">Application ID</th>
                <th className="py-3.5 px-4">Applicant Name</th>
                <th className="py-3.5 px-4">Applying For</th>
                <th className="py-3.5 px-4">Qualification & Exp</th>
                <th className="py-3.5 px-4">Preferred Wing</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">CV File</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                    {app.applicationId}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-xs">{app.fullName}</p>
                    <span className="text-[11px] text-slate-500">{app.mobile}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{app.applyingFor}</td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-300">{app.qualification}</p>
                    <span className="text-[10px] text-slate-500">{app.experience}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{getWingName(app.preferredWingId)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleDownloadCV(app)}
                      className="cursor-pointer text-amber-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      title="Download uploaded CV"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[90px]">{app.cvFileName || 'CV.pdf'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openAppDetails(app)}
                        className="cursor-pointer px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-colors"
                      >
                        Review
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleDelete(app.id, app.fullName)}
                          className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 transition-colors"
                          title="Delete"
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

      {/* Applicant Detailed Review Modal */}
      {activeApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-200 shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {activeApp.applicationId}
                </span>
                <h3 className="font-heading text-lg font-bold text-white">{activeApp.fullName}</h3>
              </div>
              <button
                onClick={() => setActiveApp(null)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs sm:text-sm">
              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Position Applied
                  </span>
                  <span className="font-bold text-white text-sm">{activeApp.applyingFor}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Preferred Wing
                  </span>
                  <span className="font-bold text-amber-400">
                    {getWingName(activeApp.preferredWingId)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Parent / Guardian
                  </span>
                  <span className="text-slate-300">{activeApp.parentName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Gender & DOB
                  </span>
                  <span className="text-slate-300">
                    {activeApp.gender} • {activeApp.dob}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Phone Number
                  </span>
                  <a href={`tel:${activeApp.mobile}`} className="text-amber-400 font-bold">
                    {activeApp.mobile}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Email Address
                  </span>
                  <a href={`mailto:${activeApp.email}`} className="text-slate-300">
                    {activeApp.email}
                  </a>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Address
                  </span>
                  <span className="text-slate-300">{activeApp.address || 'N/A'}</span>
                </div>
              </div>

              {/* Qualifications & Experience */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Academic Qualifications
                  </span>
                  <p className="font-semibold text-white">{activeApp.qualification}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Experience
                  </span>
                  <p className="text-slate-300">{activeApp.experience}</p>
                </div>
                {activeApp.skills && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Skills & Subjects
                    </span>
                    <p className="text-slate-300">{activeApp.skills}</p>
                  </div>
                )}
                {activeApp.message && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Cover Remarks
                    </span>
                    <p className="text-slate-400 italic">"{activeApp.message}"</p>
                  </div>
                )}
              </div>

              {/* Download CV File */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{activeApp.cvFileName || 'Applicant_CV.pdf'}</p>
                    <span className="text-[11px] text-slate-400">
                      {activeApp.cvFileSize || 'Uploaded Resume'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadCV(activeApp)}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </button>
              </div>

              {/* Status Update & Admin Remarks */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Update Candidate Recruitment Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Application Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="new">New (Unreviewed)</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted for Interview</option>
                      <option value="interview">Interview Scheduled</option>
                      <option value="selected">Selected / Offer Extended</option>
                      <option value="rejected">Rejected / Not Suitable</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Internal Admin Remarks
                    </label>
                    <input
                      type="text"
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      placeholder="e.g. Call for interview on April 15"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleStatusSave}
                  className="cursor-pointer px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider"
                >
                  Save Status & Remarks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

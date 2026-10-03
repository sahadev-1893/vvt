import React, { useState } from 'react';
import {
  Wing,
  Notice,
  EventItem,
  GalleryAlbum,
  CareerApplication,
  ContactEnquiry,
} from '../../types';
import { storageService } from '../../services/storage';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  Filter,
  Search,
  CheckCircle,
} from 'lucide-react';

interface AdminReportsTabProps {
  wings: Wing[];
  notices: Notice[];
  events: EventItem[];
  albums: GalleryAlbum[];
  applications: CareerApplication[];
  enquiries: ContactEnquiry[];
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({
  wings,
  notices,
  events,
  albums,
  applications,
  enquiries,
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('applications');
  const [dateRange, setDateRange] = useState('all');

  const handleExportCSV = () => {
    switch (selectedReport) {
      case 'applications':
        storageService.exportToCSV(
          'VVT_Career_Applications_Export',
          applications.map((a) => ({
            ID: a.applicationId,
            Name: a.fullName,
            Gender: a.gender,
            Phone: a.mobile,
            Email: a.email,
            Position: a.applyingFor,
            Wing: a.preferredWingId,
            Qualification: a.qualification,
            Status: a.status,
            Date: a.createdAt,
          }))
        );
        break;
      case 'notices':
        storageService.exportToCSV(
          'VVT_Notices_Export',
          notices.map((n) => ({
            Title: n.title,
            Date: n.noticeDate,
            Category: n.category,
            Wing: n.wingId,
            Important: n.isImportant ? 'Yes' : 'No',
            Attachment: n.attachmentName || 'None',
          }))
        );
        break;
      case 'events':
        storageService.exportToCSV(
          'VVT_Events_Export',
          events.map((e) => ({
            Title: e.title,
            Date: e.eventDate,
            Venue: e.venue,
            Status: e.status,
            Wing: e.wingId,
          }))
        );
        break;
      case 'enquiries':
        storageService.exportToCSV(
          'VVT_Contact_Enquiries_Export',
          enquiries.map((e) => ({
            Name: e.name,
            Mobile: e.mobile,
            Email: e.email,
            Subject: e.subject,
            Status: e.status,
            Date: e.createdAt,
          }))
        );
        break;
      case 'wings':
        storageService.exportToCSV(
          'VVT_Academic_Wings_Export',
          wings.map((w) => ({
            Name: w.name,
            Code: w.shortName,
            Principal: w.principalName,
            Phone: w.phone,
            TotalCourses: w.courses.length,
            Status: w.status,
          }))
        );
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">Trust Institutional Reports</h2>
          <p className="text-xs text-slate-400">
            Generate and export comprehensive audits across admissions, job applications, notices, and
            enquiries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { id: 'applications', label: `Career Applications (${applications.length})` },
          { id: 'notices', label: `Notices & Circulars (${notices.length})` },
          { id: 'events', label: `Events & Activities (${events.length})` },
          { id: 'enquiries', label: `Contact Inquiries (${enquiries.length})` },
          { id: 'wings', label: `Academic Wings (${wings.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedReport(tab.id)}
            className={`cursor-pointer p-3 rounded-2xl text-xs font-bold text-left transition-all border ${
              selectedReport === tab.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Preview Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-heading text-base font-bold text-white capitalize">
            {selectedReport.replace('_', ' ')} Data Audit
          </h3>
          <span className="text-xs text-slate-400">
            Exported directly from Vishwa Vinayak Trust Core Database
          </span>
        </div>

        {/* Dynamic preview table based on selectedReport */}
        <div className="overflow-x-auto">
          {selectedReport === 'applications' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">Applying For</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {applications.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2 px-3 font-mono text-amber-400 font-bold">{a.applicationId}</td>
                    <td className="py-2 px-3 font-bold text-white">{a.fullName}</td>
                    <td className="py-2 px-3">{a.applyingFor}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">{a.mobile}</td>
                    <td className="py-2 px-3 uppercase text-[10px] font-bold text-amber-300">
                      {a.status}
                    </td>
                    <td className="py-2 px-3 text-slate-500">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'notices' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Notice Title</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Wing</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {notices.map((n) => (
                  <tr key={n.id}>
                    <td className="py-2 px-3 font-bold text-white">{n.title}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">{n.noticeDate}</td>
                    <td className="py-2 px-3 uppercase text-[10px] text-amber-300 font-bold">
                      {n.category}
                    </td>
                    <td className="py-2 px-3">{n.wingId}</td>
                    <td className="py-2 px-3 uppercase text-[10px] text-emerald-400">{n.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'events' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Event Title</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Venue</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {events.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 px-3 font-bold text-white">{e.title}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">
                      {e.eventDate} ({e.startTime})
                    </td>
                    <td className="py-2 px-3">{e.venue}</td>
                    <td className="py-2 px-3 uppercase text-[10px] font-bold text-amber-300">
                      {e.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'enquiries' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Sender Name</th>
                  <th className="py-2.5 px-3">Mobile & Email</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {enquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td className="py-2 px-3 font-bold text-white">{enq.name}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">
                      {enq.mobile} • {enq.email}
                    </td>
                    <td className="py-2 px-3">{enq.subject}</td>
                    <td className="py-2 px-3 uppercase text-[10px] font-bold text-amber-300">
                      {enq.status}
                    </td>
                    <td className="py-2 px-3 text-slate-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReport === 'wings' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Wing Name</th>
                  <th className="py-2.5 px-3">Principal / Head</th>
                  <th className="py-2.5 px-3">Courses Count</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {wings.map((w) => (
                  <tr key={w.id}>
                    <td className="py-2 px-3 font-mono text-red-400 font-bold">{w.shortName}</td>
                    <td className="py-2 px-3 font-bold text-white">{w.name}</td>
                    <td className="py-2 px-3">{w.principalName}</td>
                    <td className="py-2 px-3 font-mono text-amber-400">{w.courses.length} Programs</td>
                    <td className="py-2 px-3 uppercase text-[10px] text-emerald-400">{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Wing,
  Expert,
  Notice,
  EventItem,
  GalleryAlbum,
  CareerApplication,
  ContactEnquiry,
  SiteSettings,
} from '../../types';
import {
  GraduationCap,
  Award,
  FileText,
  Calendar,
  Image,
  Briefcase,
  Mail,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  FileDown,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardTabProps {
  wings: Wing[];
  experts?: Expert[];
  notices: Notice[];
  events: EventItem[];
  albums: GalleryAlbum[];
  applications: CareerApplication[];
  enquiries: ContactEnquiry[];
  onNavigateTab: (tab: string) => void;
  onOpenNoticeModal: () => void;
  onOpenEventModal: () => void;
  onOpenWingModal: () => void;
  onOpenExpertModal?: () => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  wings,
  experts = [],
  notices,
  events,
  albums,
  applications,
  enquiries,
  onNavigateTab,
  onOpenNoticeModal,
  onOpenEventModal,
  onOpenWingModal,
  onOpenExpertModal,
}) => {
  const totalGalleryPhotos = albums.reduce((acc, a) => acc + a.photos.length, 0);
  const newApplications = applications.filter((a) => a.status === 'new');
  const unreadEnquiries = enquiries.filter((e) => e.status === 'unread');
  const upcomingEvents = events.filter((e) => e.status === 'upcoming');

  const statCards = [
    {
      label: 'Total Wings',
      count: wings.length,
      sub: `${wings.filter((w) => w.status === 'active').length} Active`,
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-700',
      tab: 'wings',
    },
    {
      label: 'Faculty & Experts',
      count: experts.length,
      sub: `${experts.filter((e) => e.status === 'active').length} Active Profiles`,
      icon: Award,
      color: 'from-amber-600 to-yellow-600',
      tab: 'experts',
    },
    {
      label: 'Total Notices',
      count: notices.length,
      sub: `${notices.filter((n) => n.isImportant).length} Important`,
      icon: FileText,
      color: 'from-amber-600 to-amber-700',
      tab: 'notices',
    },
    {
      label: 'Total Events',
      count: events.length,
      sub: `${upcomingEvents.length} Upcoming`,
      icon: Calendar,
      color: 'from-emerald-600 to-teal-700',
      tab: 'events',
    },
    {
      label: 'Career Applications',
      count: applications.length,
      sub: `${newApplications.length} New CVs`,
      icon: Briefcase,
      color: 'from-red-600 to-rose-700',
      tab: 'applications',
    },
    {
      label: 'Contact Enquiries',
      count: enquiries.length,
      sub: `${unreadEnquiries.length} Unread`,
      icon: Mail,
      color: 'from-cyan-600 to-blue-700',
      tab: 'enquiries',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Institutional CMS
          </span>
          <h1 className="font-heading text-xl sm:text-2xl font-black text-white">
            Vishwa Vinayak Trust Control Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Khireitangiri, Kendujhar • Manage Wings, Notices, Events, Admissions & Job Applications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNoticeModal}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Notice</span>
          </button>
          <button
            onClick={onOpenEventModal}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
          <button
            onClick={onOpenWingModal}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Wing</span>
          </button>
          {onOpenExpertModal && (
            <button
              onClick={onOpenExpertModal}
              className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Expert</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => onNavigateTab(card.tab)}
              className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl shadow-xs transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="font-heading text-2xl font-black text-white mt-2 group-hover:text-amber-400 transition-colors">
                {card.count}
              </p>
              <span className="text-[11px] text-slate-500 font-medium">{card.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Graphical Activity & Trends (Notices, Events, Applications by Month) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Month Trends Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Monthly Activity Overview
              </h3>
              <p className="text-xs text-slate-400">Records created over recent academic months</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-amber-400">
              Academic Year 2026
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-4 space-y-4">
            {[
              {
                month: 'March 2026',
                notices: 5,
                events: 3,
                applications: 7,
                enquiries: 12,
              },
              {
                month: 'February 2026',
                notices: 4,
                events: 2,
                applications: 5,
                enquiries: 9,
              },
              {
                month: 'January 2026',
                notices: 6,
                events: 4,
                applications: 8,
                enquiries: 14,
              },
            ].map((item) => (
              <div key={item.month} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>{item.month}</span>
                  <span className="text-slate-500">
                    {item.notices} Notices • {item.applications} CVs • {item.enquiries} Inquiries
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(item.notices / 25) * 100}%` }}
                    className="bg-amber-500 h-full"
                    title={`Notices: ${item.notices}`}
                  />
                  <div
                    style={{ width: `${(item.applications / 25) * 100}%` }}
                    className="bg-red-500 h-full"
                    title={`Applications: ${item.applications}`}
                  />
                  <div
                    style={{ width: `${(item.enquiries / 25) * 100}%` }}
                    className="bg-blue-500 h-full"
                    title={`Enquiries: ${item.enquiries}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
              <span>Notices</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />
              <span>Job CVs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" />
              <span>Enquiries</span>
            </span>
          </div>
        </div>

        {/* Quick Institutional Wings Snapshot */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-base font-bold text-white">Trust Academic Wings</h3>
              <p className="text-xs text-slate-400">Currently configured educational branches</p>
            </div>
            <button
              onClick={() => onNavigateTab('wings')}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Wings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {wings.map((wing) => (
              <div
                key={wing.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950/80 text-red-400 border border-red-800 font-bold flex items-center justify-center text-xs">
                    {wing.shortName}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{wing.name}</h4>
                    <span className="text-[11px] text-slate-400">
                      {wing.courses.length} Programs • Head: {wing.principalName}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    wing.status === 'active'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {wing.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Career Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-white">
              Recent Career / CV Applications
            </h3>
            <p className="text-xs text-slate-400">
              Submitted by candidates through public "Submit Your Details" portal
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('applications')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Applications ({applications.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">App ID</th>
                <th className="py-3 px-3">Applicant Name</th>
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">Qualification</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {applications.slice(0, 4).map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">
                    {app.applicationId}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{app.fullName}</td>
                  <td className="py-3 px-3">{app.applyingFor}</td>
                  <td className="py-3 px-3 text-slate-400">{app.qualification}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-amber-300">
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateTab('applications')}
                      className="cursor-pointer text-amber-400 hover:underline font-bold"
                    >
                      Review →
                    </button>
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

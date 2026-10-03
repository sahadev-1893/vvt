import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VVTLogo } from '../../components/VVTLogo';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Sliders,
  FileText,
  Calendar,
  Image,
  Briefcase,
  Mail,
  Users,
  BarChart3,
  Settings,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  ChevronRight,
  Shield,
  Home,
  Database,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onNavigatePublic: (path: string) => void;
  children: React.ReactNode;
  newApplicationsCount: number;
  unreadEnquiriesCount: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigatePublic,
  children,
  newApplicationsCount,
  unreadEnquiriesCount,
}) => {
  const { currentAdmin, logout, isSuperAdmin } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuSections: MenuSection[] = [
    {
      title: 'CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CONTENT MANAGEMENT',
      items: [
        { id: 'wings', label: 'Wings Management', icon: GraduationCap },
        { id: 'experts', label: 'Faculty & Experts', icon: Award },
        { id: 'sliders', label: 'Hero Sliders', icon: Sliders },
        { id: 'notices', label: 'Notices & Circulars', icon: FileText },
        { id: 'events', label: 'Events & Happenings', icon: Calendar },
        { id: 'gallery', label: 'Photo Gallery', icon: Image },
      ],
    },
    {
      title: 'APPLICATIONS & DESK',
      items: [
        {
          id: 'applications',
          label: 'Career Applications',
          icon: Briefcase,
          badge: newApplicationsCount > 0 ? newApplicationsCount : undefined,
        },
        {
          id: 'enquiries',
          label: 'Contact Enquiries',
          icon: Mail,
          badge: unreadEnquiriesCount > 0 ? unreadEnquiriesCount : undefined,
        },
      ],
    },
    {
      title: 'DATABASE & INTEGRATION',
      items: [
        { id: 'supabase', label: 'Supabase Cloud Database', icon: Database },
      ],
    },
    {
      title: 'GOVERNANCE & REPORTS',
      items: [
        { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
        ...(isSuperAdmin
          ? [{ id: 'admins', label: 'Administrators & Roles', icon: Users }]
          : []),
        { id: 'settings', label: 'Website CMS & SEO', icon: Settings },
        { id: 'activity', label: 'Audit Activity Logs', icon: History },
      ],
    },
  ];

  const handleSelectTab = (tabId: string) => {
    onTabChange(tabId);
    setMobileSidebarOpen(false);
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'admin':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'editor':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <VVTLogo size={42} variant="emblem-only" />
          <div>
            <span className="font-heading text-sm font-bold block text-white">VVT ADMIN</span>
            <span className="text-[10px] text-amber-400 font-semibold uppercase">CMS Control</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigatePublic('/')}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            title="View Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/98 backdrop-blur-md border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand identity */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VVTLogo size={46} variant="emblem-only" />
            <div>
              <span className="font-heading text-sm font-bold text-white block tracking-tight">
                VISHWA VINAYAK
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                Administration Portal
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Menu */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                            isActive ? 'bg-slate-950 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Session Footer & Exit */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">
                {currentAdmin?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">
                  {currentAdmin?.fullName || 'Administrator'}
                </p>
                <span
                  className={`inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase rounded border ${getRoleBadge(
                    currentAdmin?.role
                  )}`}
                >
                  {currentAdmin?.role?.replace('_', ' ') || 'Admin'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="cursor-pointer p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onNavigatePublic('/')}
            className="cursor-pointer w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto bg-slate-900">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Vishwa Vinayak Trust Management Console
            </span>
            <button
              onClick={() => onTabChange('supabase')}
              className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-900/60 transition-colors"
              title="Supabase Project ID: heeevwvzlleubaikuoua - Click to manage database sync"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase DB Connected</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick alert notification pill */}
            {(newApplicationsCount > 0 || unreadEnquiriesCount > 0) && (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs text-amber-300">
                <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>
                  {newApplicationsCount} New CVs • {unreadEnquiriesCount} New Queries
                </span>
              </div>
            )}

            <button
              onClick={() => onNavigatePublic('/')}
              className="cursor-pointer hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Portal</span>
            </button>
          </div>
        </header>

        {/* Injected Content for specific active tab */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};

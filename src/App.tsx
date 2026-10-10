import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { storageService } from './services/storage';
import {
  Wing,
  Expert,
  Slider,
  Notice,
  EventItem,
  GalleryAlbum,
  CareerApplication,
  ContactEnquiry,
  SiteSettings,
  ActivityLog,
} from './types';

// Public Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AdminAuditModal } from './components/AdminAuditModal';
import { NewsTicker } from './components/NewsTicker';

// Public Pages
import { HomePage } from './pages/HomePage';
import { WingsPage } from './pages/WingsPage';
import { WingDetailPage } from './pages/WingDetailPage';
import { ExpertsPage } from './pages/ExpertsPage';
import { NoticePage } from './pages/NoticePage';
import { EventPage } from './pages/EventPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { CareerPage } from './pages/CareerPage';
import { StudentResultSearch } from './pages/StudentResultSearch';

// Admin Pages & Tabs
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminSignUpPage } from './pages/admin/AdminSignUpPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardTab } from './pages/admin/AdminDashboardTab';
import { AdminResultsTab } from './pages/admin/AdminResultsTab';
import { AdminWingsTab } from './pages/admin/AdminWingsTab';
import { AdminExpertsTab } from './pages/admin/AdminExpertsTab';
import { AdminSlidersTab } from './pages/admin/AdminSlidersTab';
import { AdminNoticesTab } from './pages/admin/AdminNoticesTab';
import { AdminEventsTab } from './pages/admin/AdminEventsTab';
import { AdminGalleryTab } from './pages/admin/AdminGalleryTab';
import { AdminApplicationsTab } from './pages/admin/AdminApplicationsTab';
import { AdminEnquiriesTab } from './pages/admin/AdminEnquiriesTab';
import { AdminReportsTab } from './pages/admin/AdminReportsTab';
import { AdminAdminsTab } from './pages/admin/AdminAdminsTab';
import { AdminSettingsTab } from './pages/admin/AdminSettingsTab';
import { AdminActivityTab } from './pages/admin/AdminActivityTab';
import { AdminSupabaseTab } from './pages/admin/AdminSupabaseTab';
import { ShieldCheck, Edit3, Database, LayoutDashboard, LogOut, History, Award } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, isLoading, currentAdmin, logout } = useAuth();

  // Dynamic Content State loaded from CMS / Storage
  const [wings, setWings] = useState<Wing[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());

  // Routing State
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Quick Action Modal Triggers from Dashboard
  const [openNoticeModalInitial, setOpenNoticeModalInitial] = useState(false);
  const [openEventModalInitial, setOpenEventModalInitial] = useState(false);
  const [openWingModalInitial, setOpenWingModalInitial] = useState(false);
  const [openExpertModalInitial, setOpenExpertModalInitial] = useState(false);

  // Helper to normalize paths across preview iframes and static routing
  const normalizePath = (rawPath: string): string => {
    if (!rawPath) return '/';
    const clean = rawPath.split('?')[0].split('#')[0];
    if (clean === '' || clean === '/' || clean === '/index.html') return '/';
    return clean.length > 1 && clean.endsWith('/') ? clean.slice(0, -1) : clean;
  };

  // Refresh all data from storage
  const reloadData = useCallback(() => {
    setWings(storageService.getWings());
    setExperts(storageService.getExperts());
    setSliders(storageService.getSliders());
    setNotices(storageService.getNotices());
    setEvents(storageService.getEvents());
    setAlbums(storageService.getAlbums());
    setApplications(storageService.getApplications());
    setEnquiries(storageService.getEnquiries());
    setLogs(storageService.getLogs());
    setSettings(storageService.getSettings());
  }, []);

  useEffect(() => {
    storageService.init();
    reloadData();

    // Check initial window location if user visited directly
    if (typeof window !== 'undefined' && window.location.pathname) {
      const path = normalizePath(window.location.pathname);
      setCurrentPath(path);
    }
  }, [reloadData]);

  // Handle URL change
  const navigate = (path: string) => {
    const target = normalizePath(path);
    setCurrentPath(target);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', target);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname || '/'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Check if current route is an admin page
  const isAdminRoute = currentPath.startsWith('/admin');

  // Handle Admin Routes
  if (isAdminRoute) {
    if (currentPath === '/admin/login') {
      if (isAuthenticated) {
        navigate('/admin/dashboard');
        return null;
      }
      return <AdminLoginPage onNavigate={navigate} />;
    }

    if (currentPath === '/admin/signup') {
      if (isAuthenticated) {
        navigate('/admin/dashboard');
        return null;
      }
      return <AdminSignUpPage onNavigate={navigate} />;
    }

    // Protected Admin Panel Routes
    if (!isAuthenticated) {
      // Redirect unauthorized attempts to /admin/login
      return <AdminLoginPage onNavigate={navigate} />;
    }

    // Render Protected Admin Console
    const newAppsCount = applications.filter((a) => a.status === 'new').length;
    const unreadEnqCount = enquiries.filter((e) => e.status === 'unread').length;

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={(tab) => {
          setAdminTab(tab);
          setOpenNoticeModalInitial(false);
          setOpenEventModalInitial(false);
          setOpenWingModalInitial(false);
        }}
        onNavigatePublic={navigate}
        newApplicationsCount={newAppsCount}
        unreadEnquiriesCount={unreadEnqCount}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboardTab
            wings={wings}
            experts={experts}
            notices={notices}
            events={events}
            albums={albums}
            applications={applications}
            enquiries={enquiries}
            onNavigateTab={setAdminTab}
            onOpenNoticeModal={() => {
              setAdminTab('notices');
            }}
            onOpenEventModal={() => {
              setAdminTab('events');
            }}
            onOpenWingModal={() => {
              setAdminTab('wings');
            }}
            onOpenExpertModal={() => {
              setAdminTab('experts');
              setOpenExpertModalInitial(true);
            }}
          />
        )}

        {(adminTab === 'results' ||
          adminTab === 'result-statistics' ||
          adminTab === 'bulk-results' ||
          adminTab === 'publish-controls' ||
          adminTab === 'students-dir') && (
          <AdminResultsTab
            initialSubTab={
              adminTab === 'result-statistics'
                ? 'statistics'
                : adminTab === 'bulk-results'
                ? 'bulk'
                : adminTab === 'publish-controls'
                ? 'publish'
                : adminTab === 'students-dir'
                ? 'students'
                : 'overview'
            }
          />
        )}

        {adminTab === 'wings' && (
          <AdminWingsTab
            wings={wings}
            onRefresh={reloadData}
            onNavigatePublic={navigate}
            isOpenModalInitial={openWingModalInitial}
          />
        )}

        {adminTab === 'experts' && (
          <AdminExpertsTab
            experts={experts}
            wings={wings}
            onRefresh={reloadData}
            isOpenModalInitial={openExpertModalInitial}
          />
        )}

        {adminTab === 'sliders' && (
          <AdminSlidersTab sliders={sliders} onRefresh={reloadData} />
        )}

        {adminTab === 'notices' && (
          <AdminNoticesTab
            notices={notices}
            wings={wings}
            onRefresh={reloadData}
            isOpenModalInitial={openNoticeModalInitial}
          />
        )}

        {adminTab === 'events' && (
          <AdminEventsTab
            events={events}
            wings={wings}
            onRefresh={reloadData}
            isOpenModalInitial={openEventModalInitial}
          />
        )}

        {adminTab === 'gallery' && (
          <AdminGalleryTab
            albums={albums}
            wings={wings}
            onRefresh={reloadData}
          />
        )}

        {adminTab === 'applications' && (
          <AdminApplicationsTab
            applications={applications}
            wings={wings}
            onRefresh={reloadData}
          />
        )}

        {adminTab === 'enquiries' && (
          <AdminEnquiriesTab enquiries={enquiries} onRefresh={reloadData} />
        )}

        {adminTab === 'reports' && (
          <AdminReportsTab
            wings={wings}
            notices={notices}
            events={events}
            albums={albums}
            applications={applications}
            enquiries={enquiries}
          />
        )}

        {adminTab === 'admins' && <AdminAdminsTab onRefresh={reloadData} />}

        {adminTab === 'settings' && (
          <AdminSettingsTab settings={settings} onRefresh={reloadData} />
        )}

        {adminTab === 'activity' && <AdminActivityTab logs={logs} />}

        {adminTab === 'supabase' && (
          <AdminSupabaseTab onRefresh={reloadData} />
        )}
      </AdminLayout>
    );
  }

  // PUBLIC WEBSITE ROUTES
  // Parse Wing Detail path (e.g. /wings/vvdc, /wings/vvhss)
  let activeWingDetail: Wing | null = null;
  if (currentPath.startsWith('/wings/') && currentPath.length > 7) {
    const slug = currentPath.substring(7);
    activeWingDetail = wings.find(
      (w) => w.slug.toLowerCase() === slug.toLowerCase() || w.id === slug
    ) || null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
      {/* Admin Floating Control Bar when logged in */}
      {isAuthenticated && currentAdmin && (
        <div className="bg-slate-900 border-b border-amber-500/40 text-white text-xs px-4 py-2 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-300">
              Admin Session:{' '}
              <strong className="text-white">
                {currentAdmin.fullName?.includes('Chairman')
                  ? 'Mr. Rabinarayana Mohanta (Trust Chairman)'
                  : currentAdmin.fullName}
              </strong>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
              {currentAdmin.role}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Context Edit Button */}
            {currentPath === '/' && (
              <button
                onClick={() => {
                  setAdminTab('sliders');
                  navigate('/admin/dashboard');
                }}
                className="cursor-pointer px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Home Sliders</span>
              </button>
            )}

            {(currentPath === '/wings' || currentPath.startsWith('/wings/')) && (
              <button
                onClick={() => {
                  setAdminTab('wings');
                  navigate('/admin/dashboard');
                }}
                className="cursor-pointer px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Manage Wings</span>
              </button>
            )}

            {currentPath === '/notice' && (
              <button
                onClick={() => {
                  setAdminTab('notices');
                  navigate('/admin/dashboard');
                }}
                className="cursor-pointer px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Manage Notices</span>
              </button>
            )}

            {currentPath === '/event' && (
              <button
                onClick={() => {
                  setAdminTab('events');
                  navigate('/admin/dashboard');
                }}
                className="cursor-pointer px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Manage Events</span>
              </button>
            )}

            {currentPath === '/gallery' && (
              <button
                onClick={() => {
                  setAdminTab('gallery');
                  navigate('/admin/dashboard');
                }}
                className="cursor-pointer px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Manage Gallery</span>
              </button>
            )}

            {currentPath === '/experts' && (
              <button
                onClick={() => {
                  setAdminTab('experts');
                  navigate('/admin/dashboard');
                }}
                className="cursor-pointer px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Manage Faculty & Experts</span>
              </button>
            )}

            {currentPath === '/career' && (
              <button
                onClick={() => {
                  setAdminTab('applications');
                  navigate('/admin/dashboard');
                }}
                className="cursor-pointer px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Review CVs & Applications</span>
              </button>
            )}

            {currentPath === '/contact' && (
              <button
                onClick={() => {
                  setAdminTab('enquiries');
                  navigate('/admin/dashboard');
                }}
                className="cursor-pointer px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>View Enquiries</span>
              </button>
            )}

            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="cursor-pointer px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] flex items-center gap-1 border border-slate-700"
              title="View all details, updates and uploads done on the website"
            >
              <History className="w-3 h-3 text-amber-400" />
              <span>Details Done ({logs.length})</span>
            </button>

            <button
              onClick={() => {
                setAdminTab('supabase');
                navigate('/admin/dashboard');
              }}
              className="cursor-pointer px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-[11px] flex items-center gap-1 border border-slate-700"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Supabase DB</span>
            </button>

            <button
              onClick={() => navigate('/admin/dashboard')}
              className="cursor-pointer px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] flex items-center gap-1 border border-slate-700"
            >
              <LayoutDashboard className="w-3 h-3 text-amber-400" />
              <span>Admin Console</span>
            </button>

            <button
              onClick={() => logout()}
              className="cursor-pointer p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Public Header: Strictly NO admin links in header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        wings={wings}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Dynamic News Ticker below Header: Fetches & displays latest exam result publications alongside institutional notices */}
      <NewsTicker notices={notices} onNavigate={navigate} />

      {/* Main Content Router */}
      <main className="flex-1">
        {(currentPath === '/' ||
          (currentPath !== '/wings' &&
            !activeWingDetail &&
            currentPath !== '/notice' &&
            currentPath !== '/event' &&
            currentPath !== '/gallery' &&
            currentPath !== '/experts' &&
            currentPath !== '/contact' &&
            currentPath !== '/career' &&
            currentPath !== '/results' &&
            currentPath !== '/result' &&
            currentPath !== '/check-result')) && (
          <HomePage
            wings={wings}
            experts={experts}
            sliders={sliders}
            notices={notices}
            events={events}
            settings={settings}
            onNavigate={navigate}
          />
        )}

        {(currentPath === '/results' ||
          currentPath === '/result' ||
          currentPath === '/check-result') && (
          <StudentResultSearch onNavigate={navigate} />
        )}

        {currentPath === '/wings' && (
          <WingsPage wings={wings} onNavigate={navigate} />
        )}

        {activeWingDetail && (
          <WingDetailPage
            wing={activeWingDetail}
            notices={notices}
            events={events}
            albums={albums}
            experts={experts}
            onNavigate={navigate}
          />
        )}

        {currentPath === '/notice' && (
          <NoticePage notices={notices} wings={wings} />
        )}

        {currentPath === '/event' && (
          <EventPage events={events} wings={wings} />
        )}

        {currentPath === '/gallery' && <GalleryPage albums={albums} />}

        {currentPath === '/experts' && (
          <ExpertsPage
            experts={experts}
            wings={wings}
            onNavigate={navigate}
            onOpenAdminExpertModal={() => {
              setAdminTab('experts');
              setOpenExpertModalInitial(true);
              navigate('/admin/dashboard');
            }}
            onOpenEditExpert={(exp) => {
              setAdminTab('experts');
              navigate('/admin/dashboard');
            }}
          />
        )}

        {currentPath === '/contact' && <ContactPage settings={settings} />}

        {currentPath === '/career' && (
          <CareerPage wings={wings} onNavigate={navigate} />
        )}
      </main>

      {/* Public Footer: The ONLY place where Admin Login and Admin Sign Up appear */}
      <Footer wings={wings} settings={settings} onNavigate={navigate} />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
        wings={wings}
        notices={notices}
        events={events}
        albums={albums}
      />

      {/* Admin Audit History: Details that have been done on the website */}
      <AdminAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={logs}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

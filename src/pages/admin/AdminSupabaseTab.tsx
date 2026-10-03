import React, { useState, useEffect } from 'react';
import {
  testSupabaseConnection,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SQL_SCHEMA,
  SUPABASE_TABLES,
  supabase,
} from '../../services/supabaseClient';
import { storageService } from '../../services/storage';
import {
  Database,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Code,
  FileSpreadsheet,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText,
  Briefcase,
} from 'lucide-react';

interface AdminSupabaseTabProps {
  onRefresh: () => void;
}

export const AdminSupabaseTab: React.FC<AdminSupabaseTabProps> = ({ onRefresh }) => {
  const [connectionStatus, setConnectionStatus] = useState<{
    loading: boolean;
    connected: boolean;
    message: string;
    tablesFound: string[];
  }>({
    loading: true,
    connected: false,
    message: 'Testing connection to Supabase cloud...',
    tablesFound: [],
  });

  const [tableCounts, setTableCounts] = useState<Record<string, number | string>>({});
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlCode, setShowSqlCode] = useState(false);

  const checkConnection = async () => {
    setConnectionStatus((prev) => ({ ...prev, loading: true }));
    const result = await testSupabaseConnection();
    setConnectionStatus({
      loading: false,
      connected: result.connected,
      message: result.message,
      tablesFound: result.tablesFound,
    });

    // Inspect table counts from Supabase
    const counts: Record<string, number | string> = {};
    for (const [key, tableName] of Object.entries(SUPABASE_TABLES)) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        if (error) {
          counts[tableName] = 'Pending Table';
        } else {
          counts[tableName] = count !== null ? count : 0;
        }
      } catch (e) {
        counts[tableName] = 'Pending Table';
      }
    }
    setTableCounts(counts);
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handlePushAllData = async () => {
    setIsPushing(true);
    setActionMessage(null);
    try {
      const res = await storageService.pushAllToSupabase();
      if (res.success) {
        setActionMessage({
          type: 'success',
          text: `Success! Pushed all ${res.syncedCount} records across Wings, Notices, Events, Sliders, Gallery, CV Applications, and Settings to your Supabase account!`,
        });
      } else {
        setActionMessage({
          type: 'error',
          text: `Synced ${res.syncedCount} items. Note: Some tables in Supabase need to be created first using the SQL script below: ${res.errors[0]}`,
        });
      }
    } catch (e: any) {
      setActionMessage({
        type: 'error',
        text: `Error syncing data: ${e?.message || 'Check network connection'}`,
      });
    } finally {
      setIsPushing(false);
      checkConnection();
    }
  };

  const handlePullAllData = async () => {
    setIsPulling(true);
    setActionMessage(null);
    try {
      const res = await storageService.syncFromSupabase();
      setActionMessage({
        type: 'success',
        text: res.message,
      });
      onRefresh();
    } catch (e: any) {
      setActionMessage({
        type: 'error',
        text: `Error pulling from Supabase: ${e?.message || 'Failed to fetch'}`,
      });
    } finally {
      setIsPulling(false);
      checkConnection();
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleExportFullBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      supabaseProjectId: SUPABASE_PROJECT_ID,
      institution: 'VISHWA VINAYAK TRUST GROUP OF INSTITUTIONS',
      wings: storageService.getWings(),
      experts: storageService.getExperts(),
      sliders: storageService.getSliders(),
      notices: storageService.getNotices(),
      events: storageService.getEvents(),
      gallery: storageService.getAlbums(),
      applications: storageService.getApplications(),
      enquiries: storageService.getEnquiries(),
      settings: storageService.getSettings(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VVT_Complete_Database_Backup_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableList = [
    {
      name: SUPABASE_TABLES.WINGS,
      label: 'Academic Wings (VVDC, VVHSS, etc.)',
      description: 'Stores institution wings, courses, principal info, facilities, and contact details',
      localCount: storageService.getWings().length,
    },
    {
      name: SUPABASE_TABLES.EXPERTS,
      label: 'Faculty & Academic Experts',
      description: 'Stores professor profiles, qualifications, research specializations, and photos',
      localCount: storageService.getExperts().length,
    },
    {
      name: SUPABASE_TABLES.NOTICES,
      label: 'Notices & Circulars',
      description: 'Stores official notifications, categories, exam dates, and PDF attachments',
      localCount: storageService.getNotices().length,
    },
    {
      name: SUPABASE_TABLES.EVENTS,
      label: 'Events & Activities',
      description: 'Stores Vinayakotsav, science exhibitions, sports meets, and dates',
      localCount: storageService.getEvents().length,
    },
    {
      name: SUPABASE_TABLES.APPLICATIONS,
      label: 'Career Applications & Uploaded CVs',
      description: 'User details submitted through public portal with resumes and recruitment status',
      localCount: storageService.getApplications().length,
    },
    {
      name: SUPABASE_TABLES.ENQUIRIES,
      label: 'Contact Enquiries',
      description: 'Prospective student messages and parent queries sent from contact page',
      localCount: storageService.getEnquiries().length,
    },
    {
      name: SUPABASE_TABLES.SLIDERS,
      label: 'Homepage Hero Sliders',
      description: 'Hero banners, headings, descriptions, and CTA action buttons',
      localCount: storageService.getSliders().length,
    },
    {
      name: SUPABASE_TABLES.GALLERY,
      label: 'Photo Gallery Albums',
      description: 'Campus photographs categorized by wing and event',
      localCount: storageService.getAlbums().length,
    },
    {
      name: SUPABASE_TABLES.SETTINGS,
      label: 'Website CMS & SEO Settings',
      description: 'Trust addresses, phone numbers, welcome text, mission, vision, and meta tags',
      localCount: 1,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Database className="w-6 h-6 text-emerald-400" />
            <span>Supabase Cloud Database Storage</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connected to Supabase Project: <code className="text-amber-400 font-mono font-bold">{SUPABASE_PROJECT_ID}</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={checkConnection}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${connectionStatus.loading ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>

          <button
            onClick={handleExportFullBackup}
            className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Download full JSON backup of all tables"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Expert (Full Backup)</span>
          </button>

          <a
            href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Status & Action Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-heading text-lg font-bold text-white">
                Supabase Connection Active
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700">
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {connectionStatus.message}
            </p>
          </div>

          {/* Quick sync buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePushAllData}
              disabled={isPushing}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isPushing ? 'Syncing to Supabase...' : 'Push All Data to Supabase'}</span>
            </button>

            <button
              onClick={handlePullAllData}
              disabled={isPulling}
              className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
            >
              <DownloadCloud className="w-4 h-4 text-emerald-400" />
              <span>{isPulling ? 'Fetching...' : 'Pull Latest from Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Feedback message banner */}
        {actionMessage && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium flex items-start gap-2.5 border ${
              actionMessage.type === 'success'
                ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
                : 'bg-amber-950 border-amber-700 text-amber-200'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            )}
            <div className="leading-relaxed">{actionMessage.text}</div>
          </div>
        )}

        {/* Credentials Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Project ID</span>
            <code className="text-amber-400 font-mono text-xs">{SUPABASE_PROJECT_ID}</code>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Supabase Endpoint</span>
            <code className="text-slate-200 text-[11px] truncate block">{SUPABASE_URL}</code>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Publishable API Key</span>
            <code className="text-slate-200 text-[11px] truncate block">
              {SUPABASE_ANON_KEY.substring(0, 24)}••••••••••
            </code>
          </div>
        </div>
      </div>

      {/* Cloud Tables Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Supabase Cloud Tables Inspector</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live status and record counts between local state and your Supabase PostgreSQL database
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                <th className="py-3 px-4">Table Name</th>
                <th className="py-3 px-4">Module / Entity</th>
                <th className="py-3 px-4">Local Records</th>
                <th className="py-3 px-4">Supabase Cloud Records</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {tableList.map((t) => {
                const cloudCount = tableCounts[t.name];
                const isReady = cloudCount !== 'Pending Table' && cloudCount !== undefined;
                return (
                  <tr key={t.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {t.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-xs">{t.label}</p>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {t.description}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      {t.localCount} records
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {cloudCount !== undefined ? (
                        cloudCount === 'Pending Table' ? (
                          <span className="text-amber-400 text-[11px] font-semibold">
                            Pending SQL Setup
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold">{cloudCount} rows</span>
                        )
                      ) : (
                        <span className="text-slate-500">Checking...</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isReady
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {isReady ? 'Active' : 'Setup Required'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Setup Schema Assistant */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Supabase SQL Setup Script & Policies</span>
            </h3>
            <p className="text-xs text-slate-400">
              Run this SQL script in your Supabase SQL Editor to create all 10 tables and Row Level Security policies with 1 click
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow transition-all"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
            </button>

            <button
              onClick={() => setShowSqlCode(!showSqlCode)}
              className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {showSqlCode ? 'Hide SQL Code' : 'View SQL Code'}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Direct Supabase SQL Editor link for project <strong className="text-white">{SUPABASE_PROJECT_ID}</strong>:
            </span>
          </div>
          <a
            href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:underline flex items-center gap-1 font-bold shrink-0"
          >
            <span>Open Supabase SQL Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {showSqlCode && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300 max-h-96 overflow-y-auto whitespace-pre">
            {SUPABASE_SQL_SCHEMA}
          </div>
        )}
      </div>
    </div>
  );
};

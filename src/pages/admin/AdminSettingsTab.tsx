import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { storageService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import {
  testSupabaseConnection,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SQL_SCHEMA,
} from '../../services/supabaseClient';
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle,
  Globe,
  Share2,
  Building,
  Sparkles,
  Database,
  RefreshCw,
  UploadCloud,
  Check,
  Copy,
  ExternalLink,
  Code,
  AlertCircle,
  X,
} from 'lucide-react';

interface AdminSettingsTabProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onRefresh,
}) => {
  const { currentAdmin, isSuperAdmin } = useAuth();
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Supabase states
  const [supabaseStatus, setSupabaseStatus] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
    tablesFound: string[];
  }>({
    tested: false,
    connected: false,
    message: 'Testing connection to Supabase...',
    tablesFound: [],
  });
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<string | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);

  useEffect(() => {
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    const res = await testSupabaseConnection();
    setSupabaseStatus({
      tested: true,
      connected: res.connected,
      message: res.message,
      tablesFound: res.tablesFound,
    });
  };

  const handlePushAllToSupabase = async () => {
    setIsPushing(true);
    setPushResult(null);
    try {
      const res = await storageService.pushAllToSupabase();
      if (res.success) {
        setPushResult(`Success! Synced ${res.syncedCount} records to Supabase tables.`);
      } else {
        setPushResult(
          `Synced ${res.syncedCount} records. (${res.errors.length} tables pending SQL schema setup: ${res.errors[0]})`
        );
      }
    } catch (e: any) {
      setPushResult(`Sync error: ${e?.message || 'Check Supabase table permissions'}`);
    } finally {
      setIsPushing(false);
      handleTestConnection();
    }
  };

  const handlePullFromSupabase = async () => {
    const res = await storageService.syncFromSupabase();
    alert(res.message);
    onRefresh();
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateSettings(formData, currentAdmin || undefined);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const handleResetDefaults = () => {
    if (
      !window.confirm(
        'Reset all trust data (wings, notices, events, sliders, settings) to sample factory defaults?'
      )
    ) {
      return;
    }
    storageService.resetToDefaults();
    onRefresh();
    alert('System data reset to initial official state.');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-white">
            Website CMS, Database & SEO Settings
          </h2>
          <p className="text-xs text-slate-400">
            Control dynamic institution branding, Supabase database synchronization, and metadata
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleResetDefaults}
              className="cursor-pointer px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1.5 border border-red-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="cursor-pointer px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save All CMS Settings</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Website content and settings successfully updated and live!</span>
        </div>
      )}

      {/* Supabase Integration Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-bold text-white">
                  Supabase Cloud Database Storage
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Project ID: <code className="text-amber-400 font-mono">{SUPABASE_PROJECT_ID}</code>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Connection</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSqlModal(true)}
              className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>SQL Schema</span>
            </button>

            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <span>Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Connection status banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                supabaseStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-medium">{supabaseStatus.message}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isPushing}
              onClick={handlePushAllToSupabase}
              className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{isPushing ? 'Syncing to Supabase...' : 'Push All Data to Supabase'}</span>
            </button>

            <button
              type="button"
              onClick={handlePullFromSupabase}
              className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Pull from Supabase
            </button>
          </div>
        </div>

        {pushResult && (
          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300 font-medium">
            {pushResult}
          </div>
        )}

        {/* Supabase Configuration Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Supabase URL</span>
            <code className="text-slate-200 text-[11px] break-all">{SUPABASE_URL}</code>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">API Anon Key</span>
            <code className="text-slate-200 text-[11px] truncate block">
              {SUPABASE_ANON_KEY.substring(0, 24)}••••••••••
            </code>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
        {/* Basic Brand Info */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-400" />
            <span>Institution Identity & Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Institution Name</label>
              <input
                type="text"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Address Line</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">District & State</label>
              <input
                type="text"
                value={`${formData.district}, ${formData.state}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setFormData({
                    ...formData,
                    district: parts[0]?.trim() || formData.district,
                    state: parts[1]?.trim() || formData.state,
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">PIN Code</label>
              <input
                type="text"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Official Phone Numbers (Comma separated)
              </label>
              <input
                type="text"
                value={formData.phones.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phones: e.target.value.split(',').map((p) => p.trim()),
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Official Email Desk</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Welcome & Intro Texts */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Homepage Welcome & About Information</span>
          </h3>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Welcome Section Heading</label>
            <input
              type="text"
              value={formData.welcomeHeading}
              onChange={(e) => setFormData({ ...formData, welcomeHeading: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Welcome Introduction Text
            </label>
            <textarea
              rows={4}
              value={formData.welcomeText}
              onChange={(e) => setFormData({ ...formData, welcomeText: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Trust Mission</label>
              <textarea
                rows={3}
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Trust Vision</label>
              <textarea
                rows={3}
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Official Social Media Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={formData.socialLinks.youtube}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">X / Twitter Handle</label>
              <input
                type="text"
                value={formData.socialLinks.twitter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Search Engine Optimization (SEO) & Meta Tags</span>
          </h3>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Default Page Title</label>
            <input
              type="text"
              value={formData.seo.pageTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, pageTitle: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Meta Description</label>
            <textarea
              rows={2}
              value={formData.seo.metaDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaDescription: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Meta Keywords</label>
            <input
              type="text"
              value={formData.seo.metaKeywords}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaKeywords: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="cursor-pointer px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            Save CMS & SEO Settings
          </button>
        </div>
      </form>

      {/* Supabase SQL Migration Script Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col text-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Supabase Project: {SUPABASE_PROJECT_ID}
                </span>
                <h3 className="font-heading text-base font-bold text-white">
                  PostgreSQL Schema & Security Policies
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="cursor-pointer px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSqlModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Paste this into your Supabase Dashboard SQL Editor & click "RUN":</span>
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Open Supabase SQL Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] text-emerald-300 bg-slate-950/90 whitespace-pre">
              {SUPABASE_SQL_SCHEMA}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { resultService } from '../services/resultStorage';
import {
  ResultSearchLog,
  DailySearchMetric,
  PublicationTrendMetric,
  ExaminationRecord,
  StudentResultRecord,
} from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Search,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Filter,
  RefreshCw,
  Eye,
  FileCheck2,
  Sparkles,
  Users,
  Activity,
  Layers,
  ArrowUpRight,
  Download,
} from 'lucide-react';

interface ResultStatisticsPanelProps {
  onNavigateSubTab?: (tab: string) => void;
}

export const ResultStatisticsPanel: React.FC<ResultStatisticsPanelProps> = ({
  onNavigateSubTab,
}) => {
  const [searchLogs, setSearchLogs] = useState<ResultSearchLog[]>([]);
  const [dailySearchMetrics, setDailySearchMetrics] = useState<DailySearchMetric[]>([]);
  const [publicationTrends, setPublicationTrends] = useState<PublicationTrendMetric[]>([]);
  const [examinations, setExaminations] = useState<ExaminationRecord[]>([]);
  const [results, setResults] = useState<StudentResultRecord[]>([]);

  // Time range filters
  const [searchTimeRange, setSearchTimeRange] = useState<7 | 14 | 30>(7);
  const [publicationTimeRange, setPublicationTimeRange] = useState<7 | 14 | 30>(14);
  const [searchFilterStatus, setSearchFilterStatus] = useState<'all' | 'success' | 'failed'>('all');
  const [searchLogSearchQuery, setSearchLogSearchQuery] = useState('');

  // Refresh handler
  const loadData = () => {
    resultService.init();
    setSearchLogs(resultService.getSearchLogs());
    setDailySearchMetrics(resultService.getDailySearchMetrics(searchTimeRange));
    setPublicationTrends(resultService.getPublicationTrends(publicationTimeRange));
    setExaminations(resultService.getExaminations());
    setResults(resultService.getResults());
  };

  useEffect(() => {
    loadData();
  }, [searchTimeRange, publicationTimeRange]);

  // Totals & KPI metrics
  const totalSearches = searchLogs.length;
  const successfulSearches = searchLogs.filter((l) => l.success).length;
  const failedSearches = totalSearches - successfulSearches;
  const successRate = totalSearches > 0 ? ((successfulSearches / totalSearches) * 100).toFixed(1) : '0';

  const totalPublishedResults = results.filter((r) => r.publicationStatus === 'published').length;
  const totalDraftResults = results.filter((r) => r.publicationStatus !== 'published').length;
  const publishedExamsCount = examinations.filter((e) => e.publicationStatus === 'published').length;

  // Recent 24h search volume
  const now = new Date().getTime();
  const searchesLast24h = searchLogs.filter(
    (l) => now - new Date(l.timestamp).getTime() <= 24 * 60 * 60 * 1000
  ).length;

  // Breakdown of Search Status Reasons for Donut
  const searchReasonPieData = useMemo(() => {
    const successCount = searchLogs.filter((l) => l.success).length;
    const notFoundCount = searchLogs.filter((l) => l.statusReason === 'NOT_FOUND').length;
    const unpublishedCount = searchLogs.filter((l) => l.statusReason === 'UNPUBLISHED').length;
    const mismatchCount = searchLogs.filter((l) => l.statusReason === 'EXAM_MISMATCH').length;

    const list = [
      { name: 'Successful Matches', value: successCount, color: '#10b981' },
      { name: 'Roll Not Found', value: notFoundCount, color: '#ef4444' },
      { name: 'Unpublished / Draft', value: unpublishedCount, color: '#f59e0b' },
      { name: 'Session Mismatch', value: mismatchCount, color: '#6366f1' },
    ];
    return list.filter((item) => item.value > 0);
  }, [searchLogs]);

  // Filtered Search Logs Table
  const filteredSearchLogs = useMemo(() => {
    return searchLogs.filter((log) => {
      const matchesQuery =
        !searchLogSearchQuery ||
        log.rollNumber.toLowerCase().includes(searchLogSearchQuery.toLowerCase()) ||
        (log.studentName && log.studentName.toLowerCase().includes(searchLogSearchQuery.toLowerCase())) ||
        (log.className && log.className.toLowerCase().includes(searchLogSearchQuery.toLowerCase()));

      const matchesStatus =
        searchFilterStatus === 'all' ||
        (searchFilterStatus === 'success' && log.success) ||
        (searchFilterStatus === 'failed' && !log.success);

      return matchesQuery && matchesStatus;
    });
  }, [searchLogs, searchLogSearchQuery, searchFilterStatus]);

  // Custom Tooltip for Daily Search Volume Chart
  const CustomDailySearchTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
      return (
        <div className="bg-slate-950/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs min-w-[200px]">
          <p className="font-heading font-bold text-white border-b border-slate-800 pb-1.5 mb-2">
            📅 {label}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Successful Searches:
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {payload.find((p: any) => p.dataKey === 'successfulSearches')?.value || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Not Found Searches:
              </span>
              <span className="font-mono font-bold text-rose-400">
                {payload.find((p: any) => p.dataKey === 'notFoundSearches')?.value || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Unpublished Hits:
              </span>
              <span className="font-mono font-bold text-amber-400">
                {payload.find((p: any) => p.dataKey === 'unpublishedSearches')?.value || 0}
              </span>
            </div>
            <div className="border-t border-slate-800 pt-1.5 mt-1 flex items-center justify-between font-bold">
              <span className="text-slate-400">Total Queries:</span>
              <span className="text-amber-400 font-mono">{total} queries</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Publication Trends Chart
  const CustomPublicationTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const publishedCount = payload.find((p: any) => p.dataKey === 'publishedCount')?.value || 0;
      const cumulative = payload.find((p: any) => p.dataKey === 'cumulativePublished')?.value || 0;
      return (
        <div className="bg-slate-950/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs min-w-[210px]">
          <p className="font-heading font-bold text-white border-b border-slate-800 pb-1.5 mb-2">
            📅 Date: {label}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Published On Date:
              </span>
              <span className="font-mono font-bold text-amber-400">+{publishedCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                Cumulative Live:
              </span>
              <span className="font-mono font-bold text-blue-400">{cumulative} records</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Panel Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                Telemetry & Analytics
              </span>
              <span className="text-xs text-slate-400">• Real-Time Aggregation</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-black text-white">
              Student Result Search Volume & Publication Trends
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Monitor daily candidate search traffic, query resolution efficiency, and publication rollout progression powered by Recharts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-sm"
              title="Refresh telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
            {onNavigateSubTab && (
              <button
                onClick={() => onNavigateSubTab('publish')}
                className="cursor-pointer px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Publication Controls</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Searches */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Searches
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading text-2xl font-black text-white mt-2">
            {totalSearches}
          </p>
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{searchesLast24h} in last 24h</span>
          </span>
        </div>

        {/* Successful Matches */}
        <div className="bg-slate-900 border border-emerald-900/40 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Successful Matches
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading text-2xl font-black text-emerald-400 mt-2">
            {successfulSearches}
          </p>
          <span className="text-[11px] text-emerald-500/70 font-medium">
            {successRate}% Resolution Rate
          </span>
        </div>

        {/* Unresolved / Missing */}
        <div className="bg-slate-900 border border-rose-900/40 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
              Unresolved Hits
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading text-2xl font-black text-rose-400 mt-2">
            {failedSearches}
          </p>
          <span className="text-[11px] text-rose-500/70 font-medium">
            Not found / Unpublished
          </span>
        </div>

        {/* Published Results Count */}
        <div className="bg-slate-900 border border-amber-900/40 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Live Published
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading text-2xl font-black text-amber-400 mt-2">
            {totalPublishedResults}
          </p>
          <span className="text-[11px] text-amber-500/70 font-medium">
            Publicly searchable
          </span>
        </div>

        {/* Pending Approval / Draft */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Draft Results
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading text-2xl font-black text-white mt-2">
            {totalDraftResults}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            Awaiting announcement
          </span>
        </div>

        {/* Active Published Exams */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Published Exams
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-heading text-2xl font-black text-white mt-2">
            {publishedExamsCount} / {examinations.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            Active sessions
          </span>
        </div>
      </div>

      {/* Main Charts Row: 1. Daily Search Volume & 2. Publication Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: DAILY SEARCH VOLUME (Stacked Bar / Area) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-base text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400" />
                    <span>Daily Result Search Volume</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase">
                    Live Queries
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Daily distribution of public portal queries broken down by outcome status.
                </p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-xl text-[11px]">
                {([7, 14, 30] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setSearchTimeRange(days)}
                    className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition-all ${
                      searchTimeRange === days
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Bar Chart Container */}
            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailySearchMetrics}
                  margin={{ top: 15, right: 15, left: -20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="dayLabel"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomDailySearchTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '8px' }}
                    formatter={(value) => (
                      <span className="text-[11px] text-slate-300 font-medium">{value}</span>
                    )}
                  />
                  <Bar
                    dataKey="successfulSearches"
                    name="Successful Match"
                    stackId="a"
                    fill="#10b981"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="unpublishedSearches"
                    name="Unpublished / Draft"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="notFoundSearches"
                    name="Not Found"
                    stackId="a"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Peak Daily Traffic</span>
              <span className="font-heading font-black text-white text-sm">
                {Math.max(...dailySearchMetrics.map((m) => m.totalSearches), 0)} queries
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Avg Daily Searches</span>
              <span className="font-heading font-black text-amber-400 text-sm">
                {dailySearchMetrics.length > 0
                  ? (
                      dailySearchMetrics.reduce((a, b) => a + b.totalSearches, 0) /
                      dailySearchMetrics.length
                    ).toFixed(1)
                  : '0'}
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Resolution Ratio</span>
              <span className="font-heading font-black text-emerald-400 text-sm">
                {successRate}%
              </span>
            </div>
          </div>
        </div>

        {/* CHART 2: PUBLICATION TRENDS (Area / Line Chart) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-base text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span>Publication Trends & Release Velocity</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-bold text-blue-400 uppercase">
                    Cumulative Growth
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Timeline of published student marks sheets released across board sessions.
                </p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-xl text-[11px]">
                {([7, 14, 30] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setPublicationTimeRange(days)}
                    className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition-all ${
                      publicationTimeRange === days
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart Container */}
            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={publicationTrends}
                  margin={{ top: 15, right: 15, left: -20, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorDailyPub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="dayLabel"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomPublicationTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '8px' }}
                    formatter={(value) => (
                      <span className="text-[11px] text-slate-300 font-medium">{value}</span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativePublished"
                    name="Cumulative Published Results"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCumulative)"
                  />
                  <Area
                    type="monotone"
                    dataKey="publishedCount"
                    name="Daily Released Marksheets"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDailyPub)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Publication Metrics Footer */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Total Live Marksheets</span>
              <span className="font-heading font-black text-blue-400 text-sm">
                {totalPublishedResults} records
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Published Sessions</span>
              <span className="font-heading font-black text-white text-sm">
                {publishedExamsCount} of {examinations.length} Exams
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Publication Ratio</span>
              <span className="font-heading font-black text-amber-400 text-sm">
                {results.length > 0
                  ? ((totalPublishedResults / results.length) * 100).toFixed(1)
                  : '0'}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Insights Row: Donut Chart & Search Log Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Outcome Breakdown Donut Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800/80 pb-3 mb-4">
              <h3 className="font-heading font-black text-base text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <span>Search Resolution Breakdown</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Proportion of student queries categorized by verification outcome.
              </p>
            </div>

            {/* Donut Chart */}
            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={searchReasonPieData}
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {searchReasonPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} searches`, name]}
                    contentStyle={{
                      backgroundColor: '#020617',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend Items List */}
          <div className="space-y-2 border-t border-slate-800/80 pt-3">
            {searchReasonPieData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/70 border border-slate-800/80"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-bold">{item.value}</span>
                  <span className="text-[10px] text-slate-500">
                    ({totalSearches > 0 ? ((item.value / totalSearches) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Search Audit Stream Table (2 columns wide) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
              <div>
                <h3 className="font-heading font-black text-base text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Real-Time Search Activity Log</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Detailed transaction logs of public student inquiries and status determinations.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchLogSearchQuery}
                    onChange={(e) => setSearchLogSearchQuery(e.target.value)}
                    placeholder="Search roll, name..."
                    className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-xl text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSearchFilterStatus('all')}
                    className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition-all ${
                      searchFilterStatus === 'all'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchFilterStatus('success')}
                    className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition-all ${
                      searchFilterStatus === 'success'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Success
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchFilterStatus('failed')}
                    className={`cursor-pointer px-2.5 py-1 rounded-lg font-bold transition-all ${
                      searchFilterStatus === 'failed'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Failed
                  </button>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] sticky top-0 bg-slate-900 z-10">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Student Matched</th>
                    <th className="py-2.5 px-3">Session / Class</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredSearchLogs.slice(0, 8).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleDateString()}{' '}
                        <span className="text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                        {log.rollNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        {log.studentName ? (
                          <span className="font-bold text-white">{log.studentName}</span>
                        ) : (
                          <span className="text-slate-500 italic">Unidentified candidate</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {log.className || log.examinationType || 'General Search'}
                      </td>
                      <td className="py-2.5 px-3">
                        {log.success ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Matched</span>
                          </span>
                        ) : log.statusReason === 'UNPUBLISHED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Unpublished</span>
                          </span>
                        ) : log.statusReason === 'EXAM_MISMATCH' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                            <Filter className="w-3 h-3" />
                            <span>Session Mismatch</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            <XCircle className="w-3 h-3" />
                            <span>Not Found</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredSearchLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                        No search logs match the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>Showing latest {Math.min(filteredSearchLogs.length, 8)} of {filteredSearchLogs.length} logged queries</span>
            <span className="text-amber-400 font-mono font-bold">Encrypted Audit Trail Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

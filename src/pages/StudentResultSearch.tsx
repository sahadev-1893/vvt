import React, { useState, useEffect } from 'react';
import { resultService } from '../services/resultStorage';
import { StudentResultRecord, ExaminationRecord, ExaminationNotice } from '../types';
import { ResultDisplay } from '../components/ResultDisplay';
import {
  Search,
  Award,
  Calendar,
  BookOpen,
  Hash,
  AlertCircle,
  Clock,
  HelpCircle,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  RefreshCw,
  QrCode,
  ArrowRight,
} from 'lucide-react';

interface StudentResultSearchProps {
  onNavigate?: (path: string) => void;
}

export const StudentResultSearch: React.FC<StudentResultSearchProps> = ({ onNavigate }) => {
  const [examinations, setExaminations] = useState<ExaminationRecord[]>([]);
  const [notices, setNotices] = useState<ExaminationNotice[]>([]);

  // Search Form State
  const [selectedExamType, setSelectedExamType] = useState<string>('Annual');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2025-2026');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [rollNumber, setRollNumber] = useState<string>('');

  // Verification Code State
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [searchMode, setSearchMode] = useState<'roll' | 'code'>('roll');

  // Search Feedback
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>('');
  const [searchStatusReason, setSearchStatusReason] = useState<string>('');
  const [foundResult, setFoundResult] = useState<StudentResultRecord | null>(null);

  useEffect(() => {
    resultService.init();
    setExaminations(resultService.getExaminations());
    setNotices(resultService.getNotices());
  }, []);

  const academicYears = ['2025-2026', '2024-2025'];
  const examTypes = ['Annual', 'Half-Yearly', 'Semester', 'Supplementary'];
  const classOptions = [
    'All',
    'Class 12th (Science)',
    'Class 12th (Arts)',
    'Class 12th (Commerce)',
    'Class 10th (Matric)',
    'B.Sc Computer Science',
  ];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError('');
    setSearchStatusReason('');
    setFoundResult(null);

    const cleanRoll = rollNumber.trim();
    if (!cleanRoll) {
      setSearchError('Please enter your Roll Number.');
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      const response = resultService.searchResult({
        examinationType: selectedExamType,
        academicYear: selectedAcademicYear,
        className: selectedClass,
        rollNumber: cleanRoll,
      });

      setIsSearching(false);

      if (response.success && response.result) {
        setFoundResult(response.result);
      } else {
        setSearchError(response.message);
        setSearchStatusReason(response.statusReason || '');
      }
    }, 300);
  };

  const handleVerifyByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setSearchStatusReason('');
    setFoundResult(null);

    const cleanCode = verificationCode.trim();
    if (!cleanCode) {
      setSearchError('Please enter a valid certificate Verification Code.');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const res = resultService.verifyResult(cleanCode);
      if (res) {
        if (res.publicationStatus !== 'published') {
          setSearchError('Result has not been published yet.');
          setSearchStatusReason('UNPUBLISHED');
        } else {
          setFoundResult(res);
        }
      } else {
        setSearchError('No result found. Please check your verification code.');
        setSearchStatusReason('NOT_FOUND');
      }
    }, 250);
  };

  const fillDemoRoll = (demoRoll: string, examType = 'Annual', year = '2025-2026', className = 'All') => {
    setSelectedExamType(examType);
    setSelectedAcademicYear(year);
    setSelectedClass(className);
    setRollNumber(demoRoll);
    setSearchError('');
    setFoundResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. Examination Banner */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>EXAMINATION RESULT PORTAL</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            ONLINE STUDENT RESULT PORTAL
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Search, View and Download Your Examination Result
          </p>

          {/* Announcement ticker notification */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-2.5 px-4 flex items-center gap-3 text-xs text-amber-200">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider shrink-0">
                Notice
              </span>
              <p className="truncate text-left text-slate-200">
                Annual Examination Results for Class 12th & 10th are officially declared. Certified PDF marksheets available for download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Search Console */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Switcher Tab */}
          <div className="flex border-b border-slate-200 bg-slate-50/60">
            <button
              onClick={() => {
                setSearchMode('roll');
                setSearchError('');
              }}
              className={`flex-1 py-3.5 px-6 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                searchMode === 'roll'
                  ? 'border-amber-600 text-slate-950 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-amber-600" />
              <span>SEARCH BY ROLL NUMBER</span>
            </button>

            <button
              onClick={() => {
                setSearchMode('code');
                setSearchError('');
              }}
              className={`flex-1 py-3.5 px-6 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                searchMode === 'code'
                  ? 'border-amber-600 text-slate-950 bg-white shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>VERIFY BY CERTIFICATE CODE</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {searchMode === 'roll' ? (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Examination Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Examination Type *
                    </label>
                    <select
                      value={selectedExamType}
                      onChange={(e) => setSelectedExamType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      {examTypes.map((type) => (
                        <option key={type} value={type}>
                          {type} Examination
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Academic Year */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Academic Year *
                    </label>
                    <select
                      value={selectedAcademicYear}
                      onChange={(e) => setSelectedAcademicYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      {academicYears.map((yr) => (
                        <option key={yr} value={yr}>
                          Session {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Class / Course */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Class / Course
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      {classOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Roll Number Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Roll Number *
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. 26SCI101"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white uppercase tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Row & Quick Demo Rolls */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Sample Rolls for Testing:</span>
                    <button
                      type="button"
                      onClick={() => fillDemoRoll('26SCI101', 'Annual', '2025-2026', 'Class 12th (Science)')}
                      className="cursor-pointer px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-[11px] font-bold text-slate-700 hover:text-amber-800"
                    >
                      26SCI101 (Pass/Topper)
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoRoll('26SCI103', 'Annual', '2025-2026', 'Class 12th (Science)')}
                      className="cursor-pointer px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-[11px] font-bold text-slate-700 hover:text-amber-800"
                    >
                      26SCI103 (Compartment)
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoRoll('26MAT201', 'Annual', '2025-2026', 'Class 10th (Matric)')}
                      className="cursor-pointer px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-[11px] font-bold text-slate-700 hover:text-amber-800"
                    >
                      26MAT201 (Matric)
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoRoll('26COM401', 'Half-Yearly', '2025-2026', 'Class 12th (Commerce)')}
                      className="cursor-pointer px-2 py-0.5 rounded-md bg-slate-100 hover:bg-red-100 text-[11px] font-bold text-slate-700 hover:text-red-800"
                      title="Demonstrates unpublished result notice"
                    >
                      26COM401 (Unpublished State)
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Searching Database...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>SEARCH RESULT</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Code Verification Form */
              <form onSubmit={handleVerifyByCode} className="space-y-4 max-w-xl mx-auto">
                <div className="text-center space-y-1">
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Verify Marksheet Authenticity
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter the verification code printed on the mark sheet document.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="e.g. VVT-2026-SCI-994101"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="cursor-pointer px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                  >
                    {isSearching ? 'Verifying...' : 'VERIFY'}
                  </button>
                </div>

                <div className="text-center text-[11px] text-slate-400">
                  Sample Code:{' '}
                  <button
                    type="button"
                    onClick={() => setVerificationCode('VVT-2026-SCI-994101')}
                    className="text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    VVT-2026-SCI-994101
                  </button>
                </div>
              </form>
            )}

            {/* Error States */}
            {searchError && (
              <div
                className={`mt-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200 ${
                  searchStatusReason === 'UNPUBLISHED'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    searchStatusReason === 'UNPUBLISHED' ? 'text-amber-600' : 'text-red-600'
                  }`}
                />
                <div className="space-y-1">
                  <p className="font-bold">{searchError}</p>
                  {searchStatusReason === 'UNPUBLISHED' && (
                    <p className="text-xs text-amber-700">
                      The examination authority has not yet published this result. Please check the official examination notices for the publication date.
                    </p>
                  )}
                  {searchStatusReason === 'NOT_FOUND' && (
                    <p className="text-xs text-red-700">
                      Please double-check your roll number and academic session against your examination admit card.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Marksheet Display Section */}
        {foundResult && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Result Located in Institutional Ledger</span>
              </span>
              <button
                onClick={() => setFoundResult(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Clear Search Result ×
              </button>
            </div>

            <ResultDisplay result={foundResult} onClose={() => setFoundResult(null)} />
          </div>
        )}

        {/* 4. Latest Examination Notices & Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Official Bulletins
                </span>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  Examination Notices & Circulars
                </h2>
              </div>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400 transition-colors space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-800">
                      {n.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{n.date}</span>
                  </div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-heading text-base font-bold text-white">
                  Instructions for Students
                </h3>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Keep your <strong>Admit Card</strong> ready before searching to ensure correct Roll Number.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Downloaded PDF marksheet is valid for provisional admissions and certificate verifications.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Candidates eligible for <strong>Compartment</strong> must apply for supplementary exams within 15 days.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    Original sealed certificates will be issued from the institution counter with valid student ID.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h4 className="font-heading text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Controller Helpdesk</span>
              </h4>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-800">+91 9437238689</span>
                    <span className="text-[11px] text-slate-400">Helpline Phone</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-800">exam@vvt.org.in</span>
                    <span className="text-[11px] text-slate-400">Examination Directorate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

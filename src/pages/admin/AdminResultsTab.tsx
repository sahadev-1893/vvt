import React, { useState, useEffect, useRef } from 'react';
import { resultService } from '../../services/resultStorage';
import {
  StudentRecord,
  ExaminationRecord,
  StudentResultRecord,
  ResultAuditRecord,
  SubjectMarkRecord,
  PublicationStatus,
} from '../../types';
import { MarksheetCard } from '../../components/MarksheetCard';
import {
  Search,
  Plus,
  Upload,
  FileSpreadsheet,
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  Calendar,
  Users,
  Award,
  Layers,
  Filter,
  RefreshCw,
  Printer,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Trophy,
  TrendingUp,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ResultStatisticsPanel } from '../../components/ResultStatisticsPanel';

interface AdminResultsTabProps {
  initialSubTab?: 'overview' | 'results' | 'bulk' | 'students' | 'publish' | 'reports' | 'statistics';
}

export const AdminResultsTab: React.FC<AdminResultsTabProps> = ({
  initialSubTab = 'overview',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'results' | 'bulk' | 'students' | 'publish' | 'reports' | 'grading' | 'add-single' | 'statistics'
  >(initialSubTab);

  // Data state
  const [results, setResults] = useState<StudentResultRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [examinations, setExaminations] = useState<ExaminationRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<ResultAuditRecord[]>([]);

  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState('All');
  const [filterClass, setFilterClass] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); // All, PASS, FAIL, COMPARTMENT
  const [filterPublication, setFilterPublication] = useState('All'); // All, published, draft

  // Modal / Preview state
  const [previewResult, setPreviewResult] = useState<StudentResultRecord | null>(null);
  const [editingResult, setEditingResult] = useState<StudentResultRecord | null>(null);

  // Student Form Modal state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [studentFormData, setStudentFormData] = useState<Partial<StudentRecord>>({
    studentName: '',
    rollNumber: '',
    registrationNumber: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '2008-01-01',
    gender: 'Male',
    className: 'Class 12th (Science)',
    section: 'A',
    academicYear: '2025-2026',
  });
  const [studentFormError, setStudentFormError] = useState('');

  // Bulk Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<{
    validRecords: StudentResultRecord[];
    errors: { row: number; rollNumber?: string; message: string }[];
    totalRows: number;
  } | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  // Manual Result Form State
  const [manualResult, setManualResult] = useState<{
    studentName: string;
    rollNumber: string;
    registrationNumber: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    className: string;
    section: string;
    academicYear: string;
    examinationId: string;
    publicationStatus: PublicationStatus;
    subjects: {
      code: string;
      name: string;
      fullMarks: number;
      passMarks: number;
      obtained: number;
    }[];
  }>({
    studentName: '',
    rollNumber: '',
    registrationNumber: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '2008-01-01',
    className: 'Class 12th (Science)',
    section: 'A',
    academicYear: '2025-2026',
    examinationId: 'exam-annual-2026',
    publicationStatus: 'published',
    subjects: [
      { code: 'ENG-12', name: 'Compulsory English', fullMarks: 100, passMarks: 33, obtained: 75 },
      { code: 'PHY-12', name: 'Physics', fullMarks: 100, passMarks: 33, obtained: 82 },
      { code: 'CHE-12', name: 'Chemistry', fullMarks: 100, passMarks: 33, obtained: 78 },
      { code: 'MTH-12', name: 'Mathematics', fullMarks: 100, passMarks: 33, obtained: 88 },
    ],
  });

  const refreshData = () => {
    resultService.init();
    setResults(resultService.getResults());
    setStudents(resultService.getStudents());
    setExaminations(resultService.getExaminations());
    setAuditLogs(resultService.getAuditLogs());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Compute Overview Statistics
  const totalStudentsCount = students.length;
  const totalResultsCount = results.length;
  const publishedResultsCount = results.filter((r) => r.publicationStatus === 'published').length;
  const draftResultsCount = results.filter((r) => r.publicationStatus !== 'published').length;
  const passedCount = results.filter((r) => r.resultStatus === 'PASS').length;
  const failedCount = results.filter((r) => r.resultStatus === 'FAIL').length;
  const compartmentCount = results.filter((r) => r.resultStatus === 'COMPARTMENT').length;
  const passRate = totalResultsCount > 0 ? ((passedCount / totalResultsCount) * 100).toFixed(1) : '0';

  // Distinct Filter Lists
  const distinctClasses = Array.from(new Set(results.map((r) => r.className)));
  const distinctExams = Array.from(new Set(results.map((r) => r.examinationName)));

  // Visual Dashboard Exam Filter & View Mode
  const [selectedVisualExamId, setSelectedVisualExamId] = useState<string>('all');
  const [chartMetricMode, setChartMetricMode] = useState<'count' | 'percentage'>('count');

  // Auto-select first exam with results if available
  useEffect(() => {
    if (examinations.length > 0 && selectedVisualExamId === 'all') {
      const examWithResults = examinations.find((e) =>
        results.some((r) => r.examinationId === e.id)
      );
      if (examWithResults) {
        setSelectedVisualExamId(examWithResults.id);
      }
    }
  }, [examinations, results]);

  // Selected Examination Object
  const selectedVisualExam = examinations.find((e) => e.id === selectedVisualExamId);

  // Filter results for Visual Dashboard
  const visualResults = React.useMemo(() => {
    if (selectedVisualExamId === 'all') return results;
    return results.filter((r) => r.examinationId === selectedVisualExamId);
  }, [results, selectedVisualExamId]);

  const visualTotalStudents = visualResults.length;
  const visualPassed = visualResults.filter((r) => r.resultStatus === 'PASS').length;
  const visualFailed = visualResults.filter((r) => r.resultStatus === 'FAIL').length;
  const visualCompartment = visualResults.filter((r) => r.resultStatus === 'COMPARTMENT').length;
  const visualPassRate =
    visualTotalStudents > 0 ? ((visualPassed / visualTotalStudents) * 100).toFixed(1) : '0';
  const visualAvgPercentage =
    visualTotalStudents > 0
      ? (
          visualResults.reduce((acc, r) => acc + (r.percentage || 0), 0) / visualTotalStudents
        ).toFixed(1)
      : '0';

  // Topper / Top Scorer for selected examination
  const visualTopper = React.useMemo(() => {
    if (visualResults.length === 0) return null;
    return [...visualResults].sort((a, b) => (b.percentage || 0) - (a.percentage || 0))[0];
  }, [visualResults]);

  // Class-wise Pass / Fail Distribution Data
  const classDistributionData = React.useMemo(() => {
    const classMap: Record<
      string,
      {
        className: string;
        pass: number;
        fail: number;
        compartment: number;
        total: number;
        passRate: number;
        failRate: number;
      }
    > = {};

    visualResults.forEach((r) => {
      const cls = r.className || 'General';
      if (!classMap[cls]) {
        classMap[cls] = {
          className: cls,
          pass: 0,
          fail: 0,
          compartment: 0,
          total: 0,
          passRate: 0,
          failRate: 0,
        };
      }
      classMap[cls].total += 1;
      if (r.resultStatus === 'PASS') classMap[cls].pass += 1;
      else if (r.resultStatus === 'FAIL') classMap[cls].fail += 1;
      else if (r.resultStatus === 'COMPARTMENT') classMap[cls].compartment += 1;
    });

    return Object.values(classMap).map((item) => ({
      ...item,
      passRate: item.total > 0 ? Number(((item.pass / item.total) * 100).toFixed(1)) : 0,
      failRate: item.total > 0 ? Number(((item.fail / item.total) * 100).toFixed(1)) : 0,
    }));
  }, [visualResults]);

  // Top-Scoring Subjects Data for Selected Examination
  const topSubjectsData = React.useMemo(() => {
    const subjectMap: Record<
      string,
      {
        subjectCode: string;
        subjectName: string;
        totalObtained: number;
        totalFull: number;
        highestMarks: number;
        studentCount: number;
        passedCount: number;
      }
    > = {};

    visualResults.forEach((r) => {
      r.subjects?.forEach((s) => {
        const key = s.subjectCode || s.subjectName;
        if (!subjectMap[key]) {
          subjectMap[key] = {
            subjectCode: s.subjectCode || key,
            subjectName: s.subjectName || key,
            totalObtained: 0,
            totalFull: 0,
            highestMarks: 0,
            studentCount: 0,
            passedCount: 0,
          };
        }
        subjectMap[key].totalObtained += s.marksObtained;
        subjectMap[key].totalFull += s.fullMarks;
        if (s.marksObtained > subjectMap[key].highestMarks) {
          subjectMap[key].highestMarks = s.marksObtained;
        }
        subjectMap[key].studentCount += 1;
        if (s.marksObtained >= s.passMarks) {
          subjectMap[key].passedCount += 1;
        }
      });
    });

    return Object.values(subjectMap)
      .map((item) => {
        const avgMarks = item.studentCount > 0 ? item.totalObtained / item.studentCount : 0;
        const avgPercentage = item.totalFull > 0 ? (item.totalObtained / item.totalFull) * 100 : 0;
        const passRate = item.studentCount > 0 ? (item.passedCount / item.studentCount) * 100 : 0;

        return {
          code: item.subjectCode,
          name: item.subjectName.length > 20 ? item.subjectName.slice(0, 18) + '…' : item.subjectName,
          fullName: item.subjectName,
          avgScore: Number(avgMarks.toFixed(1)),
          avgPercentage: Number(avgPercentage.toFixed(1)),
          highestMarks: item.highestMarks,
          passRate: Number(passRate.toFixed(1)),
          studentCount: item.studentCount,
        };
      })
      .sort((a, b) => b.avgPercentage - a.avgPercentage);
  }, [visualResults]);

  // Pass / Fail / Compartment Donut Chart Data
  const statusPieData = React.useMemo(() => {
    const pass = visualResults.filter((r) => r.resultStatus === 'PASS').length;
    const fail = visualResults.filter((r) => r.resultStatus === 'FAIL').length;
    const comp = visualResults.filter((r) => r.resultStatus === 'COMPARTMENT').length;

    const data = [
      { name: 'Passed', value: pass, color: '#10b981' },
      { name: 'Failed', value: fail, color: '#ef4444' },
      { name: 'Compartment', value: comp, color: '#f59e0b' },
    ];
    return data.filter((d) => d.value > 0);
  }, [visualResults]);

  // Filtered Results
  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExam = filterExam === 'All' || r.examinationName === filterExam;
    const matchesClass = filterClass === 'All' || r.className === filterClass;
    const matchesStatus = filterStatus === 'All' || r.resultStatus === filterStatus;
    const matchesPublication =
      filterPublication === 'All' || r.publicationStatus === filterPublication;

    return matchesSearch && matchesExam && matchesClass && matchesStatus && matchesPublication;
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'All' || s.className === filterClass;
    return matchesSearch && matchesClass;
  });

  // Handle Save Student
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentFormError('');
    try {
      if (!studentFormData.studentName || !studentFormData.rollNumber) {
        setStudentFormError('Student Name and Roll Number are required.');
        return;
      }
      const record: StudentRecord = {
        id: editingStudent?.id || `std-${Date.now()}`,
        studentId: studentFormData.studentId || `VVT/${studentFormData.rollNumber}`,
        studentName: studentFormData.studentName,
        rollNumber: studentFormData.rollNumber,
        registrationNumber: studentFormData.registrationNumber || `REG-${studentFormData.rollNumber}`,
        fatherName: studentFormData.fatherName || "Father's Name",
        motherName: studentFormData.motherName || "Mother's Name",
        dateOfBirth: studentFormData.dateOfBirth || '2008-01-01',
        gender: studentFormData.gender || 'Male',
        className: studentFormData.className || 'Class 12th',
        section: studentFormData.section || 'A',
        academicYear: studentFormData.academicYear || '2025-2026',
        createdAt: editingStudent?.createdAt || new Date().toISOString(),
      };
      resultService.saveStudent(record, 'Administrator');
      refreshData();
      setShowStudentModal(false);
      setEditingStudent(null);
    } catch (err: any) {
      setStudentFormError(err.message || 'Error saving student record.');
    }
  };

  // Handle File Upload Parse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadFile(file);
    setUploadLoading(true);
    setUploadSuccessMessage('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        if (buffer) {
          const parsed = resultService.parseUploadFile(buffer as ArrayBuffer);
          setUploadPreview(parsed);
        }
      } catch (err) {
        alert('Failed to parse file. Please verify it is a valid CSV or XLSX file.');
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle Commit Bulk Results
  const handleCommitBulk = () => {
    if (!uploadPreview || uploadPreview.validRecords.length === 0) return;
    const count = resultService.commitBulkResults(uploadPreview.validRecords, 'Administrator');
    setUploadSuccessMessage(
      `Successfully imported ${count} student result sheets into the database!`
    );
    setUploadPreview(null);
    setUploadFile(null);
    refreshData();
  };

  // Handle Manual Result Submit
  const handleManualResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsList: SubjectMarkRecord[] = manualResult.subjects.map((s) => ({
      subjectCode: s.code,
      subjectName: s.name,
      fullMarks: s.fullMarks,
      passMarks: s.passMarks,
      marksObtained: s.obtained,
      grade: s.obtained >= s.passMarks ? 'A' : 'F',
      status: s.obtained >= s.passMarks ? 'Pass' : 'Fail',
    }));

    const examObj = examinations.find((ex) => ex.id === manualResult.examinationId);

    const record: StudentResultRecord = {
      id: `res-${Date.now()}`,
      studentId: `std-${manualResult.rollNumber}`,
      studentName: manualResult.studentName,
      rollNumber: manualResult.rollNumber,
      registrationNumber: manualResult.registrationNumber,
      fatherName: manualResult.fatherName,
      motherName: manualResult.motherName,
      dateOfBirth: manualResult.dateOfBirth,
      className: manualResult.className,
      section: manualResult.section,
      academicYear: manualResult.academicYear,
      examinationId: manualResult.examinationId,
      examinationName: examObj?.examinationName || 'Annual Examination',
      examinationType: examObj?.examinationType || 'Annual',
      subjects: subjectsList,
      totalFullMarks: 0,
      totalMarksObtained: 0,
      percentage: 0,
      grade: 'A',
      resultStatus: 'PASS',
      remarks: 'Manually verified statement of marks.',
      publicationStatus: manualResult.publicationStatus,
      verificationCode: `VVT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    resultService.saveResult(record, 'Administrator');
    refreshData();
    alert(`Result for ${record.studentName} saved successfully!`);
    setActiveSubTab('results');
  };

  // Tooltip for Class-wise Distribution Chart
  const CustomClassTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs min-w-[190px]">
          <p className="font-heading font-bold text-white border-b border-slate-800 pb-1 mb-2">
            {label}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Passed:
              </span>
              <span className="font-mono font-bold text-emerald-400">{data.pass} students</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Failed:
              </span>
              <span className="font-mono font-bold text-rose-400">{data.fail} students</span>
            </div>
            {data.compartment > 0 && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Compartment:
                </span>
                <span className="font-mono font-bold text-amber-400">{data.compartment} students</span>
              </div>
            )}
            <div className="border-t border-slate-800/80 pt-1.5 mt-1 flex items-center justify-between font-bold">
              <span className="text-slate-400">Class Pass Rate:</span>
              <span className="text-amber-400 font-mono">{data.passRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Tooltip for Top-Scoring Subjects Chart
  const CustomSubjectTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs min-w-[220px]">
          <div className="border-b border-slate-800 pb-1 mb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              {data.code}
            </span>
            <p className="font-heading font-bold text-white text-xs">{data.fullName}</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Average Percentage:</span>
              <span className="font-mono font-bold text-amber-400">{data.avgPercentage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Average Marks:</span>
              <span className="font-mono font-bold text-slate-200">{data.avgScore} pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Highest Mark:</span>
              <span className="font-mono font-bold text-emerald-400">{data.highestMarks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Subject Pass Rate:</span>
              <span className="font-mono font-bold text-blue-400">{data.passRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Evaluated Candidates:</span>
              <span className="font-mono font-bold text-slate-300">{data.studentCount}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
              Controller Portal
            </span>
            <span className="text-xs text-slate-400">• Database Synced</span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-black text-white mt-1">
            Student Result Publishing & Examination Control
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage student databases, bulk Excel/CSV marks uploads, publications, and certified marksheet issuing.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('bulk')}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Results</span>
          </button>

          <button
            onClick={() => {
              setEditingStudent(null);
              setStudentFormData({
                studentName: '',
                rollNumber: '',
                registrationNumber: '',
                fatherName: '',
                motherName: '',
                dateOfBirth: '2008-01-01',
                gender: 'Male',
                className: 'Class 12th (Science)',
                section: 'A',
                academicYear: '2025-2026',
              });
              setShowStudentModal(true);
            }}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation Bar */}
      <div className="flex space-x-1 sm:space-x-2 border-b border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Dashboard & Stats', icon: BarChart3 },
          { id: 'statistics', label: 'Result Statistics & Trends', icon: TrendingUp },
          { id: 'results', label: `Manage Results (${results.length})`, icon: Award },
          { id: 'bulk', label: 'Bulk Upload (Excel/CSV)', icon: FileSpreadsheet },
          { id: 'students', label: `Student Directory (${students.length})`, icon: Users },
          { id: 'publish', label: `Publication Controls (${examinations.length})`, icon: CheckCircle2 },
          { id: 'reports', label: 'Ledgers & Performance Reports', icon: FileText },
          { id: 'grading', label: 'Grading Rules & System', icon: Layers },
          { id: 'add-single', label: 'Manual Entry Form', icon: Plus },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: OVERVIEW DASHBOARD */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Students
              </span>
              <span className="font-heading text-xl sm:text-2xl font-black text-white mt-1 block">
                {totalStudentsCount}
              </span>
              <span className="text-[10px] text-slate-500">Registered records</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Results
              </span>
              <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 mt-1 block">
                {totalResultsCount}
              </span>
              <span className="text-[10px] text-slate-500">Subject mark sheets</span>
            </div>

            <div className="bg-slate-900 border border-emerald-900/40 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                Published Results
              </span>
              <span className="font-heading text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
                {publishedResultsCount}
              </span>
              <span className="text-[10px] text-emerald-500/70">Publicly searchable</span>
            </div>

            <div className="bg-slate-900 border border-amber-900/40 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Unpublished / Draft
              </span>
              <span className="font-heading text-xl sm:text-2xl font-black text-amber-400 mt-1 block">
                {draftResultsCount}
              </span>
              <span className="text-[10px] text-amber-500/70">Pending admin approval</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Examinations
              </span>
              <span className="font-heading text-xl sm:text-2xl font-black text-blue-400 mt-1 block">
                {examinations.length}
              </span>
              <span className="text-[10px] text-slate-500">Board sessions</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Pass Percentage
              </span>
              <span className="font-heading text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
                {passRate}%
              </span>
              <span className="text-[10px] text-slate-500">{passedCount} Passed, {failedCount} Failed</span>
            </div>
          </div>

          {/* VISUAL ANALYTICS & RECHARTS DASHBOARD FOR SELECTED EXAMINATION */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
            {/* Header & Examination Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30 shadow-inner shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-black text-white text-base sm:text-lg">
                      Visual Examination Analytics & Intelligence
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      Recharts Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Class-wise pass/fail distribution, top-scoring subjects, and academic performance telemetry.
                  </p>
                </div>
              </div>

              {/* Examination Selector Dropdown & Switcher */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Examination:</span>
                </label>
                <div className="relative min-w-[260px] sm:min-w-[300px]">
                  <select
                    value={selectedVisualExamId}
                    onChange={(e) => setSelectedVisualExamId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 hover:border-amber-500/60 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium shadow-inner focus:outline-none transition-colors"
                  >
                    <option value="all">All Examinations (Aggregated Institutional View)</option>
                    {examinations.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.examinationName} ({exam.academicYear} • {exam.examinationType})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Examination Context Pill Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-400 font-medium">Viewing Analytics for:</span>
                <span className="font-heading font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {selectedVisualExam ? selectedVisualExam.examinationName : 'All Consolidated Examinations'}
                </span>
                {selectedVisualExam && (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20">
                      {selectedVisualExam.academicYear}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                      {selectedVisualExam.examinationType} Exam
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold border ${
                        selectedVisualExam.publicationStatus === 'published'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      {selectedVisualExam.publicationStatus === 'published' ? '● Published' : '○ Draft / Unpublished'}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <span>Evaluated Candidates:</span>
                <span className="font-mono font-bold text-amber-400">{visualTotalStudents}</span>
              </div>
            </div>

            {/* Selected Exam Metric Cards Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Candidates Appeared
                  </span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-black text-white">
                    {visualTotalStudents}
                  </span>
                  <span className="text-[10px] text-slate-500">Students assessed</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-emerald-900/40 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Pass Percentage
                  </span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-black text-emerald-400">
                    {visualPassRate}%
                  </span>
                  <span className="text-[10px] text-emerald-500/80">
                    {visualPassed} Pass, {visualFailed} Fail
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 border border-amber-900/40 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Average Batch Score
                  </span>
                  <Percent className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-black text-amber-400">
                    {visualAvgPercentage}%
                  </span>
                  <span className="text-[10px] text-slate-500">Across all subjects</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-amber-500/30 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Examination Topper
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                {visualTopper ? (
                  <div className="mt-2 truncate">
                    <span className="font-heading font-bold text-white text-xs block truncate" title={visualTopper.studentName}>
                      {visualTopper.studentName}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      {visualTopper.percentage}% • {visualTopper.rollNumber}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 mt-2 block">No results recorded</span>
                )}
              </div>
            </div>

            {/* VISUAL CHARTS SECTION (2 COLUMNS) */}
            {visualTotalStudents > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. CLASS-WISE PASS/FAIL DISTRIBUTION */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-400" />
                          <span>Class-Wise Pass / Fail Distribution</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Student academic outcomes grouped by class and academic stream.
                        </p>
                      </div>

                      {/* Metric Toggle */}
                      <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[11px]">
                        <button
                          type="button"
                          onClick={() => setChartMetricMode('count')}
                          className={`cursor-pointer px-2.5 py-1 rounded-md font-bold transition-all ${
                            chartMetricMode === 'count'
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Headcount
                        </button>
                        <button
                          type="button"
                          onClick={() => setChartMetricMode('percentage')}
                          className={`cursor-pointer px-2.5 py-1 rounded-md font-bold transition-all ${
                            chartMetricMode === 'percentage'
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Pass Rate %
                        </button>
                      </div>
                    </div>

                    {/* Chart Container */}
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={classDistributionData}
                          margin={{ top: 15, right: 15, left: -15, bottom: 25 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis
                            dataKey="className"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            interval={0}
                            angle={-12}
                            textAnchor="end"
                          />
                          <YAxis
                            stroke="#64748b"
                            fontSize={11}
                            tickLine={false}
                            unit={chartMetricMode === 'percentage' ? '%' : ''}
                            allowDecimals={false}
                          />
                          <Tooltip content={<CustomClassTooltip />} />
                          <Legend
                            wrapperStyle={{ paddingTop: '8px' }}
                            formatter={(value) => (
                              <span className="text-[11px] text-slate-300 font-medium">{value}</span>
                            )}
                          />
                          {chartMetricMode === 'count' ? (
                            <>
                              <Bar dataKey="pass" name="Passed" fill="#10b981" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="fail" name="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                              {classDistributionData.some((c) => c.compartment > 0) && (
                                <Bar
                                  dataKey="compartment"
                                  name="Compartment"
                                  fill="#f59e0b"
                                  radius={[4, 4, 0, 0]}
                                />
                              )}
                            </>
                          ) : (
                            <>
                              <Bar dataKey="passRate" name="Pass Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="failRate" name="Fail Rate %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </>
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Class Summary Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 mt-2">
                    {classDistributionData.map((item) => (
                      <div
                        key={item.className}
                        className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-[11px]"
                      >
                        <span className="font-bold text-white block truncate" title={item.className}>
                          {item.className}
                        </span>
                        <div className="flex items-center justify-between text-slate-400 mt-1">
                          <span>Pass: {item.pass}/{item.total}</span>
                          <span className="font-mono font-bold text-amber-400">{item.passRate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. TOP-SCORING SUBJECTS (RANKED) */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span>Top-Scoring Subjects for Examination</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Ranked by average percentage score achieved across all candidates.
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                        {topSubjectsData.length} Subjects
                      </span>
                    </div>

                    {/* Chart Container */}
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topSubjectsData}
                          layout="vertical"
                          margin={{ top: 5, right: 25, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                          <XAxis
                            type="number"
                            domain={[0, 100]}
                            unit="%"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            width={110}
                          />
                          <Tooltip content={<CustomSubjectTooltip />} />
                          <Bar
                            dataKey="avgPercentage"
                            name="Average Score %"
                            radius={[0, 4, 4, 0]}
                          >
                            {topSubjectsData.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  index === 0
                                    ? '#fbbf24' // Gold
                                    : index === 1
                                    ? '#f59e0b' // Amber
                                    : index === 2
                                    ? '#d97706' // Warm Amber
                                    : '#6366f1' // Indigo
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top 3 Subject Podiums */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 mt-2">
                    {topSubjectsData.slice(0, 3).map((sub, idx) => (
                      <div
                        key={sub.code}
                        className={`p-2 rounded-xl border text-[11px] ${
                          idx === 0
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : idx === 1
                            ? 'bg-slate-900 border-amber-500/20 text-slate-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1 font-bold">
                          <span>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                          <span className="truncate" title={sub.fullName}>
                            {sub.fullName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                          <span>Avg: <strong className="text-amber-300">{sub.avgPercentage}%</strong></span>
                          <span>Max: <strong className="text-emerald-400">{sub.highestMarks}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state if examination has no records */
              <div className="bg-slate-950 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
                <div className="p-3 w-fit mx-auto rounded-full bg-slate-900 text-slate-500">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-white text-sm">
                  No Student Results Recorded for this Examination
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Upload results using the CSV/Excel bulk upload tab or add student marksheets to populate real-time performance analytics.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVisualExamId('all')}
                    className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
                  >
                    View All Examinations
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('bulk')}
                    className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
                  >
                    Bulk Upload Marks
                  </button>
                </div>
              </div>
            )}

            {/* Supplementary Donut Chart & Performance Insights Row */}
            {visualTotalStudents > 0 && statusPieData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl">
                {/* Donut Chart */}
                <div className="flex items-center justify-center gap-4 border-b md:border-b-0 md:border-r border-slate-800/80 pb-3 md:pb-0 md:pr-4">
                  <div className="h-[120px] w-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          innerRadius={36}
                          outerRadius={54}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value} students`, name]}
                          contentStyle={{
                            backgroundColor: '#020617',
                            borderColor: '#334155',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <span className="font-heading font-bold text-white block">Status Ratio</span>
                    {statusPieData.map((d) => (
                      <div key={d.name} className="flex items-center gap-2 text-slate-300 text-[11px]">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span>{d.name}:</span>
                        <span className="font-mono font-bold text-white">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Highlights */}
                <div className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-heading font-bold text-xs text-white">
                      Institutional Examination Summary & Recommendations
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {visualPassRate}% pass rate achieved across {classDistributionData.length} active academic branches in this evaluation session.
                      {topSubjectsData[0] ? ` ${topSubjectsData[0].fullName} demonstrates highest academic scoring with an average of ${topSubjectsData[0].avgPercentage}%.` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 mt-2">
                    <span className="text-[11px] text-slate-500">
                      Integrity verified with tamper-proof institutional ledger.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedVisualExam) {
                          setFilterExam(selectedVisualExam.examinationName);
                        } else {
                          setFilterExam('All');
                        }
                        setActiveSubTab('results');
                      }}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[11px] border border-amber-500/30 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Filtered Marksheets in Results Tab</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveSubTab('bulk')}
              className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all group"
            >
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-sm mt-3">
                Upload Student Results in Bulk
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Import CSV or Excel (.xlsx) marksheets with auto-validation and preview before committing.
              </p>
            </div>

            <div
              onClick={() => setActiveSubTab('publish')}
              className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all group"
            >
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-sm mt-3">
                Publication Controls
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Toggle live status for exams, approve pending marksheets, and schedule official declarations.
              </p>
            </div>

            <div
              onClick={() => setActiveSubTab('reports')}
              className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all group"
            >
              <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-white text-sm mt-3">
                Download Consolidated Ledgers
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Export class-wise marks ledgers and gazette sheets directly to Excel or printable PDF.
              </p>
            </div>
          </div>

          {/* Recent Audit Trail */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Examination Audit Trail & Integrity Log</span>
              </h3>
              <span className="text-xs text-slate-500">Immutable audit records</span>
            </div>

            <div className="space-y-2">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">
                      {log.action} • {log.recordType}
                    </span>
                    <p className="text-slate-300 font-medium mt-0.5">{log.details}</p>
                    <span className="text-[10px] text-slate-500">By {log.adminName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: RESULT STATISTICS & TRENDS */}
      {activeSubTab === 'statistics' && (
        <ResultStatisticsPanel onNavigateSubTab={(tab) => setActiveSubTab(tab as any)} />
      )}

      {/* SUB-TAB 2: MANAGE RESULTS */}
      {activeSubTab === 'results' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student, roll number, registration..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Class Filter */}
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
              >
                <option value="All">All Classes</option>
                {distinctClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
              >
                <option value="All">All Results</option>
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
                <option value="COMPARTMENT">COMPARTMENT</option>
              </select>

              {/* Publication Filter */}
              <select
                value={filterPublication}
                onChange={(e) => setFilterPublication(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
              >
                <option value="All">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft / Unpublished</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => resultService.exportResultsToExcel(filteredResults)}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={() => setActiveSubTab('add-single')}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Result</span>
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">%</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Result</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredResults.map((r) => {
                    const isPub = r.publicationStatus === 'published';
                    return (
                      <tr key={r.id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {r.rollNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          <div>{r.studentName}</div>
                          <span className="text-[10px] text-slate-500">{r.registrationNumber}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          <div>{r.className}</div>
                          <span className="text-[10px] text-slate-500">Sec: {r.section}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-white">
                          {r.totalMarksObtained} / {r.totalFullMarks}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-200">
                          {r.percentage.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-blue-400">
                          {r.grade}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.resultStatus === 'PASS'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : r.resultStatus === 'COMPARTMENT'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {r.resultStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              resultService.toggleResultPublication(
                                r.id,
                                isPub ? 'draft' : 'published',
                                'Administrator'
                              );
                              refreshData();
                            }}
                            className={`cursor-pointer px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              isPub
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                            }`}
                            title="Click to toggle publication"
                          >
                            {isPub ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setPreviewResult(r)}
                              className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Preview Marksheet"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete result for ${r.studentName}?`
                                  )
                                ) {
                                  resultService.deleteResult(r.id, 'Administrator');
                                  refreshData();
                                }
                              }}
                              className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-400"
                              title="Delete Result"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredResults.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No matching results found for current filters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BULK UPLOAD (EXCEL/CSV) */}
      {activeSubTab === 'bulk' && (
        <div className="space-y-6">
          {/* Instructions & Template Download Bar */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-white text-base">
                  Bulk Student Results Upload (.xlsx / .csv)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Download the formatted template, populate subject-wise marks, and upload. Results remain in draft until approved.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => resultService.downloadTemplate('xlsx')}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Excel Template</span>
                </button>

                <button
                  onClick={() => resultService.downloadTemplate('csv')}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV Template</span>
                </button>
              </div>
            </div>

            {/* Drop Zone Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-3xl p-8 text-center bg-slate-950/60 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileSpreadsheet className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="font-heading font-bold text-sm text-white">
                {uploadFile ? uploadFile.name : 'Click to select Excel (.xlsx) or CSV file to parse'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Auto-validates required columns, duplicate checks, and marks boundaries.
              </p>
            </div>
          </div>

          {/* Success Message */}
          {uploadSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{uploadSuccessMessage}</span>
            </div>
          )}

          {/* Validation & Preview Card */}
          {uploadPreview && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    Parsed Import Summary
                  </h4>
                  <p className="text-xs text-slate-400">
                    Total Rows: <strong>{uploadPreview.totalRows}</strong> | Valid Marksheets: <strong>{uploadPreview.validRecords.length}</strong> | Errors: <strong>{uploadPreview.errors.length}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setUploadPreview(null);
                      setUploadFile(null);
                    }}
                    className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleCommitBulk}
                    disabled={uploadPreview.validRecords.length === 0}
                    className="cursor-pointer px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50"
                  >
                    Confirm & Save {uploadPreview.validRecords.length} Results
                  </button>
                </div>
              </div>

              {/* Error messages if any */}
              {uploadPreview.errors.length > 0 && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800/80 space-y-2">
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Row Validation Errors ({uploadPreview.errors.length})</span>
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-1 text-xs text-red-300 font-mono">
                    {uploadPreview.errors.map((err, i) => (
                      <div key={i}>
                        Row {err.row}: {err.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Roll</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Subjects</th>
                      <th className="py-2.5 px-3 text-center">Score</th>
                      <th className="py-2.5 px-3 text-center">%</th>
                      <th className="py-2.5 px-3 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {uploadPreview.validRecords.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-850">
                        <td className="py-2 px-3 font-mono text-amber-400">{r.rollNumber}</td>
                        <td className="py-2 px-3 font-semibold text-white">{r.studentName}</td>
                        <td className="py-2 px-3 text-slate-400">{r.className}</td>
                        <td className="py-2 px-3 text-slate-400">{r.subjects.length} subjects</td>
                        <td className="py-2 px-3 text-center font-bold text-white">
                          {r.totalMarksObtained} / {r.totalFullMarks}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-200">
                          {r.percentage.toFixed(1)}%
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400">
                            {r.resultStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: MANAGE STUDENTS DIRECTORY */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students by name, roll, reg..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
              >
                <option value="All">All Classes</option>
                {distinctClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingStudent(null);
                setStudentFormData({
                  studentName: '',
                  rollNumber: '',
                  registrationNumber: '',
                  fatherName: '',
                  motherName: '',
                  dateOfBirth: '2008-01-01',
                  gender: 'Male',
                  className: 'Class 12th (Science)',
                  section: 'A',
                  academicYear: '2025-2026',
                });
                setShowStudentModal(true);
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Student</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Parents</th>
                  <th className="py-3 px-4">Class & Sec</th>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-850">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{s.rollNumber}</td>
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{s.studentName}</div>
                      <span className="text-[10px] text-slate-500">DOB: {s.dateOfBirth}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      <div>F: {s.fatherName}</div>
                      <div>M: {s.motherName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {s.className} (Sec: {s.section})
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{s.registrationNumber}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingStudent(s);
                            setStudentFormData({ ...s });
                            setShowStudentModal(true);
                          }}
                          className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete student record for ${s.studentName}?`)) {
                              resultService.deleteStudent(s.id, 'Administrator');
                              refreshData();
                            }
                          }}
                          className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PUBLICATION CONTROLS */}
      {activeSubTab === 'publish' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div>
              <h3 className="font-heading font-bold text-white text-base">
                Examination Publication Directorate
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle live public search visibility for examination sessions. Only published examinations appear in student search.
              </p>
            </div>

            <div className="space-y-3">
              {examinations.map((exam) => {
                const isPub = exam.publicationStatus === 'published';
                const examResultCount = results.filter((r) => r.examinationId === exam.id).length;

                return (
                  <div
                    key={exam.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isPub
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {isPub ? 'LIVE / PUBLISHED' : 'DRAFT / UNPUBLISHED'}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          Session: {exam.academicYear}
                        </span>
                      </div>

                      <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                        {exam.examinationName}
                      </h4>

                      <p className="text-xs text-slate-400">
                        Applicable Classes: {exam.classes.join(', ')} • {examResultCount} student marksheets assigned.
                      </p>

                      {exam.publishedAt && (
                        <p className="text-[11px] text-emerald-400">
                          Published on:{' '}
                          {new Date(exam.publishedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const nextStatus = isPub ? 'draft' : 'published';
                          resultService.toggleExaminationPublication(
                            exam.id,
                            nextStatus,
                            'Administrator'
                          );
                          refreshData();
                        }}
                        className={`cursor-pointer px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all ${
                          isPub
                            ? 'bg-red-900/80 hover:bg-red-800 text-red-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isPub ? 'UNPUBLISH RESULTS' : 'PUBLISH EXAMINATION RESULTS'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: REPORTS & LEDGERS */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-heading font-bold text-white text-base">
                  Consolidated Examination Gazette & Merit Ledgers
                </h3>
                <p className="text-xs text-slate-400">
                  Export complete class-wise tabulation registers with subject totals and grades.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => resultService.exportResultsToExcel(results)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Complete Excel Ledger</span>
                </button>
              </div>
            </div>

            {/* Class-wise Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {distinctClasses.map((cls) => {
                const classResults = results.filter((r) => r.className === cls);
                const classPass = classResults.filter((r) => r.resultStatus === 'PASS').length;
                const classRate =
                  classResults.length > 0
                    ? ((classPass / classResults.length) * 100).toFixed(1)
                    : '0';

                return (
                  <div key={cls} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-heading font-bold text-white text-xs block truncate">
                      {cls}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-amber-400">{classRate}%</span>
                      <span className="text-[11px] text-slate-400">Pass Rate</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {classPass} of {classResults.length} students passed
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: GRADING RULES & SYSTEM */}
      {activeSubTab === 'grading' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-heading font-bold text-white text-base">
                  Institutional Grading System & Evaluation Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure grade points, score boundaries, and criteria for Pass, Distinction, and Compartment.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('Grading matrix is active and verified by the Academic Council.')}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Save Grading Policy
                </button>
              </div>
            </div>

            {/* Grading Scale Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Score Range (%)</th>
                    <th className="py-3 px-4 text-center">Grade Point</th>
                    <th className="py-3 px-4">Classification & Academic Honors</th>
                    <th className="py-3 px-4">Result Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { grade: 'A+', range: '90% - 100%', points: '10.0', desc: 'Outstanding Merit / First Division with Distinction', status: 'PASS', color: 'text-emerald-400' },
                    { grade: 'A', range: '80% - 89%', points: '9.0', desc: 'Excellent / First Division with Distinction', status: 'PASS', color: 'text-emerald-400' },
                    { grade: 'B+', range: '70% - 79%', points: '8.0', desc: 'Very Good / First Division', status: 'PASS', color: 'text-blue-400' },
                    { grade: 'B', range: '60% - 69%', points: '7.0', desc: 'Good / First Division', status: 'PASS', color: 'text-blue-400' },
                    { grade: 'C', range: '50% - 59%', points: '6.0', desc: 'Fair / Second Division', status: 'PASS', color: 'text-amber-400' },
                    { grade: 'D', range: '33% - 49%', points: '4.0', desc: 'Satisfactory / Third Division', status: 'PASS', color: 'text-amber-400' },
                    { grade: 'F', range: 'Below 33%', points: '0.0', desc: 'Unsuccessful / Compartment or Back-paper', status: 'FAIL', color: 'text-red-400' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-850">
                      <td className={`py-3 px-4 font-black font-mono text-sm ${row.color}`}>{row.grade}</td>
                      <td className="py-3 px-4 font-semibold text-white">{row.range}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-300">{row.points}</td>
                      <td className="py-3 px-4 text-slate-300">{row.desc}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.status === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Threshold Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Pass Benchmark</span>
                <p className="font-heading font-black text-white text-lg">33% Per Subject</p>
                <p className="text-[11px] text-slate-500">Student must secure min. 33 marks out of 100 in each paper.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Compartment Policy</span>
                <p className="font-heading font-black text-amber-400 text-lg">Single Paper Failure</p>
                <p className="text-[11px] text-slate-500">Allowed supplementary examination if failing in exactly 1 subject.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Distinction Honors</span>
                <p className="font-heading font-black text-emerald-400 text-lg">75% Aggregate</p>
                <p className="text-[11px] text-slate-500">Conferred First Division with Distinction on official marksheet.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: MANUAL ENTRY FORM */}
      {activeSubTab === 'add-single' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              Manual Statement of Marks Entry
            </h3>
            <p className="text-xs text-slate-400">
              Enter individual student examination performance with auto-grading.
            </p>
          </div>

          <form onSubmit={handleManualResultSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={manualResult.studentName}
                  onChange={(e) => setManualResult({ ...manualResult, studentName: e.target.value })}
                  placeholder="e.g. Ramesh Chandra Das"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={manualResult.rollNumber}
                  onChange={(e) => setManualResult({ ...manualResult, rollNumber: e.target.value })}
                  placeholder="e.g. 26SCI110"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={manualResult.registrationNumber}
                  onChange={(e) =>
                    setManualResult({ ...manualResult, registrationNumber: e.target.value })
                  }
                  placeholder="e.g. CHSE/2024/89410"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Father's Name</label>
                <input
                  type="text"
                  value={manualResult.fatherName}
                  onChange={(e) => setManualResult({ ...manualResult, fatherName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={manualResult.motherName}
                  onChange={(e) => setManualResult({ ...manualResult, motherName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Class</label>
                <input
                  type="text"
                  value={manualResult.className}
                  onChange={(e) => setManualResult({ ...manualResult, className: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            {/* Subject Marks Rows */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="font-heading font-bold text-white text-xs block">
                Subject Marks List
              </span>

              {manualResult.subjects.map((sub, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 text-xs items-center">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={sub.code}
                      onChange={(e) => {
                        const copy = [...manualResult.subjects];
                        copy[idx].code = e.target.value;
                        setManualResult({ ...manualResult, subjects: copy });
                      }}
                      placeholder="Code"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                    />
                  </div>

                  <div className="col-span-5">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => {
                        const copy = [...manualResult.subjects];
                        copy[idx].name = e.target.value;
                        setManualResult({ ...manualResult, subjects: copy });
                      }}
                      placeholder="Subject Name"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      value={sub.obtained}
                      onChange={(e) => {
                        const copy = [...manualResult.subjects];
                        copy[idx].obtained = Number(e.target.value);
                        setManualResult({ ...manualResult, subjects: copy });
                      }}
                      placeholder="Marks"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-bold"
                    />
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        const copy = manualResult.subjects.filter((_, i) => i !== idx);
                        setManualResult({ ...manualResult, subjects: copy });
                      }}
                      className="text-red-400 hover:text-red-300 font-bold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setManualResult({
                    ...manualResult,
                    subjects: [
                      ...manualResult.subjects,
                      { code: `SUB-${manualResult.subjects.length + 1}`, name: 'New Subject', fullMarks: 100, passMarks: 33, obtained: 70 },
                    ],
                  });
                }}
                className="text-amber-400 hover:underline text-xs font-bold"
              >
                + Add Another Subject
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="submit"
                className="cursor-pointer px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Save & Compute Result
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 1: Marksheet Card Preview */}
      {previewResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full my-8">
            <MarksheetCard result={previewResult} onClose={() => setPreviewResult(null)} />
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-white text-base">
                {editingStudent ? 'Edit Student Particulars' : 'Add New Student Record'}
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {studentFormError && (
              <div className="p-3 rounded-xl bg-red-950 border border-red-800 text-red-300 text-xs">
                {studentFormError}
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentFormData.studentName || ''}
                  onChange={(e) =>
                    setStudentFormData({ ...studentFormData, studentName: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={studentFormData.rollNumber || ''}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, rollNumber: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Registration No</label>
                  <input
                    type="text"
                    value={studentFormData.registrationNumber || ''}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, registrationNumber: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={studentFormData.fatherName || ''}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, fatherName: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={studentFormData.motherName || ''}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, motherName: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Class / Course</label>
                  <input
                    type="text"
                    value={studentFormData.className || ''}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, className: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Section</label>
                  <input
                    type="text"
                    value={studentFormData.section || ''}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, section: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

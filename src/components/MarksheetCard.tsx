import React from 'react';
import { StudentResultRecord } from '../types';
import { downloadMarksheetPDF } from '../services/pdfGenerator';
import {
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  QrCode,
  ShieldCheck,
  Building,
  Calendar,
  User,
  Hash,
  Share2,
} from 'lucide-react';

interface MarksheetCardProps {
  result: StudentResultRecord;
  onClose?: () => void;
  showAdminControls?: boolean;
}

export const MarksheetCard: React.FC<MarksheetCardProps> = ({
  result,
  onClose,
  showAdminControls = false,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadMarksheetPDF(result);
  };

  const handleCopyVerification = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(result.verificationCode);
      alert(`Verification code copied to clipboard: ${result.verificationCode}`);
    }
  };

  const isPass = result.resultStatus === 'PASS';
  const isCompartment = result.resultStatus === 'COMPARTMENT';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 print:m-0 print:p-0 print:max-w-none">
      {/* Action Toolbar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isPass
                ? 'bg-emerald-100 text-emerald-800'
                : isCompartment
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isPass && <CheckCircle2 className="w-4 h-4" />}
            {isCompartment && <AlertTriangle className="w-4 h-4" />}
            {!isPass && !isCompartment && <XCircle className="w-4 h-4" />}
            <span>{result.resultStatus}</span>
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Session: <strong className="text-slate-800">{result.academicYear}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyVerification}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            title="Copy Verification Code"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verify Code</span>
          </button>

          <button
            onClick={handlePrint}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT RESULT</span>
          </button>

          <button
            onClick={handleDownload}
            className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD RESULT PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Official Marksheet Document Body */}
      <div
        id="marksheet-printable"
        className="bg-white rounded-3xl border-2 border-slate-900/90 shadow-2xl overflow-hidden p-6 sm:p-10 relative print:border-none print:shadow-none print:p-0 print:rounded-none"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none">
          <span className="text-8xl sm:text-9xl font-black rotate-[-25deg] text-slate-900">
            OFFICIAL
          </span>
        </div>

        {/* Institution Header */}
        <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1.5 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-[11px] font-bold tracking-widest uppercase mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>EXAMINATION & EVALUATION DIRECTORATE</span>
          </div>

          <h1 className="font-heading text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            VISHWA VINAYAK GROUP OF INSTITUTIONS
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Khireitangiri, Kendujhar, Odisha - 758046 • Affiliated to CHSE & SAMS Higher Education
          </p>

          <div className="pt-2">
            <div className="inline-block px-5 py-1.5 bg-slate-100 border border-slate-300 rounded-lg">
              <span className="font-heading text-xs sm:text-sm font-bold text-slate-900 tracking-wider">
                OFFICIAL STATEMENT OF MARKS (MARKSHEET)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {result.examinationName} • ACADEMIC SESSION {result.academicYear}
            </p>
          </div>
        </div>

        {/* Student Particulars */}
        <div className="my-6 bg-slate-50/80 rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-600" />
            <span>STUDENT PROFILE & ENROLLMENT PARTICULARS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs">
            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{result.studentName}</span>
            </div>

            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Roll Number:</span>
              <span className="font-black text-amber-700 font-mono tracking-wider text-sm">
                {result.rollNumber}
              </span>
            </div>

            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Father's Name:</span>
              <span className="font-medium text-slate-800">{result.fatherName}</span>
            </div>

            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Registration No:</span>
              <span className="font-semibold text-slate-800 font-mono">
                {result.registrationNumber}
              </span>
            </div>

            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Mother's Name:</span>
              <span className="font-medium text-slate-800">{result.motherName}</span>
            </div>

            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Class / Stream:</span>
              <span className="font-bold text-slate-900">
                {result.className} (Section {result.section})
              </span>
            </div>

            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Date of Birth:</span>
              <span className="font-medium text-slate-800">{result.dateOfBirth}</span>
            </div>

            <div className="flex">
              <span className="w-32 font-bold text-slate-500">Verification Code:</span>
              <span className="font-bold text-blue-700 font-mono">{result.verificationCode}</span>
            </div>
          </div>
        </div>

        {/* Subject Marks Table */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3 border border-slate-700 w-20">Code</th>
                <th className="py-2.5 px-3 border border-slate-700">Subject Description</th>
                <th className="py-2.5 px-3 border border-slate-700 text-center w-24">Full Marks</th>
                <th className="py-2.5 px-3 border border-slate-700 text-center w-24">Pass Marks</th>
                <th className="py-2.5 px-3 border border-slate-700 text-center w-28">Obtained</th>
                <th className="py-2.5 px-3 border border-slate-700 text-center w-16">Grade</th>
                <th className="py-2.5 px-3 border border-slate-700 text-center w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((sub, idx) => {
                const subPass = sub.marksObtained >= sub.passMarks;
                return (
                  <tr
                    key={sub.subjectCode || idx}
                    className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}
                  >
                    <td className="py-2 px-3 border border-slate-200 font-mono text-slate-600">
                      {sub.subjectCode}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 font-semibold text-slate-900">
                      {sub.subjectName}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center text-slate-600">
                      {sub.fullMarks}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center text-slate-600">
                      {sub.passMarks}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center font-bold text-slate-900">
                      <span className={subPass ? 'text-slate-900' : 'text-red-600 font-black'}>
                        {sub.marksObtained}
                      </span>
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center font-bold text-blue-800">
                      {sub.grade}
                    </td>
                    <td className="py-2 px-3 border border-slate-200 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          subPass
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {subPass ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Grand Total Summary Box */}
        <div className="my-6 bg-slate-900 text-white rounded-2xl p-5 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="border-r border-slate-800 last:border-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                GRAND TOTAL
              </span>
              <span className="font-heading text-lg sm:text-2xl font-black text-amber-400">
                {result.totalMarksObtained}{' '}
                <span className="text-xs text-slate-400 font-normal">
                  / {result.totalFullMarks}
                </span>
              </span>
            </div>

            <div className="border-r border-slate-800 last:border-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                PERCENTAGE
              </span>
              <span className="font-heading text-lg sm:text-2xl font-black text-white">
                {result.percentage.toFixed(2)}%
              </span>
            </div>

            <div className="border-r border-slate-800 last:border-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                OVERALL GRADE
              </span>
              <span className="font-heading text-lg sm:text-2xl font-black text-amber-300">
                {result.grade}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                FINAL RESULT
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase mt-1 tracking-wider ${
                  isPass
                    ? 'bg-emerald-500 text-slate-950'
                    : isCompartment
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-red-500 text-white'
                }`}
              >
                {result.resultStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Remarks & Division Note */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-700">Official Evaluation:</span>
            <span className="font-bold text-slate-900">{result.division || 'First Division'}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 italic">"{result.remarks}"</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
            * Security verification: This certificate is digitally authenticated by Vishwa Vinayak
            Trust examination board. To verify the validity of this marksheet, enter Verification
            Code <strong>{result.verificationCode}</strong> at the online portal.
          </p>
        </div>

        {/* Authorized Signatures & QR Section */}
        <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
          {/* Prepared By */}
          <div className="space-y-1">
            <div className="h-10 flex items-end justify-center">
              <span className="font-serif italic text-xs text-slate-400 select-none">
                ~ Verified by Exam Cell ~
              </span>
            </div>
            <div className="border-t border-slate-300 pt-1.5">
              <p className="text-xs font-bold text-slate-800">Checked & Verified By</p>
              <p className="text-[10px] text-slate-500">Academic Verification Cell</p>
            </div>
          </div>

          {/* Center Digital Seal & QR */}
          <div className="flex flex-col items-center justify-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-inner flex flex-col items-center">
              <QrCode className="w-12 h-12 text-slate-800" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                SECURE QR SEAL
              </span>
            </div>
          </div>

          {/* Controller of Examinations */}
          <div className="space-y-1">
            <div className="h-10 flex items-end justify-center">
              <span className="font-serif italic text-xs text-blue-900 font-semibold select-none">
                Dr. Rabinarayana Mohanta
              </span>
            </div>
            <div className="border-t border-slate-300 pt-1.5">
              <p className="text-xs font-bold text-slate-900">Controller of Examinations</p>
              <p className="text-[10px] text-slate-500">Vishwa Vinayak Trust Institutions</p>
            </div>
          </div>
        </div>

        {/* Issue Date & Print Footer */}
        <div className="mt-8 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10px] text-slate-400">
          <span>
            Date of Issue:{' '}
            {result.publishedAt
              ? new Date(result.publishedAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : new Date().toLocaleDateString('en-IN')}
          </span>
          <span>ONLINE STUDENT RESULT PORTAL • GOVERNMENT RECOGNIZED</span>
          <span>Security Code: {result.verificationCode}</span>
        </div>
      </div>
    </div>
  );
};

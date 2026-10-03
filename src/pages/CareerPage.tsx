import React, { useState } from 'react';
import { Wing } from '../types';
import { storageService } from '../services/storage';
import {
  Briefcase,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CareerPageProps {
  wings: Wing[];
  onNavigate: (path: string) => void;
}

export const CareerPage: React.FC<CareerPageProps> = ({ wings, onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    parentName: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    mobile: '',
    email: '',
    address: '',
    qualification: '',
    experience: '',
    skills: '',
    applyingFor: '',
    preferredWingId: 'all',
    message: '',
  });

  const [cvFile, setCvFile] = useState<{
    name: string;
    type: string;
    size: string;
    dataUrl: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedAppId, setGeneratedAppId] = useState<string | null>(null);
  const [dbSyncNote, setDbSyncNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allowed types: PDF, DOC, DOCX
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const lowerName = file.name.toLowerCase();
    const isValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValidExt) {
      setError('Please upload only PDF, DOC, or DOCX files.');
      return;
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setCvFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.mobile.trim() ||
      !formData.email.trim() ||
      !formData.qualification.trim() ||
      !formData.applyingFor.trim()
    ) {
      setError('Please fill in all mandatory fields (*).');
      return;
    }

    if (!cvFile) {
      setError('Please upload your CV/Resume file (PDF, DOC, or DOCX).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await storageService.submitApplicationAsync({
        fullName: formData.fullName.trim(),
        parentName: formData.parentName.trim(),
        dob: formData.dob || 'Not Provided',
        gender: formData.gender,
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        qualification: formData.qualification.trim(),
        experience: formData.experience.trim() || 'Fresh Graduate',
        skills: formData.skills.trim(),
        applyingFor: formData.applyingFor.trim(),
        preferredWingId: formData.preferredWingId,
        message: formData.message.trim(),
        cvFileName: cvFile.name,
        cvFileType: cvFile.type,
        cvFileSize: cvFile.size,
        cvFileData: cvFile.dataUrl,
      });

      setGeneratedAppId(result.app.applicationId);
      setDbSyncNote(result.message);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Faculty, Staff & Leadership Recruitment
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            SUBMIT DETAILS & UPLOAD CV
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
            Join the educational family of Vishwa Vinayak Trust. We invite qualified lecturers,
            teachers, laboratory assistants, and administrative personnel to submit their resumes for
            upcoming academic positions.
          </p>
        </div>

        {/* Success Modal / State */}
        {generatedAppId ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-500 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-black text-slate-900">
                Application Successfully Submitted!
              </h2>
              <p className="text-sm text-slate-600">
                Your details and CV have been securely filed with the Vishwa Vinayak Trust Recruitment
                Cell.
              </p>
            </div>

            {/* Generated Application ID Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-md mx-auto space-y-1.5">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Your Unique Application ID
              </span>
              <p className="font-heading text-2xl font-black text-red-700 tracking-widest mt-1">
                {generatedAppId}
              </p>
              <p className="text-[11px] text-slate-500">
                Please note down this ID for future communication and interview reference.
              </p>

              {dbSyncNote && (
                <div className="pt-2 border-t border-amber-200/80 text-[11px] font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{dbSyncNote}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setGeneratedAppId(null);
                  setCvFile(null);
                  setFormData({
                    fullName: '',
                    parentName: '',
                    dob: '',
                    gender: 'Male',
                    mobile: '',
                    email: '',
                    address: '',
                    qualification: '',
                    experience: '',
                    skills: '',
                    applyingFor: '',
                    preferredWingId: 'all',
                    message: '',
                  });
                }}
                className="cursor-pointer px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Submit Another Application
              </button>

              <button
                onClick={() => onNavigate('/')}
                className="cursor-pointer px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          /* Application Form Card */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
              {/* Section 1: Personal Details */}
              <div className="space-y-4">
                <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  <span>1. Personal & Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Chandra Mahanta"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Father / Mother / Guardian Name
                    </label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Father's or Mother's Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gender <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="e.g. 9437XXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current / Permanent Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Village/Town, District, Pin code"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Qualifications & Position Applied */}
              <div className="space-y-4">
                <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>2. Academic Qualifications & Preference</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Highest Qualification <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      placeholder="e.g. M.Sc. in Physics, UGC-NET, B.Ed., MCA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Applying For (Position) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.applyingFor}
                      onChange={(e) => setFormData({ ...formData, applyingFor: e.target.value })}
                      placeholder="e.g. Lecturer in Physics, Lab Assistant, Accountant"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="e.g. 3 Years in Higher Secondary College"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Wing
                    </label>
                    <select
                      value={formData.preferredWingId}
                      onChange={(e) => setFormData({ ...formData, preferredWingId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">Any Trust Wing / Central</option>
                      {wings.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.shortName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specialized Skills / Subjects / Certifications
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="e.g. Laboratory experiments, Python, Tally, CHSE syllabus expertise"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Section 3: CV / Resume File Upload */}
              <div className="space-y-4">
                <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <span>3. Upload CV / Resume (PDF / DOC / DOCX) *</span>
                </h3>

                <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 sm:p-8 text-center bg-slate-50 hover:bg-amber-50/50 transition-colors">
                  {cvFile ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                        <FileCheck className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{cvFile.name}</p>
                      <span className="text-xs text-slate-500">{cvFile.size}</span>
                      <button
                        type="button"
                        onClick={() => setCvFile(null)}
                        className="text-xs text-red-600 hover:underline pt-2 font-bold cursor-pointer"
                      >
                        Remove and select another file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          Click to upload your Curriculum Vitae / Resume
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Supported formats: PDF, DOC, DOCX (Max 10MB)
                        </p>
                      </div>
                      <label className="cursor-pointer inline-block px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all">
                        <span>Browse File</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Additional Cover Letter / Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Remarks or Cover Message
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share any special achievements, research work, or message for the management..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full py-4 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-red-700/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? 'Registering Application...' : 'Submit Application & Upload CV'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

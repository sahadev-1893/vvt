import React, { useState, useMemo } from 'react';
import { Expert, Wing } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Search,
  Filter,
  GraduationCap,
  Briefcase,
  BookOpen,
  Mail,
  Phone,
  CheckCircle,
  Plus,
  Edit2,
  Download,
  Building,
} from 'lucide-react';

interface ExpertsPageProps {
  experts: Expert[];
  wings: Wing[];
  onNavigate: (path: string) => void;
  onOpenAdminExpertModal?: () => void;
  onOpenEditExpert?: (expert: Expert) => void;
}

export const ExpertsPage: React.FC<ExpertsPageProps> = ({
  experts,
  wings,
  onNavigate,
  onOpenAdminExpertModal,
  onOpenEditExpert,
}) => {
  const { isAuthenticated, currentAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedWing, setSelectedWing] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');

  const departments = useMemo(() => {
    const set = new Set<string>();
    experts.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set);
  }, [experts]);

  const filteredExperts = useMemo(() => {
    return experts.filter((e) => {
      if (e.status !== 'active') return false;
      if (selectedWing !== 'all' && e.wingId !== selectedWing) return false;
      if (selectedDept !== 'all' && e.department !== selectedDept) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.specialization.toLowerCase().includes(q) ||
          e.qualification.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [experts, selectedWing, selectedDept, search]);

  const getWingName = (wingId: string) => {
    if (wingId === 'all') return 'All Trust Wings';
    const found = wings.find((w) => w.id === wingId || w.slug === wingId);
    return found ? found.shortName : wingId;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Faculty, Researchers & Academic Advisory
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            OUR ACADEMIC EXPERTS & FACULTY
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed font-light max-w-2xl mx-auto">
            Distinguished academicians, doctorates, research mentors, and experienced educators guiding
            the students of Vishwa Vinayak Degree College and Vishwa Vinayak Higher Secondary School.
          </p>

          {/* Admin In-Page Controls */}
          {isAuthenticated && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">
                Admin Mode Active:
              </span>
              {onOpenAdminExpertModal && (
                <button
                  onClick={onOpenAdminExpertModal}
                  className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Expert / Faculty</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('/admin/dashboard')}
                className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Manage in Admin Console</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by faculty name, subject, or qualification..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Institutional Wings</option>
              {wings.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.shortName} - {w.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Academic Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing <strong>{filteredExperts.length}</strong> academic experts and mentors
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Trust Faculty
              </span>
            </div>
          </div>
        </div>

        {/* Experts Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={exp.photo}
                      alt={exp.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/20 shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 mb-1">
                      {getWingName(exp.wingId)}
                    </span>
                    <h2 className="font-heading font-black text-slate-900 text-base leading-snug group-hover:text-red-700 transition-colors">
                      {exp.name}
                    </h2>
                    <p className="text-xs font-bold text-amber-700 mt-0.5">{exp.designation}</p>
                    <p className="text-[11px] text-slate-500">{exp.department}</p>
                  </div>
                </div>

                {/* Academic Qualifications & Highlights */}
                <div className="space-y-2 bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Qualifications:</span>
                      <span className="text-slate-600">{exp.qualification}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Experience:</span>
                      <span className="text-slate-600">{exp.experience}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Specialization:</span>
                      <span className="text-slate-600">{exp.specialization}</span>
                    </div>
                  </div>
                </div>

                {exp.bio && (
                  <p className="text-xs text-slate-600 italic line-clamp-3 leading-relaxed">
                    "{exp.bio}"
                  </p>
                )}
              </div>

              {/* Card Footer with Contact and Admin Edit */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`mailto:${exp.email}`}
                  className="font-bold text-slate-700 hover:text-red-700 flex items-center gap-1.5 transition-colors truncate"
                  title="Contact Faculty via Email"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">{exp.email}</span>
                </a>

                {isAuthenticated && onOpenEditExpert && (
                  <button
                    onClick={() => onOpenEditExpert(exp)}
                    className="cursor-pointer px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-xs"
                    title="Edit Expert"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Join our faculty CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Careers & Opportunities
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black">
              Interested in Joining Our Faculty?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light">
              Submit your curriculum vitae, educational credentials, and teaching experience. Applications
              are directly reviewed by the Vishwa Vinayak Trust Academic Council.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/career')}
            className="cursor-pointer px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg hover:shadow-amber-500/20 shrink-0"
          >
            Submit CV & Apply Online
          </button>
        </div>
      </div>
    </div>
  );
};

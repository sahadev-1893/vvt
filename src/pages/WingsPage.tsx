import React from 'react';
import { Wing } from '../types';
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface WingsPageProps {
  wings: Wing[];
  onNavigate: (path: string) => void;
}

export const WingsPage: React.FC<WingsPageProps> = ({ wings, onNavigate }) => {
  const activeWings = wings.filter((w) => w.status === 'active');

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Trust Governance & Institutions
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            OUR ACADEMIC WINGS
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
            Vishwa Vinayak Trust operates multidisciplinary academic institutions committed to
            transforming students into enlightened, capable leaders. Explore each wing's programs,
            pedagogy, and campus facilities.
          </p>
        </div>

        {/* Wings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeWings.map((wing) => (
            <div
              key={wing.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={wing.coverImage}
                  alt={wing.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-red-700 text-white font-black text-xs tracking-wider shadow">
                    {wing.shortName}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-amber-300 font-bold text-xs border border-white/20">
                    Est. {wing.establishedYear}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold leading-tight drop-shadow">
                    {wing.name}
                  </h2>
                  {wing.tagline && (
                    <p className="text-xs text-amber-300 font-medium line-clamp-1 mt-1">
                      {wing.tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {wing.description}
                </p>

                {/* Courses / Programs Snapshot */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Key Courses & Streams ({wing.courses.length})</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {wing.courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <p className="font-bold text-slate-800">{course.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{course.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Principal Info & Key Contact */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Institution Head
                    </span>
                    <span className="font-bold text-slate-900">{wing.principalName}</span>
                    <span className="block text-[11px] text-slate-500">
                      {wing.principalQualification}
                    </span>
                  </div>

                  <div className="shrink-0 flex sm:flex-col sm:items-end gap-2 text-slate-600 text-xs">
                    <a
                      href={`tel:${wing.phone}`}
                      className="flex items-center gap-1 hover:text-amber-700 font-semibold"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{wing.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(`/wings/${wing.slug}`)}
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow transition-all"
                  >
                    <span>View Detail Profile & Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('/contact')}
                    className="cursor-pointer text-xs font-bold text-slate-700 hover:text-amber-700 hover:underline"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Future Expansion Note */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 text-center max-w-3xl mx-auto space-y-3 shadow-xs">
          <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-800">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900">
            Expanding Trust Academic Horizons
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Vishwa Vinayak Trust is continually planning further professional wings including
            vocational training, teacher education, and public schooling. All new institutions are
            dynamically announced and integrated here upon sanction.
          </p>
        </div>
      </div>
    </div>
  );
};

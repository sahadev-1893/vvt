import React, { useState } from 'react';
import { Wing, Notice, EventItem, GalleryAlbum, Expert } from '../types';
import { LazyImage } from '../components/LazyImage';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  CheckCircle2,
  FileText,
  Award,
  Users,
  Building2,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Briefcase,
  Image as ImageIcon,
} from 'lucide-react';

interface WingDetailPageProps {
  wing: Wing;
  notices: Notice[];
  events: EventItem[];
  albums: GalleryAlbum[];
  experts?: Expert[];
  onNavigate: (path: string) => void;
}

export const WingDetailPage: React.FC<WingDetailPageProps> = ({
  wing,
  notices,
  events,
  albums = [],
  experts = [],
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'faculty' | 'facilities' | 'gallery' | 'notices'
  >('overview');

  // Filter wing specific notices or general ones
  const wingNotices = notices.filter(
    (n) => n.wingId === wing.id || n.wingId === 'all'
  ).slice(0, 5);

  const wingEvents = events.filter(
    (e) => e.wingId === wing.id || e.wingId === 'all'
  ).slice(0, 3);

  const wingExperts = experts.filter(
    (exp) => exp.wingId === wing.id || exp.wingId === 'all'
  );

  // Filter gallery photos relevant to this wing
  const wingPhotos = albums
    .filter(
      (a) =>
        a.isPublished &&
        (a.wingId === wing.id ||
          a.wingId === 'all' ||
          a.category?.toLowerCase() === wing.shortName?.toLowerCase())
    )
    .flatMap((a) => a.photos);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Wing Hero Banner */}
      <section className="relative w-full h-[360px] md:h-[440px] bg-slate-950 overflow-hidden">
        <LazyImage
          src={wing.coverImage}
          alt={wing.name}
          wrapperClassName="absolute inset-0 w-full h-full"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-900/50 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('/wings')}
            className="cursor-pointer mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Wings</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-lg bg-red-700 text-white font-black text-xs tracking-wider">
              {wing.shortName}
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-amber-300 font-bold text-xs border border-white/20">
              Est. {wing.establishedYear}
            </span>
            {wing.affiliation && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-slate-300 text-xs">
                {wing.affiliation}
              </span>
            )}
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {wing.name}
          </h1>

          {wing.tagline && (
            <p className="text-sm sm:text-base text-amber-300/90 font-medium mt-2 max-w-3xl">
              {wing.tagline}
            </p>
          )}
        </div>
      </section>

      {/* 2. Navigation Tab Bar */}
      <div className="sticky top-20 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-4 py-2">
            {[
              { id: 'overview', label: 'Overview & Leadership' },
              { id: 'courses', label: `Courses (${wing.courses.length})` },
              { id: 'faculty', label: `Faculty (${wingExperts.length})` },
              { id: 'facilities', label: 'Campus Facilities' },
              { id: 'gallery', label: `Campus Gallery (${wingPhotos.length})` },
              { id: 'notices', label: 'Wing Notices' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-50 text-amber-800 border-b-2 border-amber-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('/contact')}
            className="cursor-pointer hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors shrink-0"
          >
            <span>Admission Helpdesk</span>
          </button>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Left Content (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* About Institution Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                    About {wing.name}
                  </h2>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {wing.aboutText || wing.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                      <span className="block font-heading text-xl font-bold text-slate-900">
                        {wing.studentCount || '500+'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Students Enrolled</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                      <span className="block font-heading text-xl font-bold text-slate-900">
                        {wing.facultyCount || '25+'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Expert Faculty</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center col-span-2 sm:col-span-1">
                      <span className="block font-heading text-xl font-bold text-slate-900">
                        {wing.campusArea || 'Main Campus'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Khireitangiri</span>
                    </div>
                  </div>
                </div>

                {/* Principal / Head Message */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Message From The
                      </span>
                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        Principal & Academic Head
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    {wing.principalPhoto && (
                      <LazyImage
                        src={wing.principalPhoto}
                        alt={wing.principalName}
                        wrapperClassName="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-amber-500/40 shadow-sm shrink-0"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-heading text-base font-bold text-slate-900">
                          {wing.principalName}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {wing.principalQualification}
                        </p>
                      </div>

                      <blockquote className="text-xs sm:text-sm text-slate-700 italic border-l-3 border-amber-500 pl-4 py-1 leading-relaxed bg-amber-50/40 rounded-r-xl">
                        "{wing.principalMessage}"
                      </blockquote>
                    </div>
                  </div>
                </div>

                {/* Admission Info */}
                <div className="bg-gradient-to-r from-amber-50 via-white to-red-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-heading text-base sm:text-lg font-bold">
                      Admission Procedure & Guidelines
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {wing.admissionInfo}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => onNavigate('/contact')}
                      className="cursor-pointer px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      Enquire for Admission
                    </button>
                    <a
                      href="https://samsodisha.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
                    >
                      <span>SAMS Odisha Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                    Academic Courses & Specializations
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Approved by regulatory authorities with comprehensive curricula, practicals, and
                    continuous internal assessments.
                  </p>
                </div>

                <div className="space-y-4">
                  {wing.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-amber-400 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-red-50 text-red-700">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                              {course.name}
                            </h3>
                            <span className="text-xs font-semibold text-amber-700">
                              Duration: {course.duration}
                            </span>
                          </div>
                        </div>

                        {course.seats && (
                          <span className="self-start sm:self-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                            Intake: {course.seats} Seats
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="font-bold text-slate-700 block">Eligibility:</span>
                          <span className="text-slate-600">{course.eligibility}</span>
                        </div>

                        {course.streams && course.streams.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-700 block">
                              Streams / Electives:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {course.streams.map((s) => (
                                <span
                                  key={s}
                                  className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[11px]"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faculty & Experts Tab */}
            {activeTab === 'faculty' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                      Faculty & Academic Mentors
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Experienced professors and subject specialists dedicated to {wing.shortName}.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('/experts')}
                    className="text-xs font-bold text-amber-700 hover:underline self-start sm:self-center"
                  >
                    View All Trust Experts →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wingExperts.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-4 hover:border-amber-400 transition-colors"
                    >
                      <LazyImage
                        src={exp.photo}
                        alt={exp.name}
                        wrapperClassName="w-16 h-16 rounded-2xl border border-slate-100 shadow-xs shrink-0"
                        className="w-full h-full object-cover"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="font-heading font-bold text-slate-900 text-sm truncate">
                          {exp.name}
                        </h3>
                        <p className="text-xs font-bold text-amber-700 truncate">{exp.designation}</p>
                        <p className="text-[11px] text-slate-500 truncate">{exp.department}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-1">{exp.qualification}</p>
                        <a
                          href={`mailto:${exp.email}`}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-red-700 font-medium pt-1"
                        >
                          <Mail className="w-3 h-3 text-amber-600" />
                          <span className="truncate">{exp.email}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {wingExperts.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    No faculty profiles assigned specifically to this wing yet.
                  </div>
                )}
              </div>
            )}

            {/* Facilities Tab */}
            {activeTab === 'facilities' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                    Campus Facilities & Student Amenities
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Modern, safe, and academically enriching infrastructure created for round-the-clock
                    student learning.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wing.facilities.map((facility, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">{facility}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Maintained according to government safety & educational norms.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                      {wing.shortName} Campus & Academic Moments
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Visual glimpses into daily academic routines, labs, seminars, and sports activities.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('/gallery')}
                    className="text-xs font-bold text-amber-700 hover:underline self-start sm:self-center"
                  >
                    View Full Trust Gallery →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wingPhotos.map((photo, pIdx) => (
                    <div
                      key={photo.id || pIdx}
                      className="group relative bg-slate-900 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 aspect-[4/3]"
                    >
                      <LazyImage
                        src={photo.url}
                        alt={photo.caption}
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          {photo.category}
                        </span>
                        <p className="text-xs font-semibold text-white line-clamp-2 mt-0.5">
                          {photo.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {wingPhotos.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    No gallery photos published specifically for this wing yet.
                  </div>
                )}
              </div>
            )}

            {/* Notices Tab */}
            {activeTab === 'notices' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900">
                    Notices for {wing.shortName}
                  </h2>
                  <button
                    onClick={() => onNavigate('/notice')}
                    className="text-xs font-bold text-amber-700 hover:underline"
                  >
                    All Trust Notices →
                  </button>
                </div>

                <div className="space-y-3">
                  {wingNotices.length > 0 ? (
                    wingNotices.map((n) => (
                      <div
                        key={n.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            {n.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{n.noticeDate}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{n.title}</h4>
                        <p className="text-xs text-slate-600">{n.shortDescription}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      No notices specifically posted for this wing right now.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Wing Contact Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Wing Contact Information
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{wing.address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href={`tel:${wing.phone}`} className="font-semibold text-slate-800 hover:text-amber-700">
                    {wing.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                  <a href={`mailto:${wing.email}`} className="text-slate-800 hover:text-amber-700">
                    {wing.email}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onNavigate('/contact')}
                  className="cursor-pointer w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Send Admission Inquiry
                </button>
              </div>
            </div>

            {/* Quick Links to Other Wings */}
            <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Other Trust Institutions
              </h4>
              <button
                onClick={() => onNavigate('/wings')}
                className="cursor-pointer w-full text-left py-2 px-3 rounded-xl bg-white hover:bg-amber-50 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
              >
                <span>View All Trust Wings</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
              <button
                onClick={() => onNavigate('/career')}
                className="cursor-pointer w-full text-left py-2 px-3 rounded-xl bg-white hover:bg-amber-50 text-xs font-bold text-slate-800 flex items-center justify-between transition-colors"
              >
                <span>Submit CV for Teaching Roles</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

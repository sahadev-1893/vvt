import React, { useState, useEffect } from 'react';
import { Wing, Slider, Notice, EventItem, SiteSettings, Expert } from '../types';
import { VVTLogo } from '../components/VVTLogo';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Calendar,
  Bell,
  ArrowRight,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  FileDown,
  Building2,
  Sparkles,
  PhoneCall,
  MapPin,
  ExternalLink,
  Mail,
} from 'lucide-react';

interface HomePageProps {
  wings: Wing[];
  experts?: Expert[];
  sliders: Slider[];
  notices: Notice[];
  events: EventItem[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  wings,
  experts = [],
  sliders,
  notices,
  events,
  settings,
  onNavigate,
}) => {
  const activeSliders = sliders.filter((s) => s.status === 'active');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto slide rotation
  useEffect(() => {
    if (activeSliders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSliders.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSliders.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % activeSliders.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + activeSliders.length) % activeSliders.length);
  };

  const activeWings = wings.filter((w) => w.status === 'active');
  const recentNotices = notices.slice(0, 4);
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Dynamic Hero Slider */}
      <section className="relative w-full h-[520px] md:h-[620px] bg-slate-950 overflow-hidden select-none">
        {activeSliders.length > 0 ? (
          activeSliders.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Slide Background Image with Dark Vignette */}
              <div
                className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/30" />
              </div>

              {/* Slide Content */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                <div className="max-w-3xl space-y-4 md:space-y-6">
                  {slide.subheading && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs md:text-sm font-semibold tracking-wide backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{slide.subheading}</span>
                    </div>
                  )}

                  <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                    {slide.heading}
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-light line-clamp-3">
                    {slide.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4">
                    {slide.buttonText && (
                      <button
                        onClick={() => onNavigate(slide.buttonUrl || '/wings')}
                        className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/20 transition-all hover:scale-105"
                      >
                        <span>{slide.buttonText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onNavigate('/contact')}
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/20 backdrop-blur-md transition-all"
                    >
                      <PhoneCall className="w-4 h-4 text-amber-400" />
                      <span>Admission Enquiry</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-white text-lg">
            No active slides. Manage via Admin Panel.
          </div>
        )}

        {/* Slider Controls */}
        {activeSliders.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-all backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-all backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {activeSliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    i === currentSlideIndex ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. Urgent / Latest Notice Ticker Bar */}
      <div className="bg-amber-500 text-slate-950 font-medium py-2.5 px-4 sm:px-6 lg:px-8 shadow-inner overflow-hidden border-b border-amber-600">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 text-amber-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shrink-0">
            <Bell className="w-3.5 h-3.5" />
            <span>Latest Notice</span>
          </div>

          <div className="flex-1 overflow-hidden whitespace-nowrap">
            {recentNotices.length > 0 ? (
              <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold animate-pulse">
                <button
                  onClick={() => onNavigate('/notice')}
                  className="hover:underline flex items-center gap-2 cursor-pointer text-left truncate"
                >
                  <span className="w-2 h-2 rounded-full bg-red-700 shrink-0"></span>
                  <span className="truncate">{recentNotices[0].title}</span>
                  <span className="text-[11px] font-normal text-slate-800">
                    ({recentNotices[0].noticeDate})
                  </span>
                </button>
              </div>
            ) : (
              <span className="text-xs">No active notices. Check back soon.</span>
            )}
          </div>

          <button
            onClick={() => onNavigate('/notice')}
            className="shrink-0 text-xs font-bold text-slate-950 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Notices</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Welcome Section (Editable via CMS) */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Graphic & Emblem Badge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 rounded-3xl border border-amber-200/60 shadow-sm relative overflow-hidden text-center">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <VVTLogo size={100} variant="emblem-only" className="my-2" />
              <div className="mt-4">
                <h3 className="font-heading text-xl font-bold text-slate-900 tracking-tight">
                  VISHWA VINAYAK TRUST
                </h3>
                <p className="text-xs font-bold text-red-700 uppercase tracking-widest mt-1">
                  Khireitangiri, Kendujhar, Odisha
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Registration & Academic Governance
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-amber-200/60 grid grid-cols-2 gap-4 w-full text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="block font-heading text-xl font-bold text-slate-900">2008</span>
                  <span className="text-[11px] text-slate-500 font-medium">Trust Foundation</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                  <span className="block font-heading text-xl font-bold text-slate-900">100%</span>
                  <span className="text-[11px] text-slate-500 font-medium">CHSE & Degree Results</span>
                </div>
              </div>
            </div>

            {/* Right Welcome Description */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Institutional Identity
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-3 leading-tight">
                  {settings.welcomeHeading}
                </h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  {settings.welcomeSubheading}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {settings.welcomeText}
              </p>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Academic Excellence</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Expert faculties, individual doubt classes, and regular evaluation systems.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="p-2 rounded-lg bg-red-100 text-red-800 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Modern Infrastructure</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Science labs, high-speed computer labs, vast library, and student hostels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-800 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Competitive Coaching</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Integrated guidance for NEET, JEE, OUAT, and state civil services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Rural Scholarships</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Generous financial concessions and merit rewards for meritorious youth.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('/wings')}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  View Educational Wings
                </button>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Campus Location & Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Wings Section (DYNAMIC - Admin can add unlimited wings) */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Educational Institutions
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-2">
                OUR ACADEMIC WINGS
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Dynamic educational wings established under Vishwa Vinayak Trust. Offering tailored
                curricula from higher secondary school education to specialized degree disciplines.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/wings')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 uppercase tracking-wider cursor-pointer"
            >
              <span>Explore All Wings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Wings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {activeWings.map((wing) => (
              <div
                key={wing.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Wing Cover Banner */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={wing.coverImage}
                    alt={wing.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Short Code Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-red-700 text-white font-black text-xs tracking-wider shadow">
                    {wing.shortName}
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-amber-300 font-bold text-xs border border-white/20">
                    Est. {wing.establishedYear}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-heading text-lg sm:text-xl font-bold leading-tight drop-shadow">
                      {wing.name}
                    </h3>
                    {wing.tagline && (
                      <p className="text-xs text-amber-300 font-medium line-clamp-1 mt-0.5">
                        {wing.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Wing Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {wing.description}
                  </p>

                  {/* Programs & Highlights */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Programs & Streams Offered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {wing.courses.slice(0, 3).map((c) => (
                        <span
                          key={c.id}
                          className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold"
                        >
                          {c.name}
                        </span>
                      ))}
                      {wing.courses.length > 3 && (
                        <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-bold">
                          +{wing.courses.length - 3} More
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Head Info */}
                  <div className="bg-slate-50 p-3 rounded-xl text-xs flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Head / Principal
                      </span>
                      <span className="font-bold text-slate-800">{wing.principalName}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {wing.studentCount ? `${wing.studentCount}+ Students` : 'Active Wing'}
                    </span>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate(`/wings/${wing.slug}`)}
                      className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-800 uppercase tracking-wider group-hover:underline"
                    >
                      <span>Explore Wing Details & Admission</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={`tel:${wing.phone}`}
                      className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                    >
                      {wing.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4b. Distinguished Faculty & Academic Experts Showcase */}
      {experts.length > 0 && (
        <section className="py-16 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Academic Mentors & Scholars
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-3">
                  DISTINGUISHED FACULTY & EXPERTS
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl font-light">
                  Learn under doctorate scholars, experienced lecturers, and passionate subject specialists
                  guiding undergraduate and higher secondary students.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/experts')}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow self-start md:self-auto shrink-0"
              >
                <span>View All Experts & Faculty</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {experts.slice(0, 4).map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => onNavigate('/experts')}
                  className="cursor-pointer bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 space-y-4 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={exp.photo}
                      alt={exp.name}
                      className="w-full h-44 rounded-2xl object-cover border border-slate-800 group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                      {exp.wingId === 'wing-vvdc' ? 'VVDC' : exp.wingId === 'wing-vvhss' ? 'VVHSS' : 'Trust'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-bold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-1">
                      {exp.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-400/90 line-clamp-1">{exp.designation}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{exp.qualification}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">{exp.specialization}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Notice Board & Events Side-by-Side Showcase */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Notices Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
                    Official Announcements
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    NOTICE BOARD & CIRCULARS
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('/notice')}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Notices</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Notice Cards List */}
              <div className="space-y-3">
                {recentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => onNavigate('/notice')}
                    className="cursor-pointer p-4 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 flex-1 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                          {notice.category}
                        </span>
                        {notice.isImportant && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse">
                            Important
                          </span>
                        )}
                        {notice.isNew && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                            New
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-medium">
                          {notice.noticeDate}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                        {notice.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-1">
                        {notice.shortDescription}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {notice.attachmentUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200">
                          <FileDown className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    Campus Happenings
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    UPCOMING EVENTS
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('/event')}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>All Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Event Cards */}
              <div className="space-y-4">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onNavigate('/event')}
                    className="cursor-pointer p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-start gap-4 group"
                  >
                    {/* Date Block */}
                    <div className="shrink-0 w-14 h-16 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center text-center shadow-xs">
                      <span className="text-[10px] font-bold uppercase text-amber-400">
                        {new Date(evt.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="font-heading text-xl font-black leading-none">
                        {new Date(evt.eventDate).getDate()}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-2">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Time: {evt.startTime} {evt.endTime ? `- ${evt.endTime}` : ''}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Admission & Career Card Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-red-800 to-amber-700 text-white shadow-md space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-300" />
                    <h4 className="font-heading text-sm font-bold uppercase tracking-wider">
                      Join Our Trust Faculty & Staff
                    </h4>
                  </div>
                  <p className="text-xs text-amber-100 leading-relaxed font-light">
                    Seeking rewarding teaching or administrative roles in Kendujhar? Submit your
                    credentials directly through our online career portal.
                  </p>
                  <button
                    onClick={() => onNavigate('/career')}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-colors shadow"
                  >
                    <span>Submit Details / Upload CV</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Institutional Impact & Key Numbers */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Trust Milestones
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-1">
              EMPOWERING EDUCATION IN NORTHERN ODISHA
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
              Our institutions have continually fostered scholarly brilliance, ethical grounding, and
              rural transformation across Kendujhar and neighboring districts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-sm">
              <span className="block font-heading text-3xl sm:text-4xl font-black text-amber-400">
                18+
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1 block">
                Years of Service
              </span>
              <span className="text-[11px] text-slate-500">Established in Khireitangiri</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-sm">
              <span className="block font-heading text-3xl sm:text-4xl font-black text-amber-400">
                1,500+
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1 block">
                Enrolled Students
              </span>
              <span className="text-[11px] text-slate-500">Across +2 & +3 streams</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-sm">
              <span className="block font-heading text-3xl sm:text-4xl font-black text-amber-400">
                65+
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1 block">
                Faculty & Staff
              </span>
              <span className="text-[11px] text-slate-500">Dedicated academicians</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-sm">
              <span className="block font-heading text-3xl sm:text-4xl font-black text-amber-400">
                100%
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1 block">
                Academic Results
              </span>
              <span className="text-[11px] text-slate-500">Consistent board & degree ranks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call to Action: Admissions & Enquiries */}
      <section className="py-14 bg-gradient-to-r from-amber-500 via-amber-600 to-red-700 text-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-heading text-xl sm:text-2xl font-black text-slate-950">
              Ready to Shape Your Future at Vishwa Vinayak?
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 font-medium">
              Admissions for Session 2026-27 are currently open for VVDC (+3 Degree) and VVHSS (+2 School).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/contact')}
              className="cursor-pointer px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Contact Admission Desk
            </button>
            <a
              href="tel:+919437238689"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-red-700" />
              <span>+91 9437238689</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

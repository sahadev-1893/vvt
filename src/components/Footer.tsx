import React from 'react';
import { VVTLogo } from './VVTLogo';
import { Wing, SiteSettings } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Lock,
  UserPlus,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Heart,
} from 'lucide-react';

interface FooterProps {
  wings: Wing[];
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ wings, settings, onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const activeWings = wings.filter((w) => w.status === 'active');

  const handleLink = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-amber-500">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: About Institution */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <VVTLogo size={58} />
              <div>
                <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                  VISHWA VINAYAK TRUST
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Group of Institutions
                </p>
                <p className="text-[11px] text-slate-400">Khireitangiri, Kendujhar, Odisha</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4 font-light">
              Dedicated to rural academic empowerment, moral character building, and higher learning.
              Nurturing generations of scholars through Vishwa Vinayak Degree College (VVDC) and Vishwa
              Vinayak Higher Secondary School (VVHSS) with top-tier faculty, modern laboratories, and
              comprehensive student support.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-medium">
                Regd. Educational Trust
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium">
                CHSE Odisha Affiliated
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium">
                UGC Recognized Degree
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white tracking-wider uppercase mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleLink('/')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/wings')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Our Academic Wings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/experts')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Faculty & Experts</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/notice')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Notices & Circulars</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/event')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Events & Activities</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/gallery')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Photo Gallery</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/career')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-amber-300 font-semibold hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Career / Submit CV</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/contact')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400 hover:translate-x-1 duration-150"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/70" />
                  <span>Contact & Map</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust Wings */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white tracking-wider uppercase mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Academic Wings
            </h4>
            <ul className="space-y-3 text-xs">
              {activeWings.map((w) => (
                <li key={w.id}>
                  <button
                    onClick={() => handleLink(`/wings/${w.slug}`)}
                    className="group text-left cursor-pointer"
                  >
                    <p className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                      <span>{w.name}</span>
                    </p>
                    <span className="text-[11px] text-slate-500">
                      Code: {w.shortName} • {w.courses.length} Programs
                    </span>
                  </button>
                </li>
              ))}
              <li className="pt-2 border-t border-slate-900">
                <span className="text-[11px] text-slate-400 italic">
                  Additional professional & vocational wings under development.
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office Info */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white tracking-wider uppercase mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Head Office
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed">
                  <strong className="text-slate-200 block">Vishwa Vinayak Trust</strong>
                  At/Po-Khireitangiri,
                  <br />
                  Dist-Kendujhar, State-Odisha,
                  <br />
                  PIN-758046, India
                </address>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+919437238689" className="hover:text-amber-300 font-medium text-slate-200">
                    +91 9437238689
                  </a>
                  <a href="tel:+919437614185" className="hover:text-amber-300 text-slate-400">
                    +91 9437614185
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-amber-300 truncate text-slate-300"
                >
                  {settings.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-400 leading-tight">
                  {settings.officeHours}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Administration Box (CRITICAL REQUIREMENT: Admin access exclusively placed in footer) */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Internal Administration Portal
                </p>
                <p className="text-[11px] text-slate-400">
                  Authorized staff login for Vishwa Vinayak Trust CMS, Notice Board & Academic Management.
                </p>
              </div>
            </div>

            {/* The ONLY location where Admin Login and Admin Sign Up exist on the site */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLink('/admin/login')}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-md transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>ADMIN LOGIN</span>
              </button>

              <button
                onClick={() => handleLink('/admin/signup')}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>ADMIN SIGN UP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {currentYear} Vishwa Vinayak Trust Group of Institutions. All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Khireitangiri, Kendujhar, Odisha 758046</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { VVTLogo } from './VVTLogo';
import { Wing } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Search,
  GraduationCap,
  Bell,
  FileText,
  Calendar,
  Image as ImageIcon,
  Send,
  Briefcase,
  Award,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  wings: Wing[];
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  wings,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wingsDropdownOpen, setWingsDropdownOpen] = useState(false);

  const activeWings = wings.filter((w) => w.status === 'active');

  const navItems = [
    { label: 'Home', path: '/' },   
    {
      label: 'Wings',
      path: '/wings',
      hasDropdown: true,
      children: activeWings.map((w) => ({
        label: w.name,
        short: w.shortName,
        path: `/wings/${w.slug}`,
      })),
    },
    { label: 'Experts', path: '/experts' },
    { label: 'Notice', path: '/notice' },
    { label: 'Event', path: '/event' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setWingsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Notification & Contact Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Contact and Location */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Khireitangiri, Kendujhar, Odisha - 758046</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <a
              href="tel:+919437238689"
              className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>+91 9437238689</span>
            </a>
            <span className="hidden lg:inline text-slate-600">|</span>
            <a
              href="tel:+919437614185"
              className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>+91 9437614185</span>
            </a>
          </div>

          {/* Quick Notice Pill & Career Link */}
          <div className="flex items-center gap-3">
            
            <button
              onClick={() => handleNavClick('/career')}
              className="cursor-pointer text-slate-200 hover:text-amber-300 flex items-center gap-1 text-[11px] font-semibold transition-colors"
            >
              <Briefcase className="w-3 h-3 text-amber-400" />
              <span>Career / Submit CV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white/98 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Left: Brand Identity with Official PNG Logo */}
            <div
              onClick={() => handleNavClick('/')}
              className="cursor-pointer flex items-center gap-3 md:gap-4 py-2 group select-none"
            >
              <img
                src="https://demoeasy.easysoftwares.org/assets/img/vvt.png"
                alt="Vishwa Vinayak Trust Logo"
                onError={(e) => {
                  e.currentTarget.src = '/vvt.png';
                }}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-heading text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors leading-tight">
                  VISHWA VINAYAK TRUST
                </span>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-red-700 flex items-center gap-1.5">
                  <span>GROUP OF INSTITUTIONS</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation Items (NOTE: STRICTLY NO ADMIN LOGIN IN HEADER) */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setWingsDropdownOpen(true)}
                      onMouseLeave={() => setWingsDropdownOpen(false)}
                    >
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${
                          isActive(item.path)
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-slate-700 hover:text-amber-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-transform duration-200" />
                      </button>

                      {/* Dropdown Menu */}
                      {wingsDropdownOpen && (
                        <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            Institutions & Wings
                          </div>
                          {item.children.map((child) => (
                            <button
                              key={child.path}
                              onClick={() => handleNavClick(child.path)}
                              className="w-full text-left px-4 py-2.5 hover:bg-amber-50/80 transition-colors flex items-start gap-3 group"
                            >
                              <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-amber-100 text-slate-700 group-hover:text-amber-700 mt-0.5">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                                  {child.label}
                                </p>
                                <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 mt-0.5">
                                  {child.short}
                                </span>
                              </div>
                            </button>
                          ))}
                          <div className="mt-1 pt-1.5 border-t border-slate-100 px-3">
                            <button
                              onClick={() => handleNavClick('/wings')}
                              className="text-xs text-amber-700 font-bold hover:underline flex items-center justify-between w-full py-1"
                            >
                              <span>View All Wings</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${
                      isActive(item.path)
                        ? 'text-amber-700 bg-amber-50'
                        : 'text-slate-700 hover:text-amber-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Global Search Button */}
              <button
                onClick={onOpenSearch}
                className="p-2.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded-lg transition-colors ml-1 cursor-pointer"
                title="Search website (Notices, Events, Wings)"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </nav>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onOpenSearch}
                className="p-2 text-slate-600 hover:text-amber-700 rounded-lg"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-amber-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('/')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold text-sm ${
                currentPath === '/' ? 'bg-amber-50 text-amber-700' : 'text-slate-800'
              }`}
            >
              Home
            </button>

            {/* Wings with accordion in mobile */}
            <div className="pt-1">
              <div className="flex items-center justify-between px-3.5 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Academic Wings</span>
              </div>
              <div className="pl-3 space-y-1">
                {activeWings.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => handleNavClick(`/wings/${w.slug}`)}
                    className="w-full text-left px-3 py-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center justify-between"
                  >
                    <span>{w.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {w.shortName}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => handleNavClick('/wings')}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold text-amber-700 hover:underline"
                >
                  View All Wings Overview →
                </button>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('/notice')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 ${
                currentPath.startsWith('/notice') ? 'bg-amber-50 text-amber-700' : 'text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Notices & Circulars</span>
            </button>

            <button
              onClick={() => handleNavClick('/event')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 ${
                currentPath.startsWith('/event') ? 'bg-amber-50 text-amber-700' : 'text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Events & Happenings</span>
            </button>

            <button
              onClick={() => handleNavClick('/gallery')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 ${
                currentPath.startsWith('/gallery') ? 'bg-amber-50 text-amber-700' : 'text-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>Photo Gallery</span>
            </button>

            <button
              onClick={() => handleNavClick('/contact')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 ${
                currentPath.startsWith('/contact') ? 'bg-amber-50 text-amber-700' : 'text-slate-800'
              }`}
            >
              <Send className="w-4 h-4 text-slate-400" />
              <span>Contact Us</span>
            </button>

            <button
              onClick={() => handleNavClick('/career')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 text-amber-800 bg-amber-50/70`}
            >
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Submit Details / Upload CV</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="tel:+919437238689"
              className="text-center py-2 px-4 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Campus: +91 9437238689</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

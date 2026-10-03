import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VVTLogo } from '../../components/VVTLogo';
import {
  UserPlus,
  Mail,
  KeyRound,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminSignUpPageProps {
  onNavigate: (path: string) => void;
}

export const AdminSignUpPage: React.FC<AdminSignUpPageProps> = ({ onNavigate }) => {
  const { registerAdmin } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.mobile ||
      !formData.password
    ) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-type.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await registerAdmin({
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
    });

    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <VVTLogo size={70} variant="emblem-only" />
        </div>
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wide">
            VISHWA VINAYAK TRUST
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mt-0.5">
            Administrator & Staff Registration
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {successMessage ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white">
                Registration Submitted
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {successMessage}
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-400 text-left">
                <strong>Super Admin Approval:</strong> To maintain strict academic integrity, newly
                registered administrators must be authorized by the Trust Chairman before accessing
                the dashboard.
              </div>
              <button
                onClick={() => onNavigate('/admin/login')}
                className="cursor-pointer w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors mt-2"
              >
                Go to Admin Login
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Prof. R. K. Mohanta"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Institutional Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@vvt.edu.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Official Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+91 9437XXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Re-type password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Submitting Registration...' : 'Register For Staff Access'}</span>
                </button>
              </form>

              <div className="pt-3 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/admin/login')}
                    className="text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Admin Sign In
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};

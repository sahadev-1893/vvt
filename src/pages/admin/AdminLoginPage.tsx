import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VVTLogo } from '../../components/VVTLogo';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      onNavigate('/admin/dashboard');
    } else {
      setError(res.message);
    }
  };

  // Demo auto-fill helper
  const handleQuickDemoFill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('admin123');
  };

  const handleDirectSuperAdminLogin = async () => {
    setLoading(true);
    setError('');
    const res = await login('admin@vvt.edu.in', 'admin123');
    setLoading(false);
    if (res.success) {
      onNavigate('/admin/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <VVTLogo size={80} variant="emblem-only" />
        </div>
        <div>
          <h1 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wide">
            VISHWA VINAYAK TRUST
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mt-0.5">
            Internal Administration Portal
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Access restricted to authorized institutional trustees, principals & editors
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vvt.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
            </button>
          </form>

          {/* Direct 1-Click Admin Access */}
          <button
            type="button"
            onClick={handleDirectSuperAdminLogin}
            disabled={loading}
            className="cursor-pointer w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1-Click Sign In as Super Admin (Instant Access)</span>
          </button>

          {/* Connected Supabase Project Badge */}
          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/70 border border-emerald-700/60 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase Cloud DB: heeevwvzlleubaikuoua</span>
            </span>
          </div>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block text-center">
              Or Select Demo Role
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin@vvt.edu.in')}
                className="cursor-pointer py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-amber-300 font-semibold border border-slate-700 transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('coordinator@vvt.edu.in')}
                className="cursor-pointer py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-semibold border border-slate-700 transition-colors"
              >
                Coordinator
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Default password: <code className="text-amber-400">admin123</code>
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Need new staff access?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/admin/signup')}
                className="text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Register as Admin / Staff
              </button>
            </p>
          </div>
        </div>

        {/* Back to public website */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-slate-200 space-y-4">
            <h3 className="font-heading text-lg font-bold text-white">Reset Password</h3>
            <p className="text-xs text-slate-400">
              Enter your registered administrator email. A secure recovery link will be sent.
            </p>
            {forgotSuccess ? (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs">
                Password reset instructions have been forwarded to the trust secretariat.
              </div>
            ) : (
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@vvt.edu.in"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
              />
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                Close
              </button>
              {!forgotSuccess && (
                <button
                  onClick={() => setForgotSuccess(true)}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-xs text-slate-950 font-bold"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

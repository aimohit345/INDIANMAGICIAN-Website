import React, { useState } from 'react';
import { adminLogin } from '../../utils/api';
import { Lock, Sparkles, KeyRound } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    try {
      setLoading(true);
      setError('');
      const res = await adminLogin(password);
      if (res.success) {
        localStorage.setItem('magic_admin_token', res.token);
        onLoginSuccess();
      } else {
        setError(res.error || 'Access denied. Incorrect secret phrase.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050807]">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 md:p-10 border border-[#FFD700]/30 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00e599]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#0a231b] border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] mx-auto mb-4 shadow-[0_0_20px_rgba(255,215,0,0.25)]">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#FFD700] font-semibold">
            Indian Magician CMS
          </span>
          <h1 className="text-2xl font-serif text-white font-medium mt-1">
            Upendra Thakur Admin
          </h1>
          <p className="text-xs text-white/50 font-sans mt-2">
            Enter the administrative key to access real-time CMS controls.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-sans text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-[#FFD700] font-semibold mb-2">
              Secret Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Default: magicadmin123"
                className="w-full px-4 py-3.5 pl-11 rounded-xl bg-[#091712] border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700] text-sm font-sans"
              />
              <KeyRound className="w-4 h-4 text-[#FFD700]/70 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-white/40 font-sans mt-2">
              Default password: <code className="text-[#FFD700]">magicadmin123</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#FFD700] text-[#050807] font-sans font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#ffe566] hover:shadow-[0_0_20px_#FFD700] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'VERIFYING KEY...' : 'UNLOCK CMS DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function MagicalPageLoader() {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Quick, sleek 0.8s magical intro animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 1300);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center bg-[#050807] transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        loading ? 'opacity-100' : 'opacity-0 -translate-y-6 pointer-events-none'
      }`}
    >
      {/* Background radial smoke glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[#062c21]/40 via-transparent to-transparent blur-2xl" />

      <div className="relative flex flex-col items-center gap-4">
        {/* Golden Diamond Flourish */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <span className="text-3xl text-[#FFD700] animate-pulse select-none">♦</span>
          <div className="absolute inset-0 rounded-full border border-[#FFD700]/30 animate-ping opacity-30" />
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-[11px] font-sans uppercase tracking-[0.4em] text-[#FFD700] font-semibold">
            INDIAN MAGICIAN
          </p>
          <p className="text-xs font-serif italic text-white/60 tracking-wider mt-1">
            Upendra Thakur
          </p>
        </div>

        {/* Golden Loading Line */}
        <div className="w-32 h-[1.5px] bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent animate-[shimmer_1s_infinite]" />
        </div>
      </div>
    </div>
  );
}

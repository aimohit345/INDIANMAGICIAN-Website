import React, { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { data } = useSiteData();
  const settings = data?.settings || {};
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Parallax / subtle zoom calculations
  const heroZoom = 1 + Math.min(scrollY * 0.0004, 0.15);
  const textTranslateY = scrollY * 0.35;
  const opacity = Math.max(1 - scrollY / 700, 0);

  const heroTitle = settings.heroTitle || 'UPENDRA THAKUR';
  const heroSubtitle = settings.heroSubtitle || 'Master Illusionist & Mentalist';
  const heroBg = settings.heroBgImage || '/hero-magician.png';

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen min-h-[640px] overflow-hidden flex items-center justify-center select-none">
      {/* Background Image: /hero-magician.png with smooth scroll-zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100 ease-out will-change-transform"
        style={{
          backgroundImage: `url(${heroBg})`,
          transform: `scale(${heroZoom})`,
          filter: 'brightness(0.92) contrast(1.05)',
        }}
      />

      {/* Atmospheric Overlays: Emerald Smoke gradient & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-transparent to-[#050807]/70" />
      <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none" />

      {/* Center Dual-Layered Typography (Matching Suhani Shah Visual Hierarchy) */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center flex flex-col items-center justify-center transition-all duration-75"
        style={{
          transform: `translateY(${textTranslateY}px)`,
          opacity: opacity,
        }}
      >
        <div className="relative inline-block mt-24 md:mt-32 animate-hero-zoom-in max-w-full">
          {/* Atmospheric Contrast Shield: Soft dark radial vignette directly behind text so spinning 3D card never obscures legibility */}
          <div
            className="absolute -inset-x-16 sm:-inset-x-24 -inset-y-10 bg-[radial-gradient(ellipse_at_center,rgba(5,8,7,0.88)_0%,rgba(5,8,7,0.5)_50%,transparent_75%)] pointer-events-none -z-10 rounded-full blur-md"
            aria-hidden="true"
          />

          {/* Luminous Title: High-Contrast Metallic Champagne-Gold Gradient with Cinematic Shadows in Poppins */}
          <h1 className="text-[8vw] sm:text-[7.5vw] md:text-[6.2vw] lg:text-[5.4vw] font-extrabold tracking-[0.12em] sm:tracking-[0.16em] uppercase leading-none whitespace-nowrap bg-gradient-to-b from-white via-[#FFF5D0] to-[#E6BA40] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)] drop-shadow-[0_14px_36px_rgba(0,0,0,0.9)] filter select-none">
            {heroTitle}
          </h1>
        </div>

        {/* Subtitle with Emerald & Gold Accent and Shadow Shield */}
        <div className="mt-4 md:mt-6 flex items-center gap-3 animate-hero-subtitle">
          <span className="w-8 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFD700]/70 to-[#FFD700]" />
          <p className="text-xs sm:text-sm font-semibold tracking-[0.32em] sm:tracking-[0.4em] uppercase text-[#FFD700] drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            {heroSubtitle}
          </p>
          <span className="w-8 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-[#FFD700]/70 to-[#FFD700]" />
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { ChevronDown, Sparkles } from 'lucide-react';

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
        <div className="relative inline-block mt-24 md:mt-32">
          {/* Layer 1: Giant Background Hollow Stroke Text */}
          <h1
            className="text-[14vw] md:text-[11vw] font-serif font-light tracking-[0.08em] uppercase text-stroke-hollow leading-none select-none pointer-events-none transform -translate-y-2 md:-translate-y-4"
            aria-hidden="true"
          >
            {heroTitle}
          </h1>

          {/* Layer 2: Overlapping Solid White Editorial Serif Text */}
          <h2 className="absolute inset-0 flex items-center justify-center text-[8vw] md:text-[6.5vw] font-serif font-normal tracking-[0.15em] uppercase text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
            {heroTitle}
          </h2>
        </div>

        {/* Subtitle with Emerald & Gold Accent */}
        <div className="mt-4 md:mt-6 flex items-center gap-3">
          <span className="w-8 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#FFD700]" />
          <p className="text-xs md:text-sm font-sans tracking-[0.35em] uppercase text-[#FFD700] font-medium">
            {heroSubtitle}
          </p>
          <span className="w-8 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#FFD700]" />
        </div>
      </div>

      {/* Floating Scroll Down Prompt */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/60 hover:text-[#FFD700] transition-colors group cursor-pointer"
        aria-label="Scroll to About section"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans">DISCOVER</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#FFD700]" />
      </button>
    </section>
  );
}

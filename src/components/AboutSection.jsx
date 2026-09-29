import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AboutSection() {
  const { data } = useSiteData();
  const about = data?.about || {};
  const collage = data?.collage || [];
  const testimonials = data?.testimonials || [];

  // Window width tracking for exact GPU-accelerated horizontal translation
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ---------------------------------------------------------------------------
  // 1. STAGE CAROUSEL SLIDE STATE & PHYSICS
  // ---------------------------------------------------------------------------
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPhotoPaused, setIsPhotoPaused] = useState(false);
  const photoTouchStart = useRef(0);

  const totalPhotos = collage.length > 0 ? collage.length : 1;

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  // Autoplay for stage photo carousel
  useEffect(() => {
    if (totalPhotos <= 1 || isPhotoPaused) return;
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % totalPhotos);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPhotos, isPhotoPaused]);

  const handlePhotoTouchStart = (e) => {
    photoTouchStart.current = e.touches[0].clientX;
  };

  const handlePhotoTouchEnd = (e) => {
    const diff = photoTouchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextPhoto();
      else prevPhoto();
    }
  };

  // Responsive slide step offset (width of card + gap) in exact pixels
  const slideOffset =
    windowWidth < 640
      ? windowWidth * 0.84 + 14 // Mobile
      : windowWidth < 1024
      ? windowWidth * 0.62 + 20 // Tablet
      : Math.min(windowWidth * 0.52, 860) + 26; // Desktop

  // ---------------------------------------------------------------------------
  // 2. TESTIMONIALS SLIDER STATE
  // ---------------------------------------------------------------------------
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const testTouchStart = useRef(0);

  const totalTestimonials = testimonials.length > 0 ? testimonials.length : 1;

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % totalTestimonials);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + totalTestimonials) % totalTestimonials);
  };

  // Autoplay for testimonials
  useEffect(() => {
    if (totalTestimonials <= 1 || isTestimonialPaused) return;
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % totalTestimonials);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalTestimonials, isTestimonialPaused]);

  const handleTestTouchStart = (e) => {
    testTouchStart.current = e.touches[0].clientX;
  };

  const handleTestTouchEnd = (e) => {
    const diff = testTouchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextTestimonial();
      else prevTestimonial();
    }
  };

  const currentTestimonial = testimonials[testimonialIndex] || testimonials[0];

  return (
    <section id="about" className="relative z-10 w-full overflow-hidden">
      {/* ===================================================================== */}
      {/* TOP PART: DARK EDITORIAL BIO (Matching Suhani Shah Clean Hierarchy) */}
      {/* ===================================================================== */}
      <div className="bg-[#050807] pt-28 md:pt-36 pb-36 md:pb-48 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column: UPENDRA THAKUR */}
            <div className="lg:col-span-5">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white tracking-wide leading-none uppercase">
                {about.title || 'Upendra Thakur'}
              </h2>

              {/* Key Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-white/10">
                {(about.stats || []).slice(0, 4).map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-serif font-light text-white">
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-sans mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Flowing Editorial Paragraph */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-white/80 font-serif text-base md:text-xl leading-relaxed tracking-wide font-light">
              <p>
                {about.lead ||
                  'Upendra Thakur is one of the biggest names in the magic industry with an experience of over 3 decades of performing over 5000 shows. With incredible skills in mind reading, situational comedy, and audience participation, he brings audiences to their feet.'}
              </p>
              {(about.bioParagraphs || []).slice(0, 2).map((para, idx) => (
                <p key={idx} className="text-white/70 text-sm md:text-base font-sans font-light leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MIDDLE: THE STAGE PHOTO CAROUSEL (Smooth 3D Sliding Track Animation)  */}
      {/* Overlaps both the Dark section above and White section below          */}
      {/* ===================================================================== */}
      <div
        className="relative z-20 w-full -mt-28 md:-mt-36 lg:-mt-44"
        onMouseEnter={() => setIsPhotoPaused(true)}
        onMouseLeave={() => setIsPhotoPaused(false)}
        onTouchStart={handlePhotoTouchStart}
        onTouchEnd={handlePhotoTouchEnd}
      >
        <div className="relative w-full h-[240px] xs:h-[300px] sm:h-[380px] md:h-[460px] lg:h-[530px] flex items-center justify-center overflow-hidden py-4 select-none">
          {/* Continuous Sliding Slides Track */}
          {collage.map((item, idx) => {
            // Circular relative distance calculation from active photoIndex
            let diff = idx - photoIndex;
            if (diff > totalPhotos / 2) diff -= totalPhotos;
            if (diff < -totalPhotos / 2) diff += totalPhotos;

            const isActive = diff === 0;
            // Render active slide, left peek, right peek, and adjacent slides for seamless glide
            const isVisible = Math.abs(diff) <= 2;

            if (!isVisible) return null;

            return (
              <div
                key={item.id || idx}
                onClick={() => {
                  if (diff < 0) prevPhoto();
                  else if (diff > 0) nextPhoto();
                }}
                style={{
                  transform: `translate3d(${diff * slideOffset}px, 0, 0) scale(${isActive ? 1 : 0.92})`,
                  transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease, filter 0.65s ease',
                  zIndex: isActive ? 20 : 10 - Math.abs(diff),
                }}
                className={`absolute w-[84vw] sm:w-[68vw] md:w-[56vw] lg:w-[52vw] max-w-5xl aspect-[16/10] overflow-hidden select-none will-change-transform ${
                  isActive
                    ? 'opacity-100 shadow-[0_25px_60px_rgba(0,0,0,0.85)] brightness-100 cursor-default'
                    : 'opacity-45 hover:opacity-80 brightness-75 hover:brightness-100 cursor-pointer shadow-2xl'
                }`}
                title={!isActive ? 'Click to bring to center' : item.title}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />

                {/* Dark shading over peeking slides for cinematic depth */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-500" />
                )}

                {/* Center stage subtle lighting vignette */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                )}

                {/* Active Slide Metadata Tag */}
                {isActive && (
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between pointer-events-none z-20 animate-fadeIn">
                    <span className="text-white font-serif text-sm md:text-base font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate pr-4">
                      {item.title}
                    </span>
                    <span className="text-white/80 font-mono text-xs tracking-widest shrink-0 bg-black/50 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
                      {idx + 1} / {totalPhotos}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Minimalist Floating Chevron Controls on the Main Stage */}
          <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-30 max-w-6xl mx-auto w-full px-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-[#FFD700] backdrop-blur-md flex items-center justify-center transition-all cursor-pointer pointer-events-auto border border-white/20 shadow-lg group"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/90 text-white hover:text-[#FFD700] backdrop-blur-md flex items-center justify-center transition-all cursor-pointer pointer-events-auto border border-white/20 shadow-lg group"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* BOTTOM PART: THEMED EDITORIAL TESTIMONIALS (Obsidian & Gold Palette) */}
      {/* ===================================================================== */}
      <div
        className="bg-gradient-to-b from-[#050807] via-[#071510] to-[#050807] text-[#f3f4f6] pt-24 md:pt-36 pb-20 md:pb-28 px-6 md:px-16 lg:px-24 border-t border-white/5 transition-colors"
        onMouseEnter={() => setIsTestimonialPaused(true)}
        onMouseLeave={() => setIsTestimonialPaused(false)}
        onTouchStart={handleTestTouchStart}
        onTouchEnd={handleTestTouchEnd}
      >
        <div className="max-w-5xl mx-auto relative flex flex-col items-center text-center">
          
          {/* Testimonial Active Quote with smooth sliding crossfade */}
          <div className="min-h-[140px] md:min-h-[130px] flex flex-col items-center justify-center overflow-hidden w-full">
            <div
              key={testimonialIndex}
              className="animate-fadeIn transition-all duration-500 w-full"
            >
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] font-serif font-light italic text-white/95 leading-relaxed tracking-wide drop-shadow-sm">
                “{currentTestimonial?.quote}”
              </p>

              {/* Testimonial Author & Designation */}
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
                <span className="text-sm md:text-base font-serif font-medium text-[#FFD700] tracking-wide">
                  — {currentTestimonial?.author}
                </span>
                {currentTestimonial?.designation && (
                  <span className="text-xs md:text-sm text-white/60 font-sans font-light">
                    , {currentTestimonial?.designation}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Testimonial Dot Switchers */}
          <div className="flex items-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === testimonialIndex
                    ? 'w-6 h-1.5 bg-[#FFD700] shadow-[0_0_8px_#FFD700]'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          {/* Signature Geometric Upward Triangle Glyph */}
          <div className="w-full flex justify-end mt-8 sm:mt-10 pr-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Return to top"
              className="text-white/40 hover:text-[#00e599] transition-colors p-2 cursor-pointer group"
              aria-label="Scroll to top"
            >
              <svg
                width="36"
                height="22"
                viewBox="0 0 36 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="group-hover:-translate-y-1 transition-transform stroke-current"
              >
                <path
                  d="M1 21L18 2L35 21"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

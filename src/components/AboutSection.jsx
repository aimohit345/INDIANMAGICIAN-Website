import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Sparkles, Quote, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export default function AboutSection() {
  const { data } = useSiteData();
  const about = data?.about || {};
  const collage = data?.collage || [];
  const testimonials = data?.testimonials || [];

  // Lightbox state for collage photos
  const [activePhoto, setActivePhoto] = useState(null);

  // Testimonials Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  // Autoplay for testimonials
  useEffect(() => {
    if (testimonials.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <section id="about" className="relative z-10 w-full py-28 md:py-36 px-6 md:px-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* ------------------------------------------------------------------ */}
        {/* 1. MAIN BIO BLOCK (Glass Container overlaying the 3D card) */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative glass-panel rounded-3xl p-8 md:p-16 border border-[#FFD700]/20 shadow-2xl overflow-hidden backdrop-blur-xl mb-24 md:mb-32">
          {/* Subtle decorative glow accents inside glass container */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00e599]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading and Lead */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold tracking-widest uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>The Living Legacy</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-serif font-light text-white tracking-wide leading-tight mb-6">
                {about.title || 'About Upendra Thakur'}
              </h2>

              <p className="text-base md:text-lg text-white/90 font-serif italic border-l-2 border-[#FFD700] pl-4 leading-relaxed">
                {about.lead ||
                  'Performing since the age of 10 and commanding stages professionally since his early twenties, Upendra Thakur has redefined the art of Indian magic on the global stage.'}
              </p>

              {/* Quick Key Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                {(about.stats || []).map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-serif font-bold text-[#FFD700]">
                      {stat.value}
                    </span>
                    <span className="text-xs text-white/60 uppercase tracking-wider font-sans mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Editorial Paragraphs */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-white/80 font-sans text-sm md:text-base leading-relaxed">
              {(about.bioParagraphs || []).map((para, idx) => (
                <p key={idx} className="tracking-wide">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 2. MODERN PICTURES COLLAGE (7-8 Photos Bento / Masonry) */}
        {/* ------------------------------------------------------------------ */}
        <div className="mb-28 md:mb-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-[#FFD700] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                Moments of Illusion
              </p>
              <h3 className="text-2xl md:text-4xl font-serif font-light text-white tracking-wide">
                Stage & Performance Gallery
              </h3>
            </div>
            <p className="text-xs md:text-sm text-white/50 font-sans mt-2 md:mt-0 tracking-wider">
              Click any image to view in high definition
            </p>
          </div>

          {/* Asymmetric Modern Bento Grid (7-8 Items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px]">
            {collage.map((item, idx) => {
              // Asymmetric row/col span layout
              let spanClass = 'col-span-1 row-span-1';
              if (idx === 0) spanClass = 'sm:col-span-2 md:col-span-2 md:row-span-2';
              else if (idx === 3) spanClass = 'md:col-span-2 md:row-span-1';
              else if (idx === 6) spanClass = 'sm:col-span-2 md:col-span-2 md:row-span-1';

              return (
                <div
                  key={item.id || idx}
                  onClick={() => setActivePhoto(item)}
                  className={`group relative rounded-2xl overflow-hidden glass-card-hover cursor-pointer border border-white/10 bg-[#0a1410] ${spanClass}`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Stage Illusion'}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Caption & Title revealed on hover / bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-end justify-between">
                    <div>
                      <h4 className="text-white font-serif text-base md:text-lg font-medium leading-snug group-hover:text-[#FFD700] transition-colors">
                        {item.title}
                      </h4>
                      {item.caption && (
                        <p className="text-xs text-white/70 font-sans mt-0.5 line-clamp-1">
                          {item.caption}
                        </p>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#050807]/70 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. TESTIMONIALS TEXT SLIDER (10-11 Slides) */}
        {/* ------------------------------------------------------------------ */}
        <div
          className="relative glass-panel rounded-3xl p-8 md:p-16 border border-[#FFD700]/20 text-center overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background watermark quote icon */}
          <Quote className="absolute -top-6 -left-6 w-36 h-36 text-white/[0.03] pointer-events-none rotate-12" />
          <Quote className="absolute -bottom-6 -right-6 w-36 h-36 text-[#FFD700]/[0.03] pointer-events-none -rotate-12" />

          <p className="text-[#FFD700] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Words of Wonder & Acclaim
          </p>

          {/* Testimonial Active Slide */}
          {testimonials.length > 0 && (
            <div className="min-h-[180px] md:min-h-[160px] flex flex-col items-center justify-center max-w-4xl mx-auto px-2">
              <p className="text-xl md:text-3xl font-serif font-normal italic text-white/95 leading-relaxed tracking-wide transition-all duration-500">
                “{testimonials[currentSlide]?.quote}”
              </p>

              <div className="mt-8 flex flex-col items-center">
                <span className="text-base md:text-lg font-serif font-bold text-[#FFD700] tracking-wide">
                  {testimonials[currentSlide]?.author}
                </span>
                <span className="text-xs text-white/60 uppercase tracking-widest font-sans mt-1">
                  {testimonials[currentSlide]?.designation}
                </span>
              </div>
            </div>
          )}

          {/* Controls: Prev / Next Buttons & Indicators */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-[#FFD700] flex items-center justify-center text-white/70 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slider Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? 'w-7 bg-[#FFD700] shadow-[0_0_8px_#FFD700]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-[#FFD700] flex items-center justify-center text-white/70 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-all cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Full Image View */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white hover:text-[#FFD700] flex items-center justify-center transition-colors"
            aria-label="Close image"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              className="max-h-[75vh] w-auto object-contain rounded-xl border border-white/15 shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h4 className="text-xl font-serif text-white font-medium">{activePhoto.title}</h4>
              {activePhoto.caption && (
                <p className="text-sm text-white/70 font-sans mt-1">{activePhoto.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function DynamicCustomPage() {
  const { slug } = useParams();
  const { data } = useSiteData();
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (data?.pages) {
      const match = data.pages.find((p) => p.slug === slug);
      setPage(match || null);
    }
  }, [slug, data]);

  if (!page) {
    return (
      <div className="relative z-10 min-h-screen pt-40 pb-20 px-6 text-center">
        <h1 className="text-3xl font-serif text-white">Page Not Found</h1>
        <p className="text-white/60 font-sans mt-3">The requested page does not exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-[#FFD700] text-[#050807] text-xs uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen pt-36 pb-28 px-6 md:px-12 bg-transparent">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-[#FFD700] tracking-widest uppercase hover:underline mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Header Glass Container */}
        <div className="glass-panel rounded-3xl p-8 md:p-14 border border-[#FFD700]/25 shadow-2xl mb-12">
          {page.heroSubtitle && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>{page.heroSubtitle}</span>
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-serif text-white font-light tracking-wide mb-6">
            {page.title}
          </h1>

          <div className="text-white/80 font-sans text-base md:text-lg leading-relaxed whitespace-pre-line border-t border-white/10 pt-6">
            {page.content}
          </div>

          {page.features && page.features.length > 0 && (
            <div className="mt-10 pt-8 border-t border-white/10">
              <h2 className="text-sm font-sans uppercase tracking-[0.25em] text-[#FFD700] font-semibold mb-6">
                Key Experience Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {page.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[#091813] border border-white/5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#00e599] shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80 font-sans">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-xs text-white/60 font-sans">
              Interested in curating this experience for your guests?
            </span>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-[#FFD700] text-[#050807] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#ffe566] transition-colors"
            >
              Inquire Availability
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Sparkles } from 'lucide-react';

export default function DynamicSections() {
  const { data } = useSiteData();
  const sections = (data?.sections || []).filter((s) => s.enabled !== false);

  if (sections.length === 0) return null;

  return (
    <div className="relative z-10 w-full space-y-24 pb-20">
      {sections.map((sec) => (
        <section
          key={sec.id}
          className="relative max-w-7xl mx-auto px-6 md:px-12"
        >
          <div className="glass-panel rounded-3xl p-8 md:p-14 border border-[#FFD700]/20">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              {sec.subtitle && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold tracking-widest uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>{sec.subtitle}</span>
                </div>
              )}
              <h2 className="text-3xl md:text-4xl font-serif text-white font-light tracking-wide">
                {sec.title}
              </h2>
              {sec.content && (
                <p className="text-white/70 font-sans text-sm md:text-base mt-4 leading-relaxed">
                  {sec.content}
                </p>
              )}
            </div>

            {/* Grid Layout Cards if present */}
            {sec.cards && sec.cards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sec.cards.map((card, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-6 rounded-2xl bg-[#091813] border border-white/10 glass-card-hover"
                  >
                    <h3 className="text-lg font-serif text-[#FFD700] font-medium mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

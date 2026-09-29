import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { Newspaper, Video, Image as ImageIcon, ArrowRight, ExternalLink } from 'lucide-react';

export default function NewsSection() {
  const { data } = useSiteData();
  const allNews = data?.news || [];

  // Pinned items for homepage (or filtered by showOnHome: true), up to 6 items (2x3 grid)
  const homeNews = allNews.filter((n) => n.showOnHome !== false).slice(0, 6);

  return (
    <section id="news" className="relative z-10 w-full py-28 md:py-36 px-6 md:px-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-light text-white tracking-wide">
            In the News
          </h2>
          <p className="text-white/60 text-sm md:text-base font-sans mt-3">
            Headlines, national television specials, and exclusive interviews celebrating three decades of magic.
          </p>
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="flex md:hidden items-center justify-center gap-1.5 text-xs text-[#FFD700]/70 font-sans mb-4 tracking-wider">
          <span>← Swipe to explore headlines →</span>
        </div>

        {/* Responsive Layout: Swipeable rail on phone, 2x3 or 3x3 on tablet/desktop */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 pb-4 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
          {homeNews.map((item) => (
            <article
              key={item.id}
              className="shrink-0 w-[84vw] max-w-[340px] md:w-auto snap-center group rounded-2xl overflow-hidden glass-panel border border-white/10 glass-card-hover flex flex-col justify-between"
            >
              {/* Image or Video preview */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#091712]">
                <img
                  src={
                    item.mediaUrl && !item.mediaUrl.includes('youtube')
                      ? item.mediaUrl
                      : 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.headline}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-transparent to-transparent opacity-80" />

                {/* Media Type Badge: Image or Video */}
                <div className="absolute top-4 left-4">
                  {item.mediaType === 'video' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-medium backdrop-blur-md">
                      <Video className="w-3 h-3" />
                      <span>Video Coverage</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-[#FFD700] text-[11px] font-medium backdrop-blur-md border border-[#FFD700]/30">
                      <ImageIcon className="w-3 h-3" />
                      <span>Press Photo / Article</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Content Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/50 mb-3 font-sans">
                    <span className="text-[#FFD700] font-semibold tracking-wider uppercase">
                      {item.publication}
                    </span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-white font-serif text-lg font-medium leading-snug group-hover:text-[#FFD700] transition-colors mb-3">
                    {item.headline}
                  </h3>

                  {item.summary && (
                    <p className="text-white/70 font-sans text-xs line-clamp-2 leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  )}
                </div>

                {item.articleUrl && (
                  <a
                    href={item.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#FFD700] font-semibold uppercase tracking-wider hover:underline"
                  >
                    <span>Read Full Story</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* "Show all" Button -> /news */}
        <div className="mt-14 text-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#071712] border border-[#FFD700]/40 text-[#FFD700] font-sans text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#FFD700] hover:text-[#050807] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all cursor-pointer"
          >
            <span>Show all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

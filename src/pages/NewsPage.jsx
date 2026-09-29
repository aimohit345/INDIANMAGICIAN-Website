import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Newspaper, Video, Image as ImageIcon, ExternalLink, Filter } from 'lucide-react';

export default function NewsPage() {
  const { data } = useSiteData();
  const allNews = data?.news || [];
  const [filter, setFilter] = useState('all'); // 'all', 'photo', 'video', 'article'

  const filteredNews = allNews.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'video') return item.mediaType === 'video' || item.category === 'video';
    if (filter === 'photo') return item.category === 'photo';
    if (filter === 'article') return item.category === 'article';
    return true;
  });

  return (
    <div className="relative z-10 min-h-screen pt-32 pb-28 px-6 md:px-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold tracking-widest uppercase mb-4">
            <Newspaper className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Media Archive</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-light text-white tracking-wide">
            In The News
          </h1>
          <p className="text-white/60 text-sm md:text-base font-sans mt-4">
            Three decades of press clippings, prime-time television broadcasts, and cultural acclaim.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {[
            { id: 'all', label: 'All Coverage' },
            { id: 'article', label: 'Articles' },
            { id: 'video', label: 'Videos & TV' },
            { id: 'photo', label: 'Press Photos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-sans tracking-[0.2em] uppercase font-semibold transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-[#FFD700] text-[#050807] shadow-[0_0_20px_rgba(255,215,0,0.35)]'
                  : 'bg-[#091813] text-white/70 border border-white/10 hover:border-[#FFD700]/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Full Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl overflow-hidden glass-panel border border-white/10 glass-card-hover flex flex-col justify-between"
            >
              {/* Media Preview */}
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

                {/* Media Type Badge */}
                <div className="absolute top-4 left-4">
                  {item.mediaType === 'video' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-medium backdrop-blur-md">
                      <Video className="w-3 h-3" />
                      <span>Video Coverage</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-[#FFD700] text-[11px] font-medium backdrop-blur-md border border-[#FFD700]/30">
                      <ImageIcon className="w-3 h-3" />
                      <span>{item.category === 'photo' ? 'Photo Story' : 'Press Article'}</span>
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

                  <h3 className="text-white font-serif text-xl font-medium leading-snug group-hover:text-[#FFD700] transition-colors mb-3">
                    {item.headline}
                  </h3>

                  {item.summary && (
                    <p className="text-white/70 font-sans text-sm leading-relaxed mb-4">
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

        {filteredNews.length === 0 && (
          <div className="text-center py-20 text-white/50">
            No news items found for this category.
          </div>
        )}
      </div>
    </div>
  );
}

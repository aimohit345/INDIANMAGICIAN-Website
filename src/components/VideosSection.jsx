import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Play, Instagram, ExternalLink, Award, Globe, Sparkles, X, Youtube } from 'lucide-react';

export default function VideosSection() {
  const { data } = useSiteData();
  const settings = data?.settings || {};
  const youtubeVideos = data?.youtubeVideos || [];
  const reels = data?.instagramReels || [];
  const reelsLayout = settings?.reelsLayout || '1x4';
  const highlights = data?.highlights || [];

  // Active YouTube video modal state
  const [activeVideo, setActiveVideo] = useState(null);

  // Helper for YouTube embed link
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  // Helper to map icon name to Lucide Icon
  const getHighlightIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'award':
        return <Award className="w-8 h-8 text-[#FFD700]" />;
      case 'globe':
        return <Globe className="w-8 h-8 text-[#00e599]" />;
      case 'sparkles':
      default:
        return <Sparkles className="w-8 h-8 text-[#FFD700]" />;
    }
  };

  // Slicing reels according to layout: 1x3 or 1x4
  const displayedReels = reelsLayout === '1x3' ? reels.slice(0, 3) : reels.slice(0, 4);

  return (
    <section id="videos" className="relative z-10 w-full py-28 md:py-36 px-6 md:px-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* ================================================================== */}
        {/* PART 1: YOUTUBE VIDEOS (2x3 Grid) */}
        {/* ================================================================== */}
        <div className="mb-28 md:mb-36">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold tracking-widest uppercase mb-4">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>Broadcast & Performances</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-white tracking-wide">
              YouTube Videos
            </h2>
            <p className="text-white/60 text-sm md:text-base font-sans mt-3">
              Witness mind-bending illusions, live stage spectacles, and unexplainable mentalism feats.
            </p>
          </div>

          {/* 2x3 Grid (6 items) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {youtubeVideos.slice(0, 6).map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group relative rounded-2xl overflow-hidden glass-card-hover border border-white/10 bg-[#07130f] cursor-pointer flex flex-col"
              >
                {/* Video Thumbnail with Play Button */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#050807]/80 backdrop-blur-md border border-[#FFD700]/50 flex items-center justify-center text-[#FFD700] group-hover:scale-110 group-hover:bg-[#FFD700] group-hover:text-[#050807] transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  {video.duration && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white/90">
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* Video Title & Meta */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="text-white font-serif text-lg font-medium line-clamp-2 group-hover:text-[#FFD700] transition-colors leading-snug">
                    {video.title}
                  </h3>
                  {video.views && (
                    <div className="mt-3 flex items-center justify-between text-xs text-white/50 font-sans">
                      <span>{video.views}</span>
                      <span className="flex items-center gap-1 text-[#FFD700]/80 group-hover:text-[#FFD700]">
                        Watch Video <ExternalLink className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* "Binge them all" Button */}
          <div className="mt-14 text-center">
            <a
              href={settings.youtubeChannelUrl || 'https://www.youtube.com/@IndianMagicianUpendra'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#071712] border border-[#FFD700]/40 text-[#FFD700] font-sans text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#FFD700] hover:text-[#050807] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all cursor-pointer"
            >
              <Youtube className="w-4 h-4 text-red-500 fill-current" />
              <span>Binge them all</span>
            </a>
          </div>
        </div>

        {/* ================================================================== */}
        {/* PART 2: INSTAGRAM REELS (1x3 or 1x4 Single Row) */}
        {/* ================================================================== */}
        <div className="mb-28 md:mb-36">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e599]/10 border border-[#00e599]/30 text-[#00e599] text-xs font-semibold tracking-widest uppercase mb-4">
              <Instagram className="w-3.5 h-3.5 text-[#00e599]" />
              <span>Short-Form Magic & Sleights</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-white tracking-wide">
              Instagram Reels
            </h2>
            <p className="text-white/60 text-sm md:text-base font-sans mt-3">
              Quick bursts of impossibility, behind-the-scenes warmups, and close-up miracle moments.
            </p>
          </div>

          {/* 1x3 or 1x4 Row with Samsung Galaxy S26 Phone Chassis */}
          <div
            className={`grid gap-6 md:gap-8 ${
              reelsLayout === '1x3'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {displayedReels.map((reel, rIdx) => (
              <div key={reel.id || rIdx} className="relative group">
                {/* Samsung S26 Flagship Hardware Buttons (Right Spine Ergonomic Placement) */}
                {/* Volume Rocker (Upper Right Spine: 21% - 31%) */}
                <div 
                  className="absolute -right-[3.5px] top-[21%] w-[3.5px] h-[11%] min-h-[44px] max-h-[58px] bg-gradient-to-r from-[#293d35] to-[#4b6659] rounded-r-[2.5px] shadow-[1px_0_4px_rgba(0,0,0,0.7)] group-hover:from-[#00e599] group-hover:to-[#00c282] transition-all duration-300 z-20 pointer-events-none" 
                  title="Volume Rocker"
                />

                {/* Power / Side Key (Middle Right Spine: 34% - 41%) */}
                <div 
                  className="absolute -right-[3.5px] top-[34%] w-[3.5px] h-[6.5%] min-h-[26px] max-h-[36px] bg-gradient-to-r from-[#293d35] to-[#4b6659] rounded-r-[2.5px] shadow-[1px_0_4px_rgba(0,0,0,0.7)] group-hover:from-[#00e599] group-hover:to-[#00c282] transition-all duration-300 z-20 pointer-events-none" 
                  title="Power / Side Key"
                />

                {/* Subtle Samsung Antenna Insulator Slits */}
                <div className="absolute -right-[2px] top-[10%] w-[2.5px] h-[3px] bg-[#14231d] rounded-r-xs z-20" />
                <div className="absolute -right-[2px] bottom-[11%] w-[2.5px] h-[3px] bg-[#14231d] rounded-r-xs z-20" />
                <div className="absolute -left-[2px] top-[10%] w-[2.5px] h-[3px] bg-[#14231d] rounded-l-xs z-20" />
                <div className="absolute -left-[2px] bottom-[11%] w-[2.5px] h-[3px] bg-[#14231d] rounded-l-xs z-20" />

                {/* Outer Titanium Phone Frame */}
                <a
                  href={reel.reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full aspect-[9/18.5] rounded-[2.3rem] p-[6px] bg-gradient-to-b from-[#22352e] via-[#12201b] to-[#0c1613] border-2 border-[#2f463c] shadow-[0_16px_36px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] group-hover:border-[#00e599]/70 group-hover:shadow-[0_20px_45px_rgba(0,229,153,0.3)] transition-all duration-500 overflow-hidden cursor-pointer"
                >
                  {/* Top Earpiece Micro-Slit */}
                  <div className="absolute top-[2.5px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#1e2e27] rounded-full z-30" />

                  {/* Inner OLED Display Bezel */}
                  <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden bg-black flex flex-col justify-between p-3.5 border border-black select-none">
                    
                    {/* Top Screen Elements: Story Progress Bar + Centered Infinity-O Camera */}
                    <div className="relative z-30 w-full pt-1">
                      {/* Live Looping Reel Video Timeline Progress Bar */}
                      <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-white rounded-full animate-reel-progress"
                          style={{
                            animationDelay: `${rIdx * 1.5}s`,
                          }}
                        />
                      </div>

                      {/* Centered Infinity-O Camera Hole Punch (Samsung Signature) */}
                      <div className="mx-auto w-3 h-3 rounded-full bg-[#050807] border border-[#21322b] flex items-center justify-center shadow-inner">
                        <div className="w-1 h-1 rounded-full bg-[#00e599]/70 animate-pulse" />
                      </div>
                    </div>

                    {/* Subtle Screen Glare Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none z-20 group-hover:opacity-100 transition-opacity" />

                    {/* Dynamic Simulated Live Video Playback Layer */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={reel.coverUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover animate-cinematic-pan"
                        style={{
                          animationDelay: `${rIdx * 2}s`,
                        }}
                        loading="lazy"
                      />
                    </div>

                    {/* Live Video Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85 z-10" />

                    {/* Right-Side Instagram Reel Action Rail */}
                    <div className="absolute right-2.5 bottom-16 z-20 flex flex-col items-center gap-3.5">
                      {/* Heart Like Button */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-red-500 transition-colors">
                          <span className="text-sm">❤️</span>
                        </div>
                        <span className="text-[9px] font-sans font-semibold text-white/90 mt-0.5">
                          {rIdx === 0 ? '48.2K' : rIdx === 1 ? '92.5K' : rIdx === 2 ? '114K' : '65.8K'}
                        </span>
                      </div>

                      {/* Comment Button */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                          <span className="text-sm">💬</span>
                        </div>
                        <span className="text-[9px] font-sans font-semibold text-white/90 mt-0.5">
                          {rIdx === 0 ? '1.2K' : rIdx === 1 ? '2.4K' : rIdx === 2 ? '3.8K' : '890'}
                        </span>
                      </div>

                      {/* Share Paper Plane Button */}
                      <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                        <span className="text-sm">↗️</span>
                      </div>

                      {/* Spinning Vinyl Music Disc */}
                      <div className="w-7 h-7 rounded-full bg-[#111] border-2 border-white/30 flex items-center justify-center animate-spin-disc">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
                      </div>
                    </div>

                    {/* Bottom Playing Information & Audio Ticker */}
                    <div className="relative z-20 pr-10">
                      {/* Magician Avatar & Handle */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <img
                          src="/hero-magician.png"
                          alt="Upendra Thakur"
                          className="w-5 h-5 rounded-full object-cover border border-[#FFD700]"
                        />
                        <span className="text-[10px] font-sans font-semibold text-white tracking-wide">
                          indianmagician_upendra
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
                      </div>

                      {/* Reel Caption */}
                      <h4 className="text-white font-serif text-xs font-medium line-clamp-2 leading-tight drop-shadow-md mb-2">
                        {reel.title}
                      </h4>

                      {/* Scrolling Audio Marquee & Live Equalizer */}
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/10">
                        {/* 4-bar Sound Equalizer Animating */}
                        <div className="flex items-end gap-[1.5px] h-3 shrink-0">
                          <span
                            className="w-[2px] bg-[#00e599] rounded-full"
                            style={{ animation: 'soundWave 0.8s ease-in-out infinite alternate' }}
                          />
                          <span
                            className="w-[2px] bg-[#00e599] rounded-full"
                            style={{ animation: 'soundWave 0.6s ease-in-out infinite 0.2s alternate' }}
                          />
                          <span
                            className="w-[2px] bg-[#00e599] rounded-full"
                            style={{ animation: 'soundWave 1.0s ease-in-out infinite 0.4s alternate' }}
                          />
                          <span
                            className="w-[2px] bg-[#00e599] rounded-full"
                            style={{ animation: 'soundWave 0.7s ease-in-out infinite 0.1s alternate' }}
                          />
                        </div>

                        {/* Audio Track Name */}
                        <span className="text-[9px] font-sans text-white/80 truncate">
                          ♫ Upendra Thakur • Original Audio - Stage Magic
                        </span>
                      </div>
                    </div>

                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* "Watch them all" Button */}
          <div className="mt-14 text-center">
            <a
              href={settings.instagramProfileUrl || 'https://www.instagram.com/indianmagician_upendra'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#071712] border border-[#00e599]/40 text-[#00e599] font-sans text-xs tracking-[0.25em] uppercase font-semibold hover:bg-[#00e599] hover:text-[#050807] hover:shadow-[0_0_25px_rgba(0,229,153,0.4)] transition-all cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Watch them all</span>
            </a>
          </div>
        </div>

        {/* ================================================================== */}
        {/* PART 3: "ABOUT INDIAN MAGICIAN" 1x3 SINGLE ROW FEATURETTE */}
        {/* ================================================================== */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl p-8 glass-panel border border-[#FFD700]/20 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#092219] border border-[#FFD700]/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,44,33,0.6)]">
                    {getHighlightIcon(item.icon)}
                  </div>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#FFD700]">
                    {item.subtitle}
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif text-white font-medium mt-1 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/70 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Embedded YouTube Video Modal Player */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-fadeIn"
          onClick={() => setActiveVideo(null)}
        >
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white hover:text-[#FFD700] flex items-center justify-center transition-colors"
            aria-label="Close video"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getEmbedUrl(activeVideo.youtubeUrl)}
              title={activeVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}

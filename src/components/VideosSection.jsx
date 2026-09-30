import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { Play, Instagram, ExternalLink, Award, Globe, Sparkles, X, Youtube, Volume2, VolumeX } from 'lucide-react';

export default function VideosSection() {
  const { data } = useSiteData();
  const settings = data?.settings || {};
  const youtubeVideos = data?.youtubeVideos || [];
  const reels = data?.instagramReels || [];
  const reelsLayout = settings?.reelsLayout || '1x4';
  const highlights = data?.highlights || [];

  // Active YouTube video modal state
  const [activeVideo, setActiveVideo] = useState(null);
  // Audio state for Instagram live gallery
  const [unmutedReelId, setUnmutedReelId] = useState(null);

  // Helper to extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
    return match ? match[1] : null;
  };

  // Helper for YouTube embed link
  const getEmbedUrl = (url) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url || '';
  };

  // Helper to get thumbnail automatically picked from video link
  const getYouTubeThumbnail = (video) => {
    const videoId = extractYouTubeId(video?.youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return video?.thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';
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
            <h2 className="text-3xl md:text-5xl font-serif font-light text-white tracking-wide">
              YouTube Videos
            </h2>
            <p className="text-white/60 text-sm md:text-base font-sans mt-3">
              Witness mind-bending illusions, live stage spectacles, and unexplainable mentalism feats.
            </p>
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="flex md:hidden items-center justify-center gap-1.5 text-xs text-[#FFD700]/70 font-sans mb-4 tracking-wider">
            <span>← Swipe to explore videos →</span>
          </div>

          {/* Responsive Layout: Swipeable horizontal rail on mobile, 2x3 grid on desktop/tablet */}
          <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 pb-4 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
            {youtubeVideos.slice(0, 6).map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="shrink-0 w-[84vw] max-w-[340px] md:w-auto snap-center group relative rounded-2xl overflow-hidden glass-card-hover border border-white/10 bg-[#07130f] cursor-pointer flex flex-col"
              >
                {/* Video Thumbnail (auto-picked from video link) with Play Button */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  <img
                    src={getYouTubeThumbnail(video)}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (e.target.src.includes('maxresdefault.jpg')) {
                        e.target.src = e.target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#050807]/80 backdrop-blur-md border border-[#FFD700]/50 flex items-center justify-center text-[#FFD700] group-hover:scale-110 group-hover:bg-[#FFD700] group-hover:text-[#050807] transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Title Below */}
                <div className="p-5 flex-1 flex flex-col justify-center">
                  <h3 className="text-white font-serif text-lg font-medium line-clamp-2 group-hover:text-[#FFD700] transition-colors leading-snug">
                    {video.title}
                  </h3>
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
        {/* PART 2: INSTAGRAM REELS (1x3 or 1x4 Single Row - Matching Suhani Shah Clean Editorial) */}
        {/* ================================================================== */}
        <div className="mb-28 md:mb-36">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-[#FFD700] block mb-2">
              WORLD'S MOST ACCLAIMED ILLUSIONIST
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase text-white tracking-[0.12em]">
              Instagram Reels
            </h2>
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 text-xs text-[#FFD700]/70 font-sans mb-4 tracking-wider">
            <span>← Swipe to explore reels →</span>
          </div>

          {/* 1x3 or 1x4 Row with Samsung Galaxy Phone Chassis: Horizontal swipe on phone, grid on tablet/desktop */}
          <div
            className={`flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none gap-5 sm:gap-6 md:gap-8 pb-6 pt-2 scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0 ${
              reelsLayout === '1x3'
                ? 'sm:grid-cols-2 lg:grid-cols-3'
                : 'sm:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {displayedReels.map((reel, rIdx) => {
              const reelMatch = (reel.reelUrl || '').match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
              const reelId = reelMatch ? reelMatch[1] : ((reel.reelUrl && !reel.reelUrl.includes('/') && reel.reelUrl.trim().length > 3) ? reel.reelUrl.trim() : null);
              const targetUrl = (reel.reelUrl && reel.reelUrl.startsWith('http'))
                ? reel.reelUrl
                : (reelId ? `https://www.instagram.com/reel/${reelId}/` : (settings.instagramProfileUrl || 'https://www.instagram.com/indianmagician_upendra'));
              const isVideo = reel.coverUrl && reel.coverUrl.match(/\.(mp4|webm|mov)$/i);

              return (
                <div key={reel.id || rIdx} className="shrink-0 w-[240px] xs:w-[260px] sm:w-auto snap-center relative group">
                  {/* Flagship Hardware Buttons (Right Spine Ergonomic Placement) */}
                  {/* Volume Rocker (Upper Right Spine: 21% - 31%) */}
                  <div 
                    className="absolute -right-[3.5px] top-[21%] w-[3.5px] h-[11%] min-h-[44px] max-h-[58px] bg-gradient-to-r from-[#293d35] to-[#4b6659] rounded-r-[2.5px] shadow-[1px_0_4px_rgba(0,0,0,0.7)] group-hover:from-[#FFD700] group-hover:to-[#d4af37] transition-all duration-300 z-20 pointer-events-none" 
                    title="Volume Rocker"
                  />

                  {/* Power / Side Key (Middle Right Spine: 34% - 41%) */}
                  <div 
                    className="absolute -right-[3.5px] top-[34%] w-[3.5px] h-[6.5%] min-h-[26px] max-h-[36px] bg-gradient-to-r from-[#293d35] to-[#4b6659] rounded-r-[2.5px] shadow-[1px_0_4px_rgba(0,0,0,0.7)] group-hover:from-[#FFD700] group-hover:to-[#d4af37] transition-all duration-300 z-20 pointer-events-none" 
                    title="Power / Side Key"
                  />

                  {/* Antenna Insulator Slits */}
                  <div className="absolute -right-[2px] top-[10%] w-[2.5px] h-[3px] bg-[#14231d] rounded-r-xs z-20" />
                  <div className="absolute -right-[2px] bottom-[11%] w-[2.5px] h-[3px] bg-[#14231d] rounded-r-xs z-20" />
                  <div className="absolute -left-[2px] top-[10%] w-[2.5px] h-[3px] bg-[#14231d] rounded-l-xs z-20" />
                  <div className="absolute -left-[2px] bottom-[11%] w-[2.5px] h-[3px] bg-[#14231d] rounded-l-xs z-20" />

                  {/* Outer Titanium Phone Frame (Clicking anywhere opens that particular reel on Instagram) */}
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full aspect-[9/18.5] rounded-[2.3rem] p-[6px] bg-gradient-to-b from-[#22352e] via-[#12201b] to-[#0c1613] border-2 border-[#2f463c] shadow-[0_16px_36px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:border-[#FFD700]/70 hover:shadow-[0_20px_45px_rgba(255,215,0,0.3)] transition-all duration-500 overflow-hidden cursor-pointer group"
                    title="Watch this Reel on Instagram"
                  >
                    {/* Top Earpiece Micro-Slit */}
                    <div className="absolute top-[2.5px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#1e2e27] rounded-full z-30 pointer-events-none" />

                    {/* Inner OLED Display Bezel */}
                    <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden bg-black border border-black select-none">
                      
                      {/* Top Centered Dynamic Island / Camera Punch Hole */}
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-2.5 bg-black rounded-full border border-white/10 flex items-center justify-end pr-1 shadow-md">
                          <div className="w-1 h-1 rounded-full bg-[#15241d]" />
                        </div>
                      </div>

                      {/* Full-Screen Live Video Stream (Plays Full Screen Edge-to-Edge) */}
                      <div className="w-full h-full overflow-hidden bg-black relative flex items-center justify-center">
                        {reelId ? (
                          <>
                            <video
                              src={`/api/instagram/video?id=${reelId}`}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                            />

                            {/* Floating Subtle Instagram Pill on Hover */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[#FFD700] text-[10px] font-sans font-semibold tracking-wider shadow-lg whitespace-nowrap">
                              <Instagram className="w-3 h-3 text-[#FFD700]" />
                              <span>Watch on Instagram ↗</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-[#07130f] text-white/40 p-4 text-center pointer-events-none">
                            <Instagram className="w-10 h-10 text-[#FFD700]/50 mb-2" />
                            <span className="text-[11px] font-sans tracking-widest uppercase">Instagram Reel</span>
                            <span className="text-[9px] text-white/30 mt-1">Paste link in admin panel</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>

          {/* "Watch Them All" Button (Matching Suhani Shah Clean Editorial Style) */}
          <div className="mt-14 text-center">
            <a
              href={settings.instagramProfileUrl || 'https://www.instagram.com/indianmagician_upendra'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-lg bg-white text-[#050807] font-sans text-xs tracking-[0.16em] uppercase font-bold hover:bg-[#FFD700] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all cursor-pointer group"
            >
              <Instagram className="w-4 h-4 text-[#050807] group-hover:scale-110 transition-transform" />
              <span>Watch Them All</span>
            </a>
          </div>
        </div>

        {/* ================================================================== */}
        {/* PART 3: "ABOUT INDIAN MAGICIAN" 1x3 SINGLE ROW FEATURETTE */}
        {/* ================================================================== */}
        <div>
          {/* Mobile Swipe Indicator */}
          <div className="flex md:hidden items-center justify-center gap-1.5 text-xs text-[#FFD700]/70 font-sans mb-3 tracking-wider">
            <span>← Swipe to explore highlights →</span>
          </div>

          <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-3 gap-5 md:gap-8 pb-4 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
            {highlights.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-[84vw] max-w-[340px] md:w-auto snap-center relative rounded-2xl p-7 md:p-8 glass-panel border border-[#FFD700]/20 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#FFD700] block mb-2">
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

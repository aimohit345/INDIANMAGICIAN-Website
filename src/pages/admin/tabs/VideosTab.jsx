import React, { useState } from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import {
  addYoutubeVideo,
  updateYoutubeVideo,
  deleteYoutubeVideo,
  addInstagramReel,
  updateInstagramReel,
  deleteInstagramReel,
  updateReelsLayout,
  updateHighlights,
  uploadImageFile,
} from '../../../utils/api';
import {
  Youtube,
  Instagram,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Sparkles,
  Save,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function VideosTab() {
  const { data, refreshData } = useSiteData();
  const settings = data?.settings || {};
  const youtubeVideos = data?.youtubeVideos || [];
  const reels = data?.instagramReels || [];
  const highlights = data?.highlights || [];
  const reelsLayout = settings?.reelsLayout || '1x4';

  // Sub-tabs: 'youtube', 'reels', 'highlights'
  const [subTab, setSubTab] = useState('youtube');

  // YouTube modal state
  const [ytModalOpen, setYtModalOpen] = useState(false);
  const [editingYt, setEditingYt] = useState(null);
  const [ytForm, setYtForm] = useState({
    title: '',
    youtubeUrl: '',
    thumbnailUrl: '',
    duration: '',
    views: '',
    order: 1,
  });

  // Reels modal state
  const [reelModalOpen, setReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState(null);
  const [reelForm, setReelForm] = useState({
    title: '',
    reelUrl: '',
    coverUrl: '',
    views: '',
    order: 1,
  });

  // Highlights state (3 cards)
  const [hlCards, setHlCards] = useState(highlights);
  const [savingHl, setSavingHl] = useState(false);
  const [hlSuccess, setHlSuccess] = useState(false);

  const [uploading, setUploading] = useState(false);

  // Layout toggle: 1x3 vs 1x4
  const handleToggleLayout = async (layout) => {
    try {
      await updateReelsLayout(layout);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // YouTube actions
  const openAddYt = () => {
    setEditingYt(null);
    setYtForm({
      title: '',
      youtubeUrl: '',
      thumbnailUrl: '',
      duration: '',
      views: '',
      order: youtubeVideos.length + 1,
    });
    setYtModalOpen(true);
  };

  const openEditYt = (v) => {
    setEditingYt(v);
    setYtForm(v);
    setYtModalOpen(true);
  };

  const handleSaveYt = async (e) => {
    e.preventDefault();
    try {
      // Auto-extract thumbnail if empty
      let thumb = ytForm.thumbnailUrl;
      if (!thumb && ytForm.youtubeUrl.includes('youtube.com/watch?v=')) {
        const vid = ytForm.youtubeUrl.split('v=')[1]?.split('&')[0];
        thumb = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
      }

      const payload = { ...ytForm, thumbnailUrl: thumb || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' };

      if (editingYt) {
        await updateYoutubeVideo(editingYt.id, payload);
      } else {
        await addYoutubeVideo(payload);
      }
      await refreshData();
      setYtModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving YouTube video.');
    }
  };

  const handleDeleteYt = async (id) => {
    if (!window.confirm('Delete this YouTube video from grid?')) return;
    try {
      await deleteYoutubeVideo(id);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Reels actions
  const openAddReel = () => {
    setEditingReel(null);
    setReelForm({
      title: '',
      reelUrl: '',
      coverUrl: '',
      views: '',
      order: reels.length + 1,
    });
    setReelModalOpen(true);
  };

  const openEditReel = (r) => {
    setEditingReel(r);
    setReelForm(r);
    setReelModalOpen(true);
  };

  const handleSaveReel = async (e) => {
    e.preventDefault();
    try {
      if (editingReel) {
        await updateInstagramReel(editingReel.id, reelForm);
      } else {
        await addInstagramReel(reelForm);
      }
      await refreshData();
      setReelModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReel = async (id) => {
    if (!window.confirm('Delete this Reel from row?')) return;
    try {
      await deleteInstagramReel(id);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Highlights actions
  const handleSaveHighlights = async (e) => {
    e.preventDefault();
    try {
      setSavingHl(true);
      await updateHighlights(hlCards);
      await refreshData();
      setHlSuccess(true);
      setTimeout(() => setHlSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error saving highlights.');
    } finally {
      setSavingHl(false);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Sub Tab Navigation */}
      <div className="flex flex-wrap gap-3 mb-8 pb-4 border-b border-white/10">
        <button
          onClick={() => setSubTab('youtube')}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'youtube'
              ? 'bg-[#FFD700] text-[#050807]'
              : 'bg-[#091712] text-white/70 hover:text-white'
          }`}
        >
          <Youtube className="w-4 h-4 text-red-500" />
          <span>YouTube Videos (2x3 Grid)</span>
        </button>

        <button
          onClick={() => setSubTab('reels')}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'reels'
              ? 'bg-[#FFD700] text-[#050807]'
              : 'bg-[#091712] text-white/70 hover:text-white'
          }`}
        >
          <Instagram className="w-4 h-4 text-[#00e599]" />
          <span>Instagram Reels ({reelsLayout} Row)</span>
        </button>

        <button
          onClick={() => setSubTab('highlights')}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            subTab === 'highlights'
              ? 'bg-[#FFD700] text-[#050807]'
              : 'bg-[#091712] text-white/70 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FFD700]" />
          <span>About Indian Magician (1x3 Row)</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 1: YOUTUBE VIDEOS (2x3 GRID) */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'youtube' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif text-white font-medium">
                YouTube Videos 2x3 Grid ({youtubeVideos.length} Items)
              </h3>
              <p className="text-xs text-white/50 font-sans mt-0.5">
                The top 6 videos appear in the 2 rows x 3 columns desktop grid.
              </p>
            </div>
            <button
              onClick={openAddYt}
              className="px-4 py-2 rounded-xl bg-[#0a231b] border border-[#FFD700]/40 text-[#FFD700] text-xs uppercase tracking-wider font-semibold hover:bg-[#FFD700] hover:text-[#050807] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Video
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youtubeVideos.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-[#091712] border border-white/10 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-[#FFD700] font-mono">
                    #{item.order}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="text-white text-sm font-medium line-clamp-2">{item.title}</h4>
                  <div className="flex items-center justify-between text-xs text-white/50 mt-3 pt-2 border-t border-white/5">
                    <span>{item.views || 'Video'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditYt(item)}
                        className="p-1.5 rounded-lg bg-white/5 text-white/80 hover:text-[#FFD700]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteYt(item.id)}
                        className="p-1.5 rounded-lg bg-red-950/30 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 2: INSTAGRAM REELS (1x3 or 1x4 ROW) */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'reels' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif text-white font-medium">
                Instagram Reels Manager ({reels.length} Items)
              </h3>
              <p className="text-xs text-white/50 font-sans mt-0.5">
                Manage vertical 9:16 aspect ratio reels shown in a single row.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Layout Switcher (1x3 vs 1x4) */}
              <div className="flex items-center gap-1 p-1 bg-[#050807] rounded-xl border border-white/10 text-xs">
                <span className="px-2 text-white/50 uppercase font-sans text-[10px]">Layout:</span>
                <button
                  type="button"
                  onClick={() => handleToggleLayout('1x3')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    reelsLayout === '1x3' ? 'bg-[#00e599] text-[#050807]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  1x3 Row
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleLayout('1x4')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    reelsLayout === '1x4' ? 'bg-[#00e599] text-[#050807]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  1x4 Row
                </button>
              </div>

              <button
                onClick={openAddReel}
                className="px-4 py-2 rounded-xl bg-[#0a231b] border border-[#00e599]/40 text-[#00e599] text-xs uppercase tracking-wider font-semibold hover:bg-[#00e599] hover:text-[#050807] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Reel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {reels.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-[#091712] border border-white/10 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-black/40">
                  <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-[#00e599] font-mono">
                    #{item.order}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-white text-xs font-medium line-clamp-2">{item.title}</h4>
                  <div className="flex items-center justify-between text-xs text-white/50 mt-2 pt-2 border-t border-white/5">
                    <span>{item.views || 'Reel'}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditReel(item)}
                        className="p-1 rounded bg-white/5 text-white/80 hover:text-[#00e599]"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteReel(item.id)}
                        className="p-1 rounded bg-red-950/30 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 3: "ABOUT INDIAN MAGICIAN" 1x3 SINGLE ROW FEATURETTE */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'highlights' && (
        <form onSubmit={handleSaveHighlights} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif text-white font-medium">
                "About Indian Magician" 1x3 Row Featurette
              </h3>
              <p className="text-xs text-white/50 font-sans mt-0.5">
                Edit the 3 pillar highlight cards displayed directly below Reels.
              </p>
            </div>
            {hlSuccess && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hlCards.map((card, idx) => (
              <div key={card.id || idx} className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
                <span className="text-xs font-mono text-[#FFD700]">Card #{idx + 1}</span>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Subtitle Tag
                  </label>
                  <input
                    type="text"
                    value={card.subtitle}
                    onChange={(e) => {
                      const updated = [...hlCards];
                      updated[idx].subtitle = e.target.value;
                      setHlCards(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...hlCards];
                      updated[idx].title = e.target.value;
                      setHlCards(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={card.description}
                    onChange={(e) => {
                      const updated = [...hlCards];
                      updated[idx].description = e.target.value;
                      setHlCards(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={savingHl}
            className="px-6 py-2.5 rounded-xl bg-[#FFD700] text-[#050807] font-bold text-xs uppercase tracking-wider hover:bg-[#ffe566] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savingHl ? 'SAVING...' : 'SAVE 3 FEATURE CARDS'}</span>
          </button>
        </form>
      )}

      {/* YouTube Modal */}
      {ytModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-lg font-serif text-white">
                {editingYt ? 'Edit YouTube Video' : 'Add YouTube Video to Grid'}
              </h3>
              <button onClick={() => setYtModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveYt} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Video Headline / Title
                </label>
                <input
                  type="text"
                  required
                  value={ytForm.title}
                  onChange={(e) => setYtForm({ ...ytForm, title: e.target.value })}
                  placeholder="e.g. Vanishing a Sports Car in Front of 5,000 People"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  required
                  value={ytForm.youtubeUrl}
                  onChange={(e) => setYtForm({ ...ytForm, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Thumbnail Image URL (Optional - auto-generated if blank)
                </label>
                <input
                  type="text"
                  value={ytForm.thumbnailUrl}
                  onChange={(e) => setYtForm({ ...ytForm, thumbnailUrl: e.target.value })}
                  placeholder="https://... or leave empty to auto-extract"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                    Duration Tag
                  </label>
                  <input
                    type="text"
                    value={ytForm.duration}
                    onChange={(e) => setYtForm({ ...ytForm, duration: e.target.value })}
                    placeholder="e.g. 12:45"
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                    Views Display
                  </label>
                  <input
                    type="text"
                    value={ytForm.views}
                    onChange={(e) => setYtForm({ ...ytForm, views: e.target.value })}
                    placeholder="e.g. 1.2M views"
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setYtModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFD700] text-[#050807] font-bold text-xs uppercase tracking-wider"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reel Modal */}
      {reelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-lg font-serif text-white">
                {editingReel ? 'Edit Instagram Reel' : 'Add Instagram Reel'}
              </h3>
              <button onClick={() => setReelModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#00e599] font-semibold mb-1">
                  Reel Caption / Title
                </label>
                <input
                  type="text"
                  required
                  value={reelForm.title}
                  onChange={(e) => setReelForm({ ...reelForm, title: e.target.value })}
                  placeholder="e.g. Card morphs into gold dust in slow-motion ✨"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#00e599] font-semibold mb-1">
                  Instagram Reel URL
                </label>
                <input
                  type="url"
                  required
                  value={reelForm.reelUrl}
                  onChange={(e) => setReelForm({ ...reelForm, reelUrl: e.target.value })}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#00e599] font-semibold mb-1">
                  Cover Image URL (9:16 Vertical)
                </label>
                <input
                  type="text"
                  required
                  value={reelForm.coverUrl}
                  onChange={(e) => setReelForm({ ...reelForm, coverUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#00e599] font-semibold mb-1">
                  Views Tag
                </label>
                <input
                  type="text"
                  value={reelForm.views}
                  onChange={(e) => setReelForm({ ...reelForm, views: e.target.value })}
                  placeholder="e.g. 450K"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setReelModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#00e599] text-[#050807] font-bold text-xs uppercase tracking-wider"
                >
                  Save Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import {
  addNewsItem,
  updateNewsItem,
  deleteNewsItem,
  uploadImageFile,
} from '../../../utils/api';
import { Plus, Trash2, Edit2, Newspaper, Video, Image as ImageIcon, Upload, X } from 'lucide-react';

export default function NewsTab() {
  const { data, refreshData } = useSiteData();
  const news = data?.news || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    headline: '',
    publication: '',
    date: '',
    mediaType: 'image', // 'image' or 'video'
    category: 'article', // 'article', 'video', 'photo'
    mediaUrl: '',
    articleUrl: '',
    summary: '',
    showOnHome: true,
  });

  const [uploading, setUploading] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      headline: '',
      publication: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      mediaType: 'image',
      category: 'article',
      mediaUrl: '',
      articleUrl: '',
      summary: '',
      showOnHome: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      headline: item.headline || '',
      publication: item.publication || '',
      date: item.date || '',
      mediaType: item.mediaType || 'image',
      category: item.category || 'article',
      mediaUrl: item.mediaUrl || '',
      articleUrl: item.articleUrl || '',
      summary: item.summary || '',
      showOnHome: item.showOnHome !== false,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadImageFile(file);
      if (res.success) {
        setForm((prev) => ({ ...prev, mediaUrl: res.url }));
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.headline || !form.publication) return;

    try {
      if (editingItem) {
        await updateNewsItem(editingItem.id, form);
      } else {
        await addNewsItem(form);
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving news item.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news item?')) return;
    try {
      await deleteNewsItem(id);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium">
            In The News Manager ({news.length} Items)
          </h2>
          <p className="text-xs text-white/50 font-sans mt-1">
            Manage press clippings, broadcast mentions, and configure homepage 2x3 grid vs /news page.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#0a231b] border border-[#FFD700]/40 text-[#FFD700] text-xs uppercase tracking-wider font-semibold hover:bg-[#FFD700] hover:text-[#050807] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add News Item
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 rounded-xl overflow-hidden bg-black/40 shrink-0">
                <img src={item.mediaUrl} alt={item.headline} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#FFD700] uppercase">
                    {item.publication}
                  </span>
                  <span className="text-xs text-white/40">• {item.date}</span>
                  {item.showOnHome ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-[10px] text-emerald-300">
                      Pinned to Home (2x3)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/50">
                      /news Only
                    </span>
                  )}
                  <span className="text-[10px] text-white/40 uppercase">[{item.mediaType}]</span>
                </div>
                <h4 className="text-white text-sm font-medium line-clamp-1">{item.headline}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-lg bg-white/5 text-white/80 hover:text-[#FFD700]"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg bg-red-950/30 text-red-400 hover:text-red-300"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl glass-panel rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-lg font-serif text-white">
                {editingItem ? 'Edit News Item' : 'Add New News Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Article Headline / Title
                </label>
                <input
                  type="text"
                  required
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  placeholder="e.g. Upendra Thakur Mesmerizes 10,000 Delegates..."
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                    Publication / Media Source
                  </label>
                  <input
                    type="text"
                    required
                    value={form.publication}
                    onChange={(e) => setForm({ ...form, publication: e.target.value })}
                    placeholder="e.g. The Times of India"
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                    Date String
                  </label>
                  <input
                    type="text"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. March 15, 2026"
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                    Media Type
                  </label>
                  <select
                    value={form.mediaType}
                    onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  >
                    <option value="image">Image (Press Clipping / Photo)</option>
                    <option value="video">Video (Interview / TV broadcast)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                    Filter Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  >
                    <option value="article">Article</option>
                    <option value="video">Video & TV</option>
                    <option value="photo">Press Photo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Media Image/Thumbnail URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.mediaUrl}
                    onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#0a231b] border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  External Article / Coverage URL
                </label>
                <input
                  type="url"
                  value={form.articleUrl}
                  onChange={(e) => setForm({ ...form, articleUrl: e.target.value })}
                  placeholder="https://timesofindia.indiatimes.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Short Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              {/* Checkbox: Show on Homepage 2x3 Grid */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#050807] border border-white/10">
                <input
                  type="checkbox"
                  id="showOnHome"
                  checked={form.showOnHome}
                  onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FFD700] focus:ring-0 bg-[#091712]"
                />
                <label htmlFor="showOnHome" className="text-xs text-white/90 font-sans cursor-pointer">
                  Show on Homepage 2x3 Grid (Uncheck to only show on dedicated /news page)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFD700] text-[#050807] font-bold text-xs uppercase tracking-wider"
                >
                  Save News Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

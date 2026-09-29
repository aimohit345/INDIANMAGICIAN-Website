import React, { useState } from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import { addPage, updatePage, deletePage } from '../../../utils/api';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, ExternalLink, FileText, X } from 'lucide-react';

export default function DynamicPagesTab() {
  const { data, refreshData } = useSiteData();
  const pages = data?.pages || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    heroSubtitle: '',
    content: '',
    features: ['Feature highlight 1', 'Feature highlight 2'],
    showInFooter: true,
  });

  const openAddModal = () => {
    setEditingPage(null);
    setForm({
      title: '',
      slug: '',
      heroSubtitle: '',
      content: '',
      features: ['Highlight 1', 'Highlight 2'],
      showInFooter: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPage(p);
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      heroSubtitle: p.heroSubtitle || '',
      content: p.content || '',
      features: p.features || [],
      showInFooter: p.showInFooter !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.slug) return;

    try {
      if (editingPage) {
        await updatePage(editingPage.id, form);
      } else {
        await addPage(form);
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving custom page.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this standalone page?')) return;
    try {
      await deletePage(id);
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
            Dynamic Custom Pages ({pages.length})
          </h2>
          <p className="text-xs text-white/50 font-sans mt-1">
            Create standalone bespoke landing pages (e.g. /page/corporate-shows).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#0a231b] border border-[#FFD700]/40 text-[#FFD700] text-xs uppercase tracking-wider font-semibold hover:bg-[#FFD700] hover:text-[#050807] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Page
        </button>
      </div>

      <div className="space-y-4">
        {pages.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#00e599]">/page/{p.slug}</span>
                {p.showInFooter && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-[10px] text-emerald-300">
                    Linked in Footer
                  </span>
                )}
              </div>
              <h3 className="text-white text-base font-serif font-medium">{p.title}</h3>
              <p className="text-xs text-white/60 font-sans line-clamp-1 mt-1">{p.heroSubtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/page/${p.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-[#FFD700] hover:bg-[#FFD700]/10 flex items-center gap-1"
              >
                <span>View Live</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => openEditModal(p)}
                className="p-2 rounded-lg bg-white/5 text-white/80 hover:text-[#FFD700]"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
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
                {editingPage ? 'Edit Page' : 'Create Custom Standalone Page'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                    setForm({ ...form, title, slug: form.slug || slug });
                  }}
                  placeholder="e.g. Corporate Keynotes & Luxury Galas"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Custom URL Slug (/page/:slug)
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="e.g. corporate-shows"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Hero Subtitle Tag
                </label>
                <input
                  type="text"
                  value={form.heroSubtitle}
                  onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                  placeholder="e.g. Bespoke Illusion Experiences for World-Class Brands"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Main Page Content (Rich Text)
                </label>
                <textarea
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write editorial description, details, venue requirements..."
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              {/* Show in footer checkbox */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#050807] border border-white/10">
                <input
                  type="checkbox"
                  id="showInFooter"
                  checked={form.showInFooter}
                  onChange={(e) => setForm({ ...form, showInFooter: e.target.checked })}
                  className="w-4 h-4 rounded text-[#FFD700] focus:ring-0 bg-[#091712]"
                />
                <label htmlFor="showInFooter" className="text-xs text-white/90 font-sans cursor-pointer">
                  Display link to this page in Website Footer ("Bespoke Shows" column)
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
                  Save Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

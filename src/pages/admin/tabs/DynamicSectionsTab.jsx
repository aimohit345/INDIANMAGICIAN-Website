import React, { useState } from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import { addSection, updateSection, deleteSection } from '../../../utils/api';
import { Plus, Trash2, Edit2, Layers, CheckCircle2, X } from 'lucide-react';

export default function DynamicSectionsTab() {
  const { data, refreshData } = useSiteData();
  const sections = data?.sections || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSec, setEditingSec] = useState(null);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    layout: 'grid', // 'grid', 'text', 'banner'
    content: '',
    cards: [
      { title: 'Feature 1', desc: 'Description 1' },
      { title: 'Feature 2', desc: 'Description 2' },
      { title: 'Feature 3', desc: 'Description 3' },
    ],
    enabled: true,
    order: 1,
  });

  const openAddModal = () => {
    setEditingSec(null);
    setForm({
      title: '',
      subtitle: '',
      layout: 'grid',
      content: '',
      cards: [
        { title: '', desc: '' },
        { title: '', desc: '' },
        { title: '', desc: '' },
      ],
      enabled: true,
      order: sections.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingSec(s);
    setForm({
      title: s.title || '',
      subtitle: s.subtitle || '',
      layout: s.layout || 'grid',
      content: s.content || '',
      cards: s.cards || [],
      enabled: s.enabled !== false,
      order: s.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingSec) {
        await updateSection(editingSec.id, form);
      } else {
        await addSection(form);
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving section.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this custom section from homepage?')) return;
    try {
      await deleteSection(id);
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
            Dynamic Homepage Sections ({sections.length})
          </h2>
          <p className="text-xs text-white/50 font-sans mt-1">
            Build custom content and grid sections dynamically on the homepage.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#0a231b] border border-[#FFD700]/40 text-[#FFD700] text-xs uppercase tracking-wider font-semibold hover:bg-[#FFD700] hover:text-[#050807] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="p-6 rounded-2xl glass-panel border border-white/10 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#FFD700]">#{sec.order}</span>
                <span className="text-xs uppercase tracking-wider text-white/50">[{sec.layout}]</span>
                {sec.subtitle && (
                  <span className="text-xs text-[#00e599] font-medium">{sec.subtitle}</span>
                )}
              </div>
              <h3 className="text-white text-base font-serif font-medium">{sec.title}</h3>
              <p className="text-xs text-white/60 font-sans line-clamp-1 mt-1">{sec.content}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(sec)}
                className="p-2 rounded-lg bg-white/5 text-white/80 hover:text-[#FFD700]"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(sec.id)}
                className="p-2 rounded-lg bg-red-950/30 text-red-400 hover:text-red-300"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 text-white/40 text-sm">
            No dynamic sections configured. Click "Add Section" above to create one.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl glass-panel rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-lg font-serif text-white">
                {editingSec ? 'Edit Dynamic Section' : 'Create Dynamic Section'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Prestigious Honors & Accolades"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Subtitle Tag
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Recognitions from World Magic Bodies"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Intro Description
                </label>
                <textarea
                  rows={2}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              {/* Grid Cards (3 items) */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
                  Featured Cards (Up to 3)
                </label>
                <div className="space-y-3">
                  {form.cards.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#050807] border border-white/5 space-y-2">
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => {
                          const updated = [...form.cards];
                          updated[i].title = e.target.value;
                          setForm({ ...form, cards: updated });
                        }}
                        placeholder={`Card ${i + 1} Title`}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#091712] border border-white/10 text-white text-xs"
                      />
                      <input
                        type="text"
                        value={c.desc}
                        onChange={(e) => {
                          const updated = [...form.cards];
                          updated[i].desc = e.target.value;
                          setForm({ ...form, cards: updated });
                        }}
                        placeholder={`Card ${i + 1} Description`}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#091712] border border-white/10 text-white text-xs"
                      />
                    </div>
                  ))}
                </div>
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
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

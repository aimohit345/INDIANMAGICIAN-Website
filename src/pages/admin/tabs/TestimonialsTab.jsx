import React, { useState } from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import {
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../../../utils/api';
import { Plus, Trash2, Edit2, Quote, X } from 'lucide-react';

export default function TestimonialsTab() {
  const { data, refreshData } = useSiteData();
  const testimonials = data?.testimonials || [];

  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    quote: '',
    author: '',
    designation: '',
  });

  const openAddModal = () => {
    setEditingItem(null);
    setForm({ quote: '', author: '', designation: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      quote: item.quote || '',
      author: item.author || '',
      designation: item.designation || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.quote || !form.author) return;

    try {
      if (editingItem) {
        await updateTestimonial(editingItem.id, form);
      } else {
        await addTestimonial(form);
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save testimonial.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial slide?')) return;
    try {
      await deleteTestimonial(id);
      await refreshData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete testimonial.');
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium">
            Testimonials Slider Manager ({testimonials.length} Slides)
          </h2>
          <p className="text-xs text-white/50 font-sans mt-1">
            Edit the quotes and reviewer attributions that circulate on the homepage slider.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#0a231b] border border-[#FFD700]/40 text-[#FFD700] text-xs uppercase tracking-wider font-semibold hover:bg-[#FFD700] hover:text-[#050807] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                <span className="font-mono text-[#FFD700]">Slide #{idx + 1}</span>
                <Quote className="w-4 h-4 text-[#FFD700]/50" />
              </div>
              <p className="text-sm font-serif italic text-white/90 leading-relaxed mb-4">
                “{item.quote}”
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-serif font-bold text-[#FFD700]">{item.author}</h4>
                <p className="text-xs text-white/60 font-sans">{item.designation}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-lg bg-white/5 text-white/80 hover:text-[#FFD700] transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-950/30 text-red-400 hover:text-red-300 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-lg font-serif text-white">
                {editingItem ? 'Edit Testimonial Slide' : 'Add New Testimonial Slide'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Review Quote
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  placeholder="e.g. An unforgettable evening of pure wonder..."
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="e.g. Rajesh Mehta"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Designation / Company / Event Type
                </label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="e.g. VP Marketing, Tata Consultancy Services"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

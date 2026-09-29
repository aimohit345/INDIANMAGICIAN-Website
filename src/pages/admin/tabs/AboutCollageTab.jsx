import React, { useState } from 'react';
import { useSiteData } from '../../../context/SiteDataContext';
import {
  updateAbout,
  addCollagePhoto,
  updateCollagePhoto,
  deleteCollagePhoto,
  uploadImageFile,
} from '../../../utils/api';
import { Save, Plus, Trash2, Edit2, Upload, CheckCircle2, X } from 'lucide-react';

export default function AboutCollageTab() {
  const { data, refreshData } = useSiteData();
  const currentAbout = data?.about || {};
  const currentCollage = data?.collage || [];

  // Bio state
  const [bioForm, setBioForm] = useState({
    title: currentAbout.title || 'About Upendra Thakur',
    lead: currentAbout.lead || '',
    bioParagraphs: currentAbout.bioParagraphs || [],
  });

  const [savingBio, setSavingBio] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);

  // Collage modal state
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    title: '',
    caption: '',
    imageUrl: '',
    order: 1,
  });
  const [uploading, setUploading] = useState(false);

  // Handle Bio Save
  const handleBioSave = async (e) => {
    e.preventDefault();
    try {
      setSavingBio(true);
      await updateAbout(bioForm);
      await refreshData();
      setBioSuccess(true);
      setTimeout(() => setBioSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update About Bio.');
    } finally {
      setSavingBio(false);
    }
  };

  const handleParagraphChange = (index, val) => {
    const updated = [...bioForm.bioParagraphs];
    updated[index] = val;
    setBioForm({ ...bioForm, bioParagraphs: updated });
  };

  const addParagraph = () => {
    setBioForm({
      ...bioForm,
      bioParagraphs: [...bioForm.bioParagraphs, 'New bio paragraph...'],
    });
  };

  const removeParagraph = (idx) => {
    const updated = bioForm.bioParagraphs.filter((_, i) => i !== idx);
    setBioForm({ ...bioForm, bioParagraphs: updated });
  };

  // Open modal for add/edit photo
  const openAddModal = () => {
    setEditingPhoto(null);
    setPhotoForm({
      title: '',
      caption: '',
      imageUrl: '',
      order: currentCollage.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setPhotoForm({
      title: photo.title || '',
      caption: photo.caption || '',
      imageUrl: photo.imageUrl || '',
      order: photo.order || 1,
    });
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadImageFile(file);
      if (res.success) {
        setPhotoForm((prev) => ({ ...prev, imageUrl: res.url }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload collage photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.imageUrl) return;

    try {
      if (editingPhoto) {
        await updateCollagePhoto(editingPhoto.id, photoForm);
      } else {
        await addCollagePhoto(photoForm);
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save collage photo.');
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Delete this photo from the collage?')) return;
    try {
      await deleteCollagePhoto(id);
      await refreshData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete photo.');
    }
  };

  return (
    <div className="max-w-5xl space-y-14">
      {/* ------------------------------------------------------------- */}
      {/* 1. ABOUT BIO MANAGER */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-serif text-white font-medium">About Bio Manager</h2>
            <p className="text-xs text-white/50 font-sans mt-0.5">
              Edit the text displayed inside the glass container over the 3D card.
            </p>
          </div>
          {bioSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bio Updated!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleBioSave} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={bioForm.title}
              onChange={(e) => setBioForm({ ...bioForm, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
              Italic Lead Hook
            </label>
            <textarea
              rows={2}
              value={bioForm.lead}
              onChange={(e) => setBioForm({ ...bioForm, lead: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider text-[#FFD700] font-semibold">
                Editorial Paragraphs ({bioForm.bioParagraphs.length})
              </label>
              <button
                type="button"
                onClick={addParagraph}
                className="text-xs text-[#00e599] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Paragraph
              </button>
            </div>
            <div className="space-y-3">
              {bioForm.bioParagraphs.map((para, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => handleParagraphChange(i, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(i)}
                    className="p-2 text-red-400 hover:text-red-300"
                    title="Remove paragraph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={savingBio}
            className="px-6 py-2.5 rounded-xl bg-[#FFD700] text-[#050807] font-bold text-xs uppercase tracking-wider hover:bg-[#ffe566] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{savingBio ? 'SAVING...' : 'SAVE BIO'}</span>
          </button>
        </form>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MODERN PICTURES COLLAGE CRUD (7-8 Photos) */}
      {/* ------------------------------------------------------------- */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-serif text-white font-medium">
              Collage Gallery Manager ({currentCollage.length} Photos)
            </h2>
            <p className="text-xs text-white/50 font-sans mt-0.5">
              Manage the 7–8 Bento collage photos below the bio block.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#0a231b] border border-[#FFD700]/40 text-[#FFD700] text-xs uppercase tracking-wider font-semibold hover:bg-[#FFD700] hover:text-[#050807] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {currentCollage.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-[#091712] border border-white/10 flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-[#FFD700] font-mono">
                  #{item.order}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-white text-sm font-medium line-clamp-1">{item.title}</h4>
                <p className="text-xs text-white/50 line-clamp-1 mt-0.5">{item.caption}</p>
                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-white/5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-white/5 text-white/80 hover:text-[#FFD700] transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(item.id)}
                    className="p-1.5 rounded-lg bg-red-950/30 text-red-400 hover:text-red-300 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-lg font-serif text-white">
                {editingPhoto ? 'Edit Collage Photo' : 'Add New Collage Photo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  required
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="e.g. Card Levitation Showcase"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Caption / Venue
                </label>
                <input
                  type="text"
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  placeholder="e.g. Live at Siri Fort Auditorium"
                  className="w-full px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Image URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={photoForm.imageUrl}
                    onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                    placeholder="https://... or /uploads/..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
                  />
                  <label className="px-3 py-2 rounded-xl bg-[#0a231b] border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={photoForm.order}
                  onChange={(e) => setPhotoForm({ ...photoForm, order: Number(e.target.value) })}
                  className="w-24 px-3 py-2 rounded-xl bg-[#091712] border border-white/10 text-white text-sm"
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
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

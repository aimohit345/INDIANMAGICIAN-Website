import React, { useState } from 'react';
import { updateSettings, uploadImageFile } from '../../../utils/api';
import { useSiteData } from '../../../context/SiteDataContext';
import { Save, Upload, CheckCircle2 } from 'lucide-react';

export default function GlobalSettingsTab() {
  const { data, refreshData } = useSiteData();
  const currentSettings = data?.settings || {};

  const [form, setForm] = useState({
    heroTitle: currentSettings.heroTitle || 'UPENDRA THAKUR',
    heroSubtitle: currentSettings.heroSubtitle || 'Master Illusionist & Mentalist',
    heroBgImage: currentSettings.heroBgImage || '/hero-magician.png',
    brandName: currentSettings.brandName || 'INDIAN MAGICIAN',
    contactEmail: currentSettings.contactEmail || 'indianmagician.upendra@gmail.com',
    whatsappNumber: currentSettings.whatsappNumber || '919810162724',
    youtubeChannelUrl: currentSettings.youtubeChannelUrl || 'https://www.youtube.com/@IndianMagicianUpendra',
    instagramProfileUrl: currentSettings.instagramProfileUrl || 'https://www.instagram.com/indianmagician_upendra',
    adminPassword: currentSettings.adminPassword || 'magicadmin123',
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadImageFile(file);
      if (res.success) {
        setForm((prev) => ({ ...prev, heroBgImage: res.url }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSavedSuccess(false);
      await updateSettings(form);
      await refreshData();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error updating settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-serif text-white font-medium">Hero & Global Settings</h2>
          <p className="text-xs text-white/50 font-sans mt-1">
            Configure identity, hero typography, contact conduits, and social targets.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-sans">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved in Real Time!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
              Navbar Brand Text
            </label>
            <input
              type="text"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
          </div>

          {/* Hero Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
              Hero Giant Title
            </label>
            <input
              type="text"
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
          </div>
        </div>

        {/* Hero Subtitle */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
            Hero Subtitle
          </label>
          <input
            type="text"
            value={form.heroSubtitle}
            onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
          />
        </div>

        {/* Hero Background Image URL & File Upload */}
        <div className="p-5 rounded-2xl bg-[#091712] border border-white/10">
          <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
            Hero Background Image
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              value={form.heroBgImage}
              onChange={(e) => setForm({ ...form, heroBgImage: e.target.value })}
              placeholder="/hero-magician.png or https://..."
              className="flex-1 w-full px-4 py-3 rounded-xl bg-[#050807] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
            <label className="px-5 py-3 rounded-xl bg-[#0a231b] border border-[#FFD700]/30 text-[#FFD700] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#FFD700] hover:text-[#050807] transition-all flex items-center gap-2 shrink-0">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          {form.heroBgImage && (
            <div className="mt-4 flex items-center gap-3">
              <img
                src={form.heroBgImage}
                alt="Hero Preview"
                className="w-20 h-14 object-cover rounded-lg border border-white/20"
              />
              <span className="text-xs text-white/50">Current Hero Image Preview</span>
            </div>
          )}
        </div>

        {/* Conduits: Email & WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
              WhatsApp Number (with country code, no +)
            </label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
          </div>
        </div>

        {/* Targets: YouTube Channel & Instagram Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
              YouTube Channel URL ("Binge them all" Target)
            </label>
            <input
              type="url"
              value={form.youtubeChannelUrl}
              onChange={(e) => setForm({ ...form, youtubeChannelUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
              Instagram Profile URL ("Watch them all" Target)
            </label>
            <input
              type="url"
              value={form.instagramProfileUrl}
              onChange={(e) => setForm({ ...form, instagramProfileUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#091712] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
            />
          </div>
        </div>

        {/* Admin Password Change */}
        <div className="p-5 rounded-2xl bg-[#091712] border border-white/10">
          <label className="block text-xs uppercase tracking-wider text-[#FFD700] font-semibold mb-2">
            Admin Master Password
          </label>
          <input
            type="text"
            value={form.adminPassword}
            onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
            className="w-full max-w-md px-4 py-3 rounded-xl bg-[#050807] border border-white/10 text-white text-sm focus:border-[#FFD700] focus:outline-none"
          />
          <p className="text-[11px] text-white/40 mt-1">Used to access this /admin portal.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl bg-[#FFD700] text-[#050807] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#ffe566] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'SAVING SETTINGS...' : 'SAVE SETTINGS'}</span>
        </button>
      </form>
    </div>
  );
}

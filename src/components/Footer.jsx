import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { submitContactInquiry } from '../utils/api';
import confetti from 'canvas-confetti';
import { Mail, MessageCircle, Lock, ArrowUp, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { data } = useSiteData();
  const settings = data?.settings || {};
  const pages = data?.pages || [];
  const navigate = useNavigate();
  const location = useLocation();

  const email = settings.contactEmail || 'indianmagician.upendra@gmail.com';
  const whatsapp = settings.whatsappNumber || '919810162724';
  const brandHeading = settings.heroTitle || 'Upendra Thakur';

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const res = await submitContactInquiry(formData);

      if (res.success) {
        setSubmitted(true);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#FFD700', '#d4af37', '#00e599', '#ffffff'],
        });

        // Trigger mailto fallback for user's convenience
        const mailtoUri = `mailto:${email}?subject=${encodeURIComponent(
          formData.subject
        )}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        window.open(mailtoUri, '_blank');
      } else {
        setErrorMessage(res.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error while submitting. Please try emailing directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavClick = (hash) => {
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-[#040706]/85 backdrop-blur-xl text-white pt-20 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* ============================================================= */}
        {/* 1. TAILORED FOOTER CONTACT FORM SECTION                       */}
        {/* ============================================================= */}
        <div className="max-w-4xl mx-auto mb-20 pb-16 border-b border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide">
              Have a Query?
            </h2>
            <p className="text-white/60 font-sans text-xs md:text-sm mt-2">
              Fill in the details below and we will tailor the perfect illusion experience for your event.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-[#FFD700]/25 shadow-2xl relative">
            {submitted ? (
              <div className="py-8 flex flex-col items-center text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-[#FFD700]/20 border border-[#FFD700] flex items-center justify-center text-[#FFD700] mb-4 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl md:text-2xl font-serif text-white font-medium mb-2">
                  Thank You for Reaching Out
                </h4>
                <p className="text-xs md:text-sm text-white/80 font-sans max-w-md leading-relaxed mb-6">
                  Your inquiry has been received with wonder! Magician Upendra Thakur’s team will review your requirements and get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#FFD700] text-[#050807] font-semibold text-xs tracking-[0.2em] uppercase font-sans hover:shadow-[0_0_15px_#FFD700] transition-all cursor-pointer"
                >
                  Send Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs font-sans">
                    {errorMessage}
                  </div>
                )}

                {/* 2-Column: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-sans uppercase tracking-[0.18em] text-[#FFD700] font-semibold mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#071712] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#FFD700] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-sans uppercase tracking-[0.18em] text-[#FFD700] font-semibold mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#071712] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#FFD700] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Subject / Event Type */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.18em] text-[#FFD700] font-semibold mb-1.5">
                    Subject / Event Type <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Annual Corporate Keynote / Luxury Private Gala"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#071712] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#FFD700] focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.18em] text-[#FFD700] font-semibold mb-1.5">
                    Message / Event Details
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about the dates, venue city, audience size, or special requirements..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#071712] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#FFD700] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#ffe066] to-[#d4af37] text-[#050807] font-semibold text-xs tracking-[0.25em] uppercase font-sans hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Magical Inquiry...' : 'Submit Inquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ============================================================= */}
        {/* 2. FOOTER NAVIGATION & INFORMATION GRID                       */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[#FFD700] text-xs font-semibold tracking-[0.3em] uppercase block mb-3">
                INDIAN MAGICIAN
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light tracking-wider text-white mb-4">
                {brandHeading}
              </h2>
              <p className="text-white/60 font-sans text-sm max-w-sm leading-relaxed mb-6">
                35+ years of live stage mastery, grand illusions, and mind reading. Transforming the impossible into enduring wonder.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`mailto:${email}`}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-[#FFD700] hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 transition-all"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-[#00e599] hover:border-[#00e599]/50 hover:bg-[#00e599]/5 transition-all"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all ml-auto cursor-pointer"
                title="Back to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#FFD700] font-semibold mb-6">
              Navigation
            </h3>
            <ul className="space-y-3 font-sans text-sm text-white/70">
              <li>
                <button
                  onClick={() => handleNavClick('#about')}
                  className="hover:text-[#FFD700] transition-colors cursor-pointer"
                >
                  About Upendra
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#videos')}
                  className="hover:text-[#FFD700] transition-colors cursor-pointer"
                >
                  Latest Videos
                </button>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#FFD700] transition-colors">
                  In The News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFD700] transition-colors">
                  Contact Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Custom Pages */}
          <div className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#FFD700] font-semibold mb-6">
              Bespoke Shows
            </h3>
            <ul className="space-y-3 font-sans text-sm text-white/70">
              {pages
                .filter((p) => p.showInFooter !== false)
                .map((page) => (
                  <li key={page.id}>
                    <Link
                      to={`/page/${page.slug}`}
                      className="hover:text-[#FFD700] transition-colors block"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
            </ul>

            {/* Direct Email Display */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-xs text-white/50 uppercase tracking-wider block mb-1">
                Direct Inquiries
              </span>
              <a
                href={`mailto:${email}`}
                className="text-sm font-sans text-[#FFD700] hover:underline"
              >
                Email us: {email}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin Shortcut */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-sans gap-4">
          <p>© {new Date().getFullYear()} Indian Magician — Upendra Thakur. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-white/30 hover:text-[#FFD700] transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin CMS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

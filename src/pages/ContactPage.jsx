import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { submitContactInquiry } from '../utils/api';
import confetti from 'canvas-confetti';
import { Mail, MessageCircle, Send, CheckCircle2, Sparkles, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  const { data } = useSiteData();
  const settings = data?.settings || {};

  const email = settings.contactEmail || 'indianmagician.upendra@gmail.com';
  const whatsapp = settings.whatsappNumber || '919810162724';
  const heroBg = settings.heroBgImage || '/hero-magician.png';

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
        // Golden confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#d4af37', '#00e599', '#ffffff'],
        });

        // Trigger mailto fallback for user's convenience
        const mailtoUri = `mailto:${email}?subject=${encodeURIComponent(
          formData.subject
        )}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        // Optional subtle trigger
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

  return (
    <div className="relative z-10 w-full min-h-screen bg-transparent">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HALF-SCREEN HERO (50vh) */}
      {/* ------------------------------------------------------------- */}
      <section className="relative w-full h-[50vh] min-h-[380px] overflow-hidden flex items-center justify-center select-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroBg})`,
            filter: 'brightness(0.7) contrast(1.1)',
          }}
        />
        {/* Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050807] via-transparent to-[#050807]/80" />

        {/* Scaled Suhani-style Typography for Contact */}
        <div className="relative z-10 text-center mt-12">
          <div className="relative inline-block">
            {/* Hollow stroke background */}
            <h1
              className="text-[14vw] md:text-[8vw] font-serif font-light tracking-[0.1em] uppercase text-stroke-hollow leading-none select-none"
              aria-hidden="true"
            >
              CONTACT
            </h1>
            {/* Overlapping solid white text */}
            <h2 className="absolute inset-0 flex items-center justify-center text-[8vw] md:text-[5vw] font-serif font-normal tracking-[0.15em] uppercase text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
              CONTACT
            </h2>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#FFD700]" />
            <p className="text-xs font-sans tracking-[0.3em] uppercase text-[#FFD700] font-semibold">
              Get in Touch with Upendra Thakur
            </p>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#FFD700]" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. CONTACT INFORMATION & FORM SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Get in touch & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Bookings & Press</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white font-light tracking-wide mb-4">
                Get in touch
              </h2>
              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-8">
                Want to get in touch? We’d love to hear from you. Here’s how you can reach us.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-[#0a231b] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-wider block font-sans">
                      Email us directly
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="text-base font-serif text-white hover:text-[#FFD700] transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-[#0a231b] border border-[#00e599]/30 flex items-center justify-center text-[#00e599] shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-wider block font-sans">
                      WhatsApp Booking Desk
                    </span>
                    <a
                      href={`https://wa.me/${whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-serif text-white hover:text-[#00e599] transition-colors"
                    >
                      +{whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-[#0a231b] border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-white/50 uppercase tracking-wider block font-sans">
                      Headquarters & Studio
                    </span>
                    <p className="text-sm font-sans text-white/80">
                      New Delhi, India — Available for worldwide tours & destination events.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#07241b] to-[#0a1612] border border-[#00e599]/20">
              <span className="text-xs uppercase tracking-widest text-[#00e599] font-bold block mb-1">
                Typical Response Time
              </span>
              <p className="text-xs text-white/70 font-sans">
                Our management desk responds to corporate, festival, and private booking inquiries within 24 hours.
              </p>
            </div>
          </div>

          {/* Right Column: Query Form Block */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 md:p-12 border border-[#FFD700]/25 shadow-2xl relative">
              <h3 className="text-2xl md:text-3xl font-serif text-white font-light mb-2">
                Have a query?
              </h3>
              <p className="text-xs md:text-sm text-white/60 font-sans mb-8">
                Fill in the details below and we will tailor the perfect illusion experience for your event.
              </p>

              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#FFD700]/20 border border-[#FFD700] flex items-center justify-center text-[#FFD700] mb-6 shadow-[0_0_25px_rgba(255,215,0,0.5)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-serif text-white font-medium mb-3">
                    Thank You for Reaching Out
                  </h4>
                  <p className="text-sm md:text-base text-white/80 font-sans max-w-md leading-relaxed mb-8">
                    Your inquiry has been received with wonder! Magician Upendra Thakur’s team will review your requirements and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="px-8 py-3 rounded-full bg-[#FFD700] text-[#050807] font-semibold text-xs tracking-[0.2em] uppercase font-sans hover:shadow-[0_0_20px_#FFD700] transition-all cursor-pointer"
                  >
                    Send Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs font-sans">
                      {errorMessage}
                    </div>
                  )}

                  {/* 1. FULL NAME */}
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-[0.2em] text-[#FFD700] font-semibold mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Mehta"
                      className="w-full px-5 py-3.5 rounded-xl bg-[#091712] border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700] transition-colors text-sm font-sans"
                    />
                  </div>

                  {/* 2. EMAIL */}
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-[0.2em] text-[#FFD700] font-semibold mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. name@company.com"
                      className="w-full px-5 py-3.5 rounded-xl bg-[#091712] border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700] transition-colors text-sm font-sans"
                    />
                  </div>

                  {/* 3. SUBJECT */}
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-[0.2em] text-[#FFD700] font-semibold mb-2">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Keynote Booking for Corporate Summit"
                      className="w-full px-5 py-3.5 rounded-xl bg-[#091712] border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700] transition-colors text-sm font-sans"
                    />
                  </div>

                  {/* 4. MESSAGE (Optional) */}
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-[0.2em] text-white/70 font-semibold mb-2">
                      Message <span className="text-white/40 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your event, venue date, expected audience size, or any custom illusion requirements..."
                      className="w-full px-5 py-3.5 rounded-xl bg-[#091712] border border-white/10 text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700] transition-colors text-sm font-sans resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#FFD700] text-[#050807] font-sans font-bold text-xs tracking-[0.25em] uppercase hover:bg-[#ffe566] hover:shadow-[0_0_25px_#FFD700] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>TRANSMITTING QUERY...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SUBMIT QUERY</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

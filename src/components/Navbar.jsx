import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, MessageCircle, Menu, X, Sparkles } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function Navbar() {
  const { data } = useSiteData();
  const settings = data?.settings || {};
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (hash) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const email = settings.contactEmail || 'indianmagician.upendra@gmail.com';
  const whatsapp = settings.whatsappNumber || '919810162724';
  const brandName = settings.brandName || 'INDIAN MAGICIAN';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050807]/80 backdrop-blur-md py-4'
          : 'bg-transparent py-6 md:py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Top Left: INDIAN MAGICIAN Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 group text-white tracking-[0.25em] text-xs md:text-sm font-semibold uppercase hover:text-[#FFD700] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-[#FFD700] group-hover:scale-150 transition-transform shadow-[0_0_8px_#FFD700]" />
          <span>{brandName}</span>
        </Link>

        {/* Top Center: 4 Links (ABOUT, VIDEOS, NEWS, CONTACT) */}
        <nav className="hidden md:flex items-center gap-10">
          <button
            onClick={() => handleNavClick('#about')}
            className="text-white/80 hover:text-[#FFD700] text-xs font-medium tracking-[0.2em] uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FFD700] hover:after:w-full after:transition-all after:duration-300"
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavClick('#videos')}
            className="text-white/80 hover:text-[#FFD700] text-xs font-medium tracking-[0.2em] uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FFD700] hover:after:w-full after:transition-all after:duration-300"
          >
            VIDEOS
          </button>
          <button
            onClick={() => handleNavClick('#news')}
            className="text-white/80 hover:text-[#FFD700] text-xs font-medium tracking-[0.2em] uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FFD700] hover:after:w-full after:transition-all after:duration-300"
          >
            NEWS
          </button>
          <Link
            to="/contact"
            className="text-white/80 hover:text-[#FFD700] text-xs font-medium tracking-[0.2em] uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FFD700] hover:after:w-full after:transition-all after:duration-300"
          >
            CONTACT
          </Link>
        </nav>

        {/* Top Right: Mail & WhatsApp Icons */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href={`mailto:${email}`}
            title="Email Magician Upendra Thakur"
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-[#FFD700] hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 transition-all"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/80 hover:text-[#00e599] hover:border-[#00e599]/50 hover:bg-[#00e599]/5 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#00e599]"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#FFD700] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050807]/95 backdrop-blur-xl border-b border-[#FFD700]/20 px-8 py-8 flex flex-col gap-6 animate-fadeIn">
          <button
            onClick={() => handleNavClick('#about')}
            className="text-left text-white text-sm tracking-[0.2em] uppercase py-2 border-b border-white/5"
          >
            ABOUT
          </button>
          <button
            onClick={() => handleNavClick('#videos')}
            className="text-left text-white text-sm tracking-[0.2em] uppercase py-2 border-b border-white/5"
          >
            VIDEOS
          </button>
          <button
            onClick={() => handleNavClick('#news')}
            className="text-left text-white text-sm tracking-[0.2em] uppercase py-2 border-b border-white/5"
          >
            NEWS
          </button>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-left text-[#FFD700] text-sm tracking-[0.2em] uppercase py-2 border-b border-white/5"
          >
            CONTACT
          </Link>
          <div className="flex items-center gap-6 pt-2">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-xs tracking-wider text-white/70"
            >
              <Mail className="w-4 h-4 text-[#FFD700]" />
              <span>{email}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

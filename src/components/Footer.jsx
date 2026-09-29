import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { Mail, MessageCircle, Lock, ArrowUp } from 'lucide-react';

export default function Footer() {
  const { data } = useSiteData();
  const settings = data?.settings || {};
  const pages = data?.pages || [];
  const navigate = useNavigate();
  const location = useLocation();

  const email = settings.contactEmail || 'indianmagician.upendra@gmail.com';
  const whatsapp = settings.whatsappNumber || '919810162724';
  const brandHeading = settings.heroTitle || 'Upendra Thakur';

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
    <footer className="relative z-10 w-full border-t border-white/10 bg-[#040706]/75 backdrop-blur-xl text-white pt-20 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
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
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all ml-auto"
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
                  className="hover:text-[#FFD700] transition-colors"
                >
                  About Upendra
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#videos')}
                  className="hover:text-[#FFD700] transition-colors"
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
                  Contact
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

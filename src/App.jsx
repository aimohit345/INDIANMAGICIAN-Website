import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

import { SiteDataProvider } from './context/SiteDataContext';
import MagicalPageLoader from './components/MagicalPageLoader';
import ScrollProgressBar from './components/ScrollProgressBar';
import MagicalCursor from './components/MagicalCursor';
import Persistent3DCard from './components/Persistent3DCard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import DynamicCustomPage from './pages/DynamicCustomPage';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Modernistic smooth scroll on desktop; native 120Hz momentum scroll on phone/tablet
  useEffect(() => {
    if (isAdmin) return;

    // Detect touch / mobile device - let phones and tablets use native hardware-accelerated momentum scroll
    const isTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0);

    if (isTouch) {
      // Return early on touch devices so scrolling is instantaneous without delay or artificial steps
      return;
    }

    const lenis = new Lenis({
      duration: 0.6, // Snappy & responsive (no waiting or sluggishness)
      easing: (t) => 1 - Math.pow(1 - t, 3), // Instant initial response with butter-smooth glide
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isAdmin]);

  // Scroll to top on page change (unless hash link)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <SiteDataProvider>
      <div className="relative min-h-screen bg-[#050807] text-[#f3f4f6] font-sans selection:bg-[#FFD700] selection:text-[#050807]">
        {/* Sleek Initial Load Animation */}
        {!isAdmin && <MagicalPageLoader />}

        {/* Modernistic Glowing Scroll Progress Bar */}
        {!isAdmin && <ScrollProgressBar />}

        {/* Magical Mouse-Tracking Cursor (Dot + Golden Trail + Spotlight Glow) */}
        <MagicalCursor />

        {/* Persistent 3D King of Diamonds Card (Hidden on Admin) */}
        {!isAdmin && <Persistent3DCard />}

        {/* Public Header Navbar */}
        {!isAdmin && <Navbar />}

        {/* Main Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/page/:slug" element={<DynamicCustomPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<HomePage />} />
        </Routes>

        {/* Public Editorial Footer */}
        {!isAdmin && <Footer />}
      </div>
    </SiteDataProvider>
  );
}

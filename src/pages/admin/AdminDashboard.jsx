import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../../context/SiteDataContext';
import AdminLogin from './AdminLogin';

import GlobalSettingsTab from './tabs/GlobalSettingsTab';
import AboutCollageTab from './tabs/AboutCollageTab';
import TestimonialsTab from './tabs/TestimonialsTab';
import VideosTab from './tabs/VideosTab';
import NewsTab from './tabs/NewsTab';
import DynamicSectionsTab from './tabs/DynamicSectionsTab';
import DynamicPagesTab from './tabs/DynamicPagesTab';
import InquiriesTab from './tabs/InquiriesTab';

import {
  Settings,
  Image as ImageIcon,
  Quote,
  Video,
  Newspaper,
  Layers,
  FileText,
  Mail,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboard() {
  const { data } = useSiteData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  // Check auth session
  useEffect(() => {
    const token = localStorage.getItem('magic_admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('magic_admin_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const unreadInquiries = (data?.inquiries || []).filter((i) => !i.read).length;

  const tabs = [
    { id: 'settings', label: 'Global Settings', icon: Settings },
    { id: 'about', label: 'About & Collage', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'videos', label: 'Videos & Reels', icon: Video },
    { id: 'news', label: 'In The News', icon: Newspaper },
    { id: 'sections', label: 'Dynamic Sections', icon: Layers },
    { id: 'pages', label: 'Custom Pages', icon: FileText },
    { id: 'inquiries', label: 'Inquiries Inbox', icon: Mail, badge: unreadInquiries },
  ];

  return (
    <div className="min-h-screen bg-[#050807] text-white flex flex-col">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#08130f]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0a231b] border border-[#FFD700]/50 flex items-center justify-center text-[#FFD700]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold font-sans tracking-wider uppercase text-white">
              Indian Magician CMS
            </h1>
            <span className="text-[10px] text-white/50 block font-sans">
              Upendra Thakur Official Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-xs text-[#FFD700] hover:bg-[#FFD700]/10 border border-[#FFD700]/20 transition-all font-sans font-medium"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/30 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/50 transition-all font-sans"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#06100d] border-b md:border-b-0 md:border-r border-white/10 p-4 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-sans tracking-wide uppercase transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFD700] text-[#050807] font-bold shadow-[0_0_15px_rgba(255,215,0,0.25)]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-[#050807] text-[#FFD700]' : 'bg-[#FFD700] text-[#050807]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Canvas */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {activeTab === 'settings' && <GlobalSettingsTab />}
          {activeTab === 'about' && <AboutCollageTab />}
          {activeTab === 'testimonials' && <TestimonialsTab />}
          {activeTab === 'videos' && <VideosTab />}
          {activeTab === 'news' && <NewsTab />}
          {activeTab === 'sections' && <DynamicSectionsTab />}
          {activeTab === 'pages' && <DynamicPagesTab />}
          {activeTab === 'inquiries' && <InquiriesTab />}
        </main>
      </div>
    </div>
  );
}

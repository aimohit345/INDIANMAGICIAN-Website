import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import VideosSection from '../components/VideosSection';
import NewsSection from '../components/NewsSection';
import DynamicSections from '../components/DynamicSections';

export default function HomePage() {
  return (
    <main className="relative w-full">
      <HeroSection />
      <AboutSection />
      <VideosSection />
      <NewsSection />
      <DynamicSections />
    </main>
  );
}

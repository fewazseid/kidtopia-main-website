/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LeadCapturePopup } from './components/LeadCapturePopup';
import { Language } from './translations';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { VirtualTourPage } from './pages/VirtualTourPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';
import { BookTourPage } from './pages/BookTourPage';
import { RescheduleTourPage } from './pages/RescheduleTourPage';
import { LoginPage } from './pages/LoginPage';
import { EnrollPage } from './pages/EnrollPage';
import { ContentProvider } from './ContentContext';
import { MinimalHeader } from './components/MinimalHeader';
import { useLocation } from 'react-router-dom';

const AppContent: React.FC<{ lang: Language; setLang: (l: Language) => void; scrollToSection: (id: string) => void }> = ({ lang, setLang, scrollToSection }) => {
  const location = useLocation();
  const isMinimalLayout = ['/login'].includes(location.pathname) || location.pathname.startsWith('/reschedule');

  return (
    <div className="min-h-screen selection:bg-brand-green/20 relative">
      {/* iOS-Style Premium Frosted Backdrop Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-brand-cream/40">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-green/10 blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-brand-orange/8 blur-[160px] animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute top-[45%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-brand-yellow/10 blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[15%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-brand-teal/8 blur-[120px] animate-pulse" style={{ animationDuration: '18s' }} />
      </div>

      {isMinimalLayout ? (
        <MinimalHeader lang={lang} setLang={setLang} />
      ) : (
        <Header lang={lang} setLang={setLang} onScrollTo={scrollToSection} />
      )}
      
      <Routes>
        <Route path="/" element={<HomePage lang={lang} onScrollTo={scrollToSection} />} />
        <Route path="/about" element={<AboutPage lang={lang} />} />
        <Route path="/programs" element={<ProgramsPage lang={lang} />} />
        <Route path="/virtual-tour" element={<VirtualTourPage lang={lang} />} />
        <Route path="/resources" element={<ResourcesPage lang={lang} />} />
        <Route path="/testimonials" element={<TestimonialsPage lang={lang} />} />
        <Route path="/contact" element={<ContactPage lang={lang} />} />
        <Route path="/book-tour" element={<BookTourPage lang={lang} />} />
        <Route path="/reschedule/:id" element={<RescheduleTourPage lang={lang} />} />
        <Route path="/login" element={<LoginPage lang={lang} />} />
        <Route path="/enroll" element={<EnrollPage lang={lang} />} />
      </Routes>

      {!isMinimalLayout && <Footer lang={lang} />}
      
      <LeadCapturePopup lang={lang} />
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('en');

  // Simple analytics tracking
  useEffect(() => {
    console.log('Page visit tracked');
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ContentProvider>
      <Router>
        <AppContent lang={lang} setLang={setLang} scrollToSection={scrollToSection} />
      </Router>
    </ContentProvider>
  );
}

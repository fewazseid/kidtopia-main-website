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
import { AdminDashboard } from './pages/AdminDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ContentProvider } from './ContentContext';
import { MinimalHeader } from './components/MinimalHeader';
import { useLocation } from 'react-router-dom';

const AppContent: React.FC<{ lang: Language; setLang: (l: Language) => void; scrollToSection: (id: string) => void }> = ({ lang, setLang, scrollToSection }) => {
  const location = useLocation();
  const isMinimalLayout = ['/login', '/admin', '/staff', '/parent', '/book-tour'].includes(location.pathname) || location.pathname.startsWith('/reschedule');

  return (
    <div className="min-h-screen selection:bg-brand-green/20">
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
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
        <Route path="/parent" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
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

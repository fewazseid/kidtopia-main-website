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
import { LoginPage } from './pages/LoginPage';

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
    <Router>
      <div className="min-h-screen selection:bg-brand-green/20">
        <Header lang={lang} onScrollTo={scrollToSection} />
        
        <Routes>
          <Route path="/" element={<HomePage lang={lang} onScrollTo={scrollToSection} />} />
          <Route path="/about" element={<AboutPage lang={lang} />} />
          <Route path="/programs" element={<ProgramsPage lang={lang} />} />
          <Route path="/virtual-tour" element={<VirtualTourPage lang={lang} />} />
          <Route path="/resources" element={<ResourcesPage lang={lang} />} />
          <Route path="/testimonials" element={<TestimonialsPage lang={lang} />} />
          <Route path="/contact" element={<ContactPage lang={lang} />} />
          <Route path="/login" element={<LoginPage lang={lang} />} />
        </Routes>

        <Footer lang={lang} />
        
        <LeadCapturePopup lang={lang} />
      </div>
    </Router>
  );
}

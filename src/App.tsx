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
import { LoginRedirect } from './pages/LoginRedirect';
import { EnrollPage } from './pages/EnrollPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSsoPage } from './pages/AdminSsoPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ContentProvider, useLanguageConfig } from './ContentContext';
import { MinimalHeader } from './components/MinimalHeader';
import { InstallAppModal } from './components/InstallAppModal';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Sparkles } from 'lucide-react';

const AppContent: React.FC<{ lang: Language; setLang: (l: Language) => void; scrollToSection: (id: string) => void }> = ({ lang, setLang, scrollToSection }) => {
  const location = useLocation();
  const isMinimalLayout = ['/login', '/admin'].includes(location.pathname) || location.pathname.startsWith('/admin/') || location.pathname.startsWith('/reschedule');
  
  // State for expanded image viewer and Install App modal
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  // Lock body scroll when image is expanded in modal
  useEffect(() => {
    if (expandedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expandedImage]);

  // Set up global click listener for images
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        
        // Exclude tiny UI icons, badges, and decorations (width/height less than 32px)
        if (
          (img.naturalWidth > 0 && img.naturalWidth < 32) || 
          (img.naturalHeight > 0 && img.naturalHeight < 32) || 
          img.width < 32 || 
          img.height < 32
        ) {
          return;
        }

        // Check if excluded class/elements
        if (
          img.classList.contains('no-expand') || 
          img.src.includes('flag-') || 
          img.src.includes('logo') ||
          img.id === 'barcode'
        ) {
          return;
        }

        // Open the high fidelity expandable image modal
        setExpandedImage({
          src: img.src,
          alt: img.alt || (lang === 'en' ? 'Kidtopia Academy' : 'ኪድቶፒያ አካዳሚ')
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [lang]);

  // Handle escape key press & scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedImage(null);
      }
    };

    if (expandedImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expandedImage]);

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
        <Header 
          lang={lang} 
          setLang={setLang} 
          onScrollTo={scrollToSection} 
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
        />
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
        <Route path="/reschedule/:id" element={<RescheduleTourPage lang={lang} setLang={setLang} />} />
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/enroll" element={<EnrollPage lang={lang} />} />
        <Route path="/admin/sso" element={<AdminSsoPage />} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      </Routes>

      {!isMinimalLayout && <Footer lang={lang} />}
      
      <LeadCapturePopup lang={lang} />

      {/* Install App Step-by-Step Guide Modal (Triggered strictly from Login) */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        lang={lang}
      />

      {/* Global High-Fidelity Expandable Image Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setExpandedImage(null)}
            className="fixed inset-0 z-[9999] bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 select-none cursor-zoom-out"
          >
            {/* Top Close Button bar (Frosted Glass Icon) */}
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X size={20} className="stroke-[2.5]" />
            </motion.button>

            {/* Container for Image & Caption */}
            <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-4 relative">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                src={expandedImage.src}
                alt={expandedImage.alt}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[80vh] max-w-full sm:max-w-[90%] md:max-w-[85%] object-contain rounded-2xl sm:rounded-3xl shadow-2xl border border-white/5 select-none"
              />

              {expandedImage.alt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-stone-900/80 border border-white/5 text-stone-200 text-xs sm:text-sm font-sans font-medium px-5 py-2.5 rounded-full shadow-lg backdrop-blur-md text-center max-w-[90%] break-words"
                >
                  {expandedImage.alt}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MainApp = () => {
  const { languageConfig } = useLanguageConfig();
  const [lang, setLang] = useState<Language>('en');
  const [userHasManuallySelected, setUserHasManuallySelected] = useState<boolean>(() => {
    return !!sessionStorage.getItem('kidtopia_user_selected_lang');
  });

  // Sync lang when languageConfig loads or updates
  useEffect(() => {
    const sessionLang = sessionStorage.getItem('kidtopia_user_selected_lang') as Language | null;
    let target: Language = languageConfig.defaultLanguage || 'en';

    if (userHasManuallySelected && sessionLang && (sessionLang === 'en' || sessionLang === 'am')) {
      target = sessionLang;
    }

    // Guard against deactivated languages
    if (target === 'en' && !languageConfig.isEnActive) {
      target = 'am';
    } else if (target === 'am' && !languageConfig.isAmActive) {
      target = 'en';
    }

    setLang(target);
  }, [languageConfig.defaultLanguage, languageConfig.isEnActive, languageConfig.isAmActive, userHasManuallySelected]);

  const handleSetLang = (newLang: Language) => {
    if (newLang === 'en' && !languageConfig.isEnActive) return;
    if (newLang === 'am' && !languageConfig.isAmActive) return;
    setLang(newLang);
    setUserHasManuallySelected(true);
    sessionStorage.setItem('kidtopia_user_selected_lang', newLang);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <AppContent lang={lang} setLang={handleSetLang} scrollToSection={scrollToSection} />
    </Router>
  );
};

export default function App() {
  return (
    <ContentProvider>
      <MainApp />
    </ContentProvider>
  );
}

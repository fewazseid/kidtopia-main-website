import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Language, translations } from '../translations';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onScrollTo: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, onScrollTo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = translations[lang].nav;

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { label: t.home, path: '/' },
    { label: t.about, path: '/about' },
    { label: t.programs, path: '/programs' },
    { label: t.virtualTour, path: '/virtual-tour' },
    { label: t.resources, path: '/resources' },
    { label: t.testimonials, path: '/testimonials' },
    { label: t.contact, path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-white via-brand-cream to-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col justify-center cursor-pointer">
            <div className="font-sans font-bold text-3xl tracking-tighter flex">
              <span className="text-brand-orange">K</span>
              <span className="text-brand-yellow">I</span>
              <span className="text-brand-green">D</span>
              <span className="text-brand-teal">T</span>
              <span className="text-brand-tan">O</span>
              <span className="text-brand-orange">P</span>
              <span className="text-brand-yellow">I</span>
              <span className="text-brand-green">A</span>
            </div>
            <span className="text-[10px] font-sans text-brand-green font-medium tracking-wide mt-[-4px] hidden sm:block">
              International Daycare and Preschool
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              <Link 
                key={idx} 
                to={item.path} 
                className={`text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-brand-green' : 'hover:text-brand-green'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/contact" className="bg-brand-yellow text-stone-900 font-bold rounded-full px-5 py-2 text-xs transition-all hover:opacity-90 active:scale-95">{t.bookTour}</Link>
            <Link to="/contact" className="bg-brand-green text-white font-bold rounded-full px-5 py-2 text-xs transition-all hover:opacity-90 active:scale-95">{t.enrollNow}</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="xl:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-white border-t border-brand-cream overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-left px-3 py-3 text-base font-medium rounded-xl ${location.pathname === item.path ? 'bg-brand-green/10 text-brand-green' : 'hover:bg-brand-cream'}`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/contact" className="btn-yellow w-full text-center" onClick={() => setIsMenuOpen(false)}>{t.bookTour}</Link>
                <Link to="/contact" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>{t.enrollNow}</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

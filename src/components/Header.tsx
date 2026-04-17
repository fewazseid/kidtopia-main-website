import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  onScrollTo: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, onScrollTo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useContent(lang).nav;

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
    { 
      label: t.about, 
      path: '/about',
      subItems: [
        { label: t.aboutCompany, path: '/about' },
        { label: t.aboutStaff, path: '/about#staff' }
      ]
    },
    { label: t.programs, path: '/programs' },
    { label: t.virtualTour, path: '/virtual-tour' },
    { label: t.resources, path: '/resources' },
    { label: t.testimonials, path: '/testimonials' },
    { label: t.bookTour || "Book Tour", path: '/book-tour' },
    { label: t.contact, path: '/contact' },
  ];

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
          <nav className="hidden md:flex items-center gap-[clamp(0.5rem,1.5vw,2rem)]">
            {navItems.map((item, idx) => (
              <div 
                key={idx} 
                className="relative group dropdown-container"
              >
                {item.subItems ? (
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                    className={`text-[clamp(11px,1.2vw,14px)] font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${location.pathname === item.path ? 'text-brand-orange' : 'hover:text-brand-orange'}`}
                  >
                    {item.label}
                    <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${activeDropdown === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <Link 
                    to={item.path} 
                    className={`text-[clamp(11px,1.2vw,14px)] font-medium transition-colors whitespace-nowrap ${location.pathname === item.path ? 'text-brand-orange' : 'hover:text-brand-orange'}`}
                  >
                    {item.label}
                  </Link>
                )}

                {item.subItems && activeDropdown === idx && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-brand-cream overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        to={sub.path}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-brand-cream hover:text-brand-orange transition-colors"
                        onClick={() => {
                          setActiveDropdown(null);
                          if (sub.path.includes('#')) {
                            const id = sub.path.split('#')[1];
                            onScrollTo(id);
                          }
                        }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="text-sm font-bold text-stone-600 hover:text-brand-green transition-colors px-3 py-1 rounded-lg bg-stone-100"
            >
              {lang === 'en' ? 'አማርኛ' : 'English'}
            </button>
            <Link to="/login" className="bg-brand-green text-white font-bold rounded-full px-[clamp(0.75rem,1.5vw,1.25rem)] py-2 text-[clamp(10px,1vw,12px)] transition-all hover:opacity-90 active:scale-95 whitespace-nowrap">{t.login}</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white border-t border-brand-cream overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => {
                    setLang(lang === 'en' ? 'am' : 'en');
                    setIsMenuOpen(false);
                  }}
                  className="text-sm font-bold text-brand-green px-4 py-2 rounded-xl bg-brand-green/5"
                >
                  {lang === 'en' ? 'አማርኛ' : 'English'}
                </button>
              </div>
              {navItems.map((item, idx) => (
                <div key={idx}>
                  {item.subItems ? (
                    <div className="space-y-1">
                      <div className="px-3 py-3 text-base font-bold text-stone-900 border-b border-brand-cream mb-1">
                        {item.label}
                      </div>
                      {item.subItems.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.path}
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (sub.path.includes('#')) {
                              const id = sub.path.split('#')[1];
                              setTimeout(() => onScrollTo(id), 100);
                            }
                          }}
                          className={`block w-full text-left px-6 py-2 text-sm font-medium rounded-xl ${location.pathname === sub.path ? 'bg-brand-orange/10 text-brand-orange' : 'hover:bg-brand-cream'}`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block w-full text-left px-3 py-3 text-base font-medium rounded-xl ${location.pathname === item.path ? 'bg-brand-orange/10 text-brand-orange' : 'hover:bg-brand-cream'}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <Link to="/login" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>{t.login}</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

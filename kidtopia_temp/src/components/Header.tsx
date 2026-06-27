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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'pt-3 px-4' : 'pt-6 px-4 md:px-8'}`}>
      <div className={`mx-auto max-w-7xl rounded-[28px] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] py-3 px-6 sm:px-8' : 'bg-transparent py-4 px-4 border border-transparent'}`}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col justify-center cursor-pointer group">
            <div className="font-display font-black text-2xl sm:text-3xl tracking-tighter flex items-center">
              <span className="text-brand-orange group-hover:scale-110 transition-transform duration-300">K</span>
              <span className="text-brand-yellow group-hover:scale-110 transition-transform duration-300 delay-75">I</span>
              <span className="text-brand-green group-hover:scale-110 transition-transform duration-300 delay-100">D</span>
              <span className="text-brand-teal group-hover:scale-110 transition-transform duration-300 delay-150">T</span>
              <span className="text-brand-tan group-hover:scale-110 transition-transform duration-300 delay-200">O</span>
              <span className="text-brand-orange group-hover:scale-110 transition-transform duration-300 delay-250">P</span>
              <span className="text-brand-yellow group-hover:scale-110 transition-transform duration-300 delay-300">I</span>
              <span className="text-brand-green group-hover:scale-110 transition-transform duration-300 delay-350">A</span>
              <span className="ml-1.5 w-2 h-2 rounded-full bg-brand-orange animate-bounce"></span>
            </div>
            <span className="text-[10px] font-display text-brand-green font-bold tracking-widest uppercase mt-[-3px] hidden lg:block opacity-80 group-hover:opacity-100 transition-opacity">
              International Daycare & Preschool
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-[clamp(0.5rem,1.2vw,1.75rem)]">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <div 
                  key={idx} 
                  className="relative group dropdown-container"
                >
                  {item.subItems ? (
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                      className={`text-[clamp(12px,1.1vw,14px)] font-bold tracking-tight font-display transition-all flex items-center gap-1.5 whitespace-nowrap py-1.5 px-3 rounded-xl hover:bg-white/50 ${isActive ? 'text-brand-green bg-brand-green/5' : 'text-stone-700 hover:text-brand-green'}`}
                    >
                      {item.label}
                      <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === idx ? 'rotate-180 text-brand-green' : 'text-stone-400 group-hover:text-brand-green'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link 
                      to={item.path} 
                      className={`text-[clamp(12px,1.1vw,14px)] font-bold tracking-tight font-display transition-all whitespace-nowrap py-1.5 px-3 rounded-xl hover:bg-white/50 relative ${isActive ? 'text-brand-green bg-brand-green/5' : 'text-stone-700 hover:text-brand-green'}`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.span 
                          layoutId="activeNavBubble" 
                          className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-brand-green"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  )}

                  {item.subItems && activeDropdown === idx && (
                    <div className="absolute top-full left-0 mt-2.5 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {item.subItems.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.path}
                          className="block px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-brand-cream/80 hover:text-brand-green transition-all"
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
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="text-xs font-black tracking-wider uppercase text-stone-600 hover:text-brand-green hover:bg-white bg-white/40 backdrop-blur-sm border border-white/60 transition-all px-3.5 py-2 rounded-xl shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping"></span>
              {lang === 'en' ? 'አማርኛ' : 'English'}
            </button>
            <Link 
              to="/login" 
              className="bg-brand-green text-white font-bold font-display rounded-full px-6 py-2.5 text-xs shadow-[0_4px_15px_rgba(58,91,50,0.2)] hover:shadow-[0_8px_25px_rgba(58,91,50,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              {t.login}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2.5 rounded-2xl bg-white/40 border border-white/60 text-stone-800 hover:text-brand-green transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mt-3 mx-auto max-w-7xl bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                <span className="text-xs font-black uppercase text-stone-400 tracking-widest">Navigation</span>
                <button 
                  onClick={() => {
                    setLang(lang === 'en' ? 'am' : 'en');
                    setIsMenuOpen(false);
                  }}
                  className="text-xs font-black tracking-wider uppercase text-brand-green px-4 py-2 rounded-xl bg-brand-green/5 border border-brand-green/10"
                >
                  {lang === 'en' ? 'አማርኛ' : 'English'}
                </button>
              </div>
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {navItems.map((item, idx) => (
                  <div key={idx}>
                    {item.subItems ? (
                      <div className="space-y-1 bg-brand-cream/40 p-3 rounded-2xl border border-white/40">
                        <div className="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-stone-400">
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
                            className={`block w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${location.pathname === sub.path ? 'bg-brand-green/10 text-brand-green' : 'text-stone-700 hover:bg-white'}`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block w-full text-left px-4 py-3 text-base font-bold rounded-xl transition-all ${location.pathname === item.path ? 'bg-brand-green/10 text-brand-green' : 'text-stone-700 hover:bg-brand-cream/50'}`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
                <Link to="/login" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>{t.login}</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

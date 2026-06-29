import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onScrollTo: (id: string) => void;
  lang: 'en' | 'am';
  setLang: (lang: 'en' | 'am') => void;
}

const navItems = [
  { label: 'Home', path: '/' },
  { 
    label: 'Kidtopia', 
    path: '#about',
    subItems: [
      { label: 'Our Story', path: '#story' },
      { label: 'The Campus', path: '#campus' },
      { label: 'Our Team', path: '#team' },
    ]
  },
  { label: 'Programs', path: '/programs' },
  { label: 'Virtual Tour', path: '/tour' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Contact', path: '/contact' },
];

const translations = {
  en: {
    login: 'Log In',
    join: 'Join Now',
    backgroundColor: '#ffffff',
    textColor: '#44403c',
    activeColor: '#3a5b32',
  },
  am: {
    login: 'ይግቡ',
    join: 'አሁኑኑ ይቀላቀሉ',
    backgroundColor: '#ffffff',
    textColor: '#44403c',
    activeColor: '#3a5b32',
  }
};

export const Header = ({ onScrollTo, lang, setLang }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const location = useLocation();
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 py-3 md:px-6 md:py-4`}
    >
      <div 
        className={`max-w-7xl mx-auto rounded-[2.5rem] transition-all duration-500 border ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_15px_40px_rgba(0,0,0,0.08)] py-2 md:py-3 px-4 md:px-8' 
            : 'bg-white/40 backdrop-blur-md border-white/60 shadow-none py-3 md:py-4 px-6 md:px-10'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-orange rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-xl md:text-2xl font-display">K</span>
            </div>
            <div className="flex flex-col">
              <span 
                className="text-xl md:text-2xl font-black font-display tracking-tight leading-none"
                style={{ color: t.textColor || '#44403c' }}
              >
                Kidtopia
                <span className="ml-1.5 w-2 h-2 rounded-full bg-brand-orange animate-bounce inline-block"></span>
              </span>
              <span 
                className="text-[10px] font-display font-bold tracking-widest uppercase mt-[-3px] hidden xl:block opacity-80 group-hover:opacity-100 transition-opacity"
                style={{ color: t.activeColor || '#3a5b32' }}
              >
                International Daycare & Preschool
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav 
            className="hidden lg:flex items-center justify-center flex-1 px-4"
            style={{ fontWeight: 'bold' }}
          >
            <div className="flex items-center gap-0.5 xl:gap-[clamp(0.5rem,1.2vw,1.75rem)]">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <div key={idx} className="relative group dropdown-container">
                    {item.subItems ? (
                      <div className="relative">
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                          className="text-[12px] xl:text-[clamp(12px,1.1vw,14px)] font-bold tracking-tight font-display transition-all flex items-center gap-1 whitespace-nowrap py-1.5 px-2 xl:px-3 rounded-xl hover:bg-white/50"
                          style={{ color: isActive ? (t.activeColor || '#3a5b32') : (t.textColor || '#44403c') }}
                        >
                          {item.label}
                          <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === idx ? 'rotate-180' : 'opacity-70 group-hover:opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {activeDropdown === idx && (
                          <div className="absolute top-full left-0 mt-2.5 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            {item.subItems.map((sub, sIdx) => (
                              <Link
                                key={sIdx}
                                to={sub.path}
                                className="block px-5 py-2.5 text-sm font-semibold transition-all hover:bg-brand-cream/80"
                                style={{ color: t.textColor || '#44403c' }}
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
                    ) : (
                      <Link 
                        to={item.path} 
                        className="text-[12px] xl:text-[clamp(12px,1.1vw,14px)] font-bold tracking-tight font-display transition-all whitespace-nowrap py-1.5 px-2 xl:px-3 rounded-xl hover:bg-white/50 relative"
                        style={{ color: isActive ? (t.activeColor || '#3a5b32') : (t.textColor || '#44403c') }}
                      >
                        {item.label}
                        {isActive && (
                          <motion.span 
                            layoutId="activeNavBubble" 
                            className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full"
                            style={{ backgroundColor: t.activeColor || '#3a5b32' }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 shrink-0">
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="text-[10px] xl:text-xs font-black tracking-wider uppercase bg-white/40 backdrop-blur-sm border border-white/60 transition-all px-2 xl:px-3.5 py-1.5 xl:py-2 rounded-xl shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5"
              style={{ color: t.textColor || '#44403c' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping"></span>
              <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>
            <Link 
              to="/login" 
              className="text-white font-bold font-display rounded-full px-4 xl:px-6 py-1.5 xl:py-2.5 text-[10px] xl:text-xs shadow-[0_4px_15px_rgba(58,91,50,0.2)] hover:shadow-[0_8px_25px_rgba(58,91,50,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ backgroundColor: t.activeColor || '#3a5b32' }}
            >
              {t.login}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2.5 rounded-2xl bg-white/40 border border-white/60 transition-colors" 
            style={{ color: t.textColor || '#44403c' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden mt-3 mx-auto max-w-7xl bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
              style={{ backgroundColor: t.backgroundColor || '#ffffff' }}
            >
              <div className="px-6 py-6 flex flex-col max-h-[85vh]">
                <div className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
                  {navItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <Link
                        to={item.path}
                        className="px-4 py-4 rounded-2xl text-lg font-bold font-display flex items-center justify-between hover:bg-brand-cream/50 transition-colors"
                        style={{ color: location.pathname === item.path ? (t.activeColor || '#3a5b32') : (t.textColor || '#44403c') }}
                        onClick={() => {
                          if (!item.subItems) setIsMenuOpen(false);
                          if (item.path.includes('#')) onScrollTo(item.path.split('#')[1]);
                        }}
                      >
                        {item.label}
                        {item.subItems && <ChevronRight className="w-5 h-5 opacity-40" />}
                      </Link>
                      
                      {item.subItems && (
                        <div className="pl-6 flex flex-col gap-1 mb-2">
                          {item.subItems.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.path}
                              className="px-4 py-2.5 rounded-xl text-base font-semibold opacity-70 hover:opacity-100 hover:bg-brand-cream/30 transition-all"
                              style={{ color: t.textColor || '#44403c' }}
                              onClick={() => {
                                setIsMenuOpen(false);
                                if (sub.path.includes('#')) onScrollTo(sub.path.split('#')[1]);
                              }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-stone-100 flex flex-col gap-3">
                  <button 
                    onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                    className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-stone-50 font-bold"
                    style={{ color: t.textColor || '#44403c' }}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 opacity-40" />
                      <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
                    </div>
                    <span className="text-xs font-black uppercase text-brand-orange">Switch</span>
                  </button>
                  <Link
                    to="/login"
                    className="w-full py-4 rounded-2xl bg-stone-900 text-white font-bold font-display text-center shadow-lg active:scale-[0.98] transition-transform"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {translations[lang].login}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

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
      <div className={`mx-auto max-w-7xl rounded-[28px] transition-all duration-500 ${isScrolled ? 'backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] py-3 px-6 sm:px-8' : 'bg-transparent py-4 px-4 border border-transparent'}`} style={isScrolled ? { backgroundColor: `${t.backgroundColor || '#ffffff'}cc` } : {}}>
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
            <span 
              className="text-[10px] font-display font-bold tracking-widest uppercase mt-[-3px] hidden xl:block opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ color: t.activeColor || '#3a5b32' }}
            >
              International Daycare & Preschool
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav 
            className="hidden lg:flex items-center"
            style={{ 
              fontSize: '13.5px', 
              fontWeight: '700', 
              paddingLeft: '0px', 
              paddingRight: '0px',
              marginLeft: '-4px',
              marginRight: '-10px',
              height: '38px' 
            }}
          >
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
                        className="font-bold tracking-tight font-display transition-all flex items-center gap-1.5 whitespace-nowrap py-1 px-1.5 xl:py-1.5 xl:px-2.5 rounded-lg hover:bg-white/50"
                        style={{ color: isActive ? (t.activeColor || '#3a5b32') : (t.textColor || '#44403c') }}
                      >
                        {item.label}
                        <svg className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-300 ${activeDropdown === idx ? 'rotate-180' : 'opacity-70 group-hover:opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                  ) : (
                      <Link 
                        to={item.path} 
                        className="font-bold tracking-tight font-display transition-all whitespace-nowrap py-1 px-1.5 xl:py-1.5 xl:px-2.5 rounded-lg hover:bg-white/50 relative"
                        style={{ color: isActive ? (t.activeColor || '#3a5b32') : (t.textColor || '#44403c') }}
                      >
                        {item.label}
                        {isActive && (
                          <motion.span 
                            layoutId="activeNavBubble" 
                            className="absolute -bottom-1.5 left-2 right-2 xl:left-3 xl:right-3 h-0.5 rounded-full"
                            style={{ backgroundColor: t.activeColor || '#3a5b32' }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                  )}

                  {item.subItems && activeDropdown === idx && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-white/60 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      {item.subItems.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.path}
                          className="block px-4 py-2 text-[13px] font-semibold transition-all hover:bg-brand-cream/80"
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
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-4.5">
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="text-[10px] xl:text-[11px] font-black tracking-wider uppercase bg-white/40 backdrop-blur-sm border border-white/60 transition-all px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-lg shadow-sm hover:scale-105 active:scale-95 flex items-center gap-2"
              style={{ color: t.textColor || '#44403c' }}
            >
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
              <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>
            <Link 
              to="/login" 
              className="text-white font-bold font-display rounded-full px-4 xl:px-6 py-1.5 xl:py-2.5 text-[10px] xl:text-[11px] shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
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
            className="lg:hidden mt-3 mx-auto max-w-7xl bg-white/95 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
            style={{ backgroundColor: t.backgroundColor || '#ffffff' }}
          >
            <div className="px-6 py-6 flex flex-col max-h-[85vh]">
              <div className="flex flex-col gap-4 pb-4 border-b border-stone-100 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest opacity-60" style={{ color: t.textColor || '#44403c' }}>Navigation</span>
                  <button 
                    onClick={() => {
                      setLang(lang === 'en' ? 'am' : 'en');
                      setIsMenuOpen(false);
                    }}
                    className="text-xs font-black tracking-wider uppercase px-4 py-2 rounded-xl"
                    style={{ color: t.activeColor || '#3a5b32', backgroundColor: `${t.activeColor || '#3a5b32'}15`, border: `1px solid ${t.activeColor || '#3a5b32'}25` }}
                  >
                    {lang === 'en' ? 'አማርኛ' : 'English'}
                  </button>
                </div>
                <Link to="/login" className="w-full text-center text-white font-bold font-display rounded-full px-6 py-2.5 text-sm shadow-[0_4px_15px_rgba(58,91,50,0.2)]" style={{ backgroundColor: t.activeColor || '#3a5b32' }} onClick={() => setIsMenuOpen(false)}>
                  {t.login}
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 py-4 pr-1">
                {navItems.map((item, idx) => (
                  <div key={idx}>
                    {item.subItems ? (
                      <div className="space-y-1 bg-brand-cream/40 p-3 rounded-2xl border border-white/40">
                        <div className="px-3 py-1.5 text-xs font-black uppercase tracking-wider opacity-60" style={{ color: t.textColor || '#44403c' }}>
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
                            className="block w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all"
                            style={{ color: location.pathname === sub.path ? (t.activeColor || '#3a5b32') : (t.textColor || '#44403c'), backgroundColor: location.pathname === sub.path ? `${t.activeColor || '#3a5b32'}15` : 'transparent' }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 text-base font-bold rounded-xl transition-all"
                        style={{ color: location.pathname === item.path ? (t.activeColor || '#3a5b32') : (t.textColor || '#44403c'), backgroundColor: location.pathname === item.path ? `${t.activeColor || '#3a5b32'}15` : 'transparent' }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

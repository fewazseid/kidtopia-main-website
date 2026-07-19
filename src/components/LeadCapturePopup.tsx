import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface LeadCapturePopupProps {
  lang: Language;
  forceVisible?: boolean;
}

export const LeadCapturePopup: React.FC<LeadCapturePopupProps> = ({ lang, forceVisible = false }) => {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const t = useContent(lang).leadCapture;
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = ['/login', '/admin', '/staff', '/parent', '/book-tour'].includes(location.pathname);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }

    if (isDashboard || !t || t.enabled === 'false') {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      // Find the sticky announcement container
      const container = document.getElementById('announcement-container');
      if (container) {
        // Track the relative wrapper in HomePage to see if it's been scrolled past
        const wrapper = document.getElementById('announcement-wrapper');
        if (wrapper) {
          const wrapperRect = wrapper.getBoundingClientRect();
          // when wrapper bottom goes below 100, the announcement panel is scrolled out / gone
          if (wrapperRect.bottom <= 100) {
            setIsVisible(true);
            window.removeEventListener('scroll', handleScroll);
          }
        } else {
          const rect = container.getBoundingClientRect();
          if (rect.bottom < 0) {
            setIsVisible(true);
            window.removeEventListener('scroll', handleScroll);
          }
        }
      } else {
        // Fallback: trigger after scrolling past approx 500px if no active announcement is found on page load or scroll
        if (window.scrollY > 500) {
          setIsVisible(true);
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDashboard, t, forceVisible]);

  if (!isVisible || (!forceVisible && (isDashboard || !t || t.enabled === 'false'))) return null;

  // Handle customizable colors based on the type
  const getStyles = () => {
    switch (t.type) {
      case 'warning':
        return {
          iconBg: 'bg-brand-orange/10 text-brand-orange',
          btnClass: 'bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all transform hover:scale-[1.02]',
          borderClass: 'border-brand-orange/30'
        };
      case 'success':
        return {
          iconBg: 'bg-brand-teal/10 text-brand-teal',
          btnClass: 'bg-brand-teal hover:bg-brand-teal/95 text-white font-bold rounded-xl shadow-lg shadow-brand-teal/20 transition-all transform hover:scale-[1.02]',
          borderClass: 'border-brand-teal/30'
        };
      case 'danger':
        return {
          iconBg: 'bg-rose-500/10 text-rose-500',
          btnClass: 'bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:scale-[1.02]',
          borderClass: 'border-rose-500/30'
        };
      case 'royal':
        return {
          iconBg: 'bg-violet-500/10 text-violet-500',
          btnClass: 'bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 transition-all transform hover:scale-[1.02]',
          borderClass: 'border-violet-500/30'
        };
      case 'sunset':
        return {
          iconBg: 'bg-orange-500/10 text-orange-500',
          btnClass: 'bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.02]',
          borderClass: 'border-orange-500/30'
        };
      case 'teal':
        return {
          iconBg: 'bg-teal-600/10 text-teal-600',
          btnClass: 'bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all transform hover:scale-[1.02]',
          borderClass: 'border-teal-600/30'
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-brand-green/10 text-brand-green',
          btnClass: 'bg-brand-green hover:bg-brand-green/95 text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 transition-all transform hover:scale-[1.02]',
          borderClass: 'border-brand-green/30'
        };
    }
  };

  const styles = getStyles();

  const wrapperClass = forceVisible
    ? "relative w-full flex items-center justify-center p-4"
    : "fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none";

  const cardClass = `bg-white p-8 shadow-2xl border ${styles.borderClass} max-w-sm w-full relative rounded-3xl ${forceVisible ? '' : 'pointer-events-auto'}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className={wrapperClass}>
          <motion.div 
            initial={forceVisible ? { opacity: 1, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={forceVisible ? undefined : { opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={cardClass}
          >
            {!forceVisible && (
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={20} />
              </button>
            )}

            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-xl leading-tight text-stone-900">
                  {t.title}
                </h3>
                {t.text && (
                  <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                    {t.text}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-3 mt-6">
              <button 
                className={`w-full py-3 ${styles.btnClass}`}
                onClick={() => {
                  if (!forceVisible) {
                    setIsVisible(false);
                    navigate(t.buttonLink || '/book-tour');
                  }
                }}
              >
                {t.buttonText || 'Book Tour'}
              </button>
              <button 
                className="text-stone-500 text-sm font-medium hover:text-stone-900 transition-colors"
                onClick={() => {
                  if (!forceVisible) {
                    setIsVisible(false);
                  }
                }}
              >
                {t.laterText || 'Later'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

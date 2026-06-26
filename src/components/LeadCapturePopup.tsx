import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface LeadCapturePopupProps {
  lang: Language;
}

export const LeadCapturePopup: React.FC<LeadCapturePopupProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useContent(lang).leadCapture;
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = ['/login', '/admin', '/staff', '/parent', '/book-tour'].includes(location.pathname);

  useEffect(() => {
    if (isDashboard || !t || t.enabled === 'false') return;

    const handleScroll = () => {
      // Trigger the lead capture popup after scrolling past the announcement panel (e.g. 80px scroll)
      if (window.scrollY > 80) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDashboard, t]);

  if (!isVisible || isDashboard || !t || t.enabled === 'false') return null;

  // Handle customizable colors based on the Kidtopia logo colors config
  const getStyles = () => {
    const accentColor = t.color || 'brand-green';
    const buttonColor = t.buttonColor || 'brand-orange';

    let iconBg = 'bg-brand-green/10 text-brand-green';
    let borderClass = 'border-brand-green/30';
    
    switch (accentColor) {
      case 'brand-orange':
        iconBg = 'bg-brand-orange/10 text-brand-orange';
        borderClass = 'border-brand-orange/30';
        break;
      case 'brand-yellow':
        iconBg = 'bg-brand-yellow/20 text-brand-yellow-dark text-amber-600';
        borderClass = 'border-brand-yellow/30';
        break;
      case 'brand-teal':
        iconBg = 'bg-brand-teal/10 text-brand-teal';
        borderClass = 'border-brand-teal/30';
        break;
      case 'brand-green':
      default:
        iconBg = 'bg-brand-green/10 text-brand-green';
        borderClass = 'border-brand-green/30';
        break;
    }

    let btnClass = 'bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all transform hover:scale-[1.02]';
    switch (buttonColor) {
      case 'brand-green':
        btnClass = 'bg-brand-green hover:bg-brand-green/95 text-white font-bold rounded-xl shadow-lg shadow-brand-green/20 transition-all transform hover:scale-[1.02]';
        break;
      case 'brand-orange':
        btnClass = 'bg-brand-orange hover:bg-brand-orange/95 text-white font-bold rounded-xl shadow-lg shadow-brand-orange/20 transition-all transform hover:scale-[1.02]';
        break;
      case 'brand-yellow':
        btnClass = 'bg-brand-yellow hover:bg-brand-yellow/95 text-stone-900 font-bold rounded-xl shadow-lg shadow-brand-yellow/20 transition-all transform hover:scale-[1.02]';
        break;
      case 'brand-teal':
        btnClass = 'bg-brand-teal hover:bg-brand-teal/95 text-white font-bold rounded-xl shadow-lg shadow-brand-teal/20 transition-all transform hover:scale-[1.02]';
        break;
    }

    return { iconBg, borderClass, btnClass };
  };

  const styles = getStyles();

  const handleButtonClick = () => {
    setIsVisible(false);
    const link = t.buttonLink || '/book-tour';
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className={`glass-panel p-8 shadow-2xl border ${styles.borderClass} max-w-sm w-full pointer-events-auto relative rounded-3xl`}
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-start space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
                <Calendar size={24} />
              </div>
              <div>
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
                onClick={handleButtonClick}
              >
                {t.buttonText || t.book || 'Book Tour'}
              </button>
              <button 
                className="text-stone-500 text-sm font-medium hover:text-stone-900 transition-colors"
                onClick={() => setIsVisible(false)}
              >
                {t.laterText || t.later || 'Later'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

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

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [isDashboard, t]);

  if (!isVisible || isDashboard || !t || t.enabled === 'false') return null;

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

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-white p-8 shadow-2xl border ${styles.borderClass} max-w-sm w-full pointer-events-auto relative rounded-3xl`}
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center space-x-4 mb-4">
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
                onClick={() => {
                  setIsVisible(false);
                  navigate(t.buttonLink || '/book-tour');
                }}
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

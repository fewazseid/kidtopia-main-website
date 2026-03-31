import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';

interface LeadCapturePopupProps {
  lang: Language;
}

export const LeadCapturePopup: React.FC<LeadCapturePopupProps> = ({ lang }) => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useContent(lang).leadCapture;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="card-rounded p-8 shadow-2xl border border-brand-cream max-w-sm w-full pointer-events-auto relative"
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <h3 className="font-serif font-bold text-xl leading-tight">
                {t.title}
              </h3>
            </div>

            <div className="flex flex-col space-y-3">
              <button 
                className="btn-yellow w-full py-3"
                onClick={() => {
                  console.log('Lead Capture: Book Tour Clicked');
                  setIsVisible(false);
                }}
              >
                {t.book}
              </button>
              <button 
                className="text-stone-500 text-sm font-medium hover:text-stone-900 transition-colors"
                onClick={() => setIsVisible(false)}
              >
                {t.later}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

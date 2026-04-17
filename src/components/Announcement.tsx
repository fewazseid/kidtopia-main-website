import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';

interface AnnouncementProps {
  lang: Language;
}

export const Announcement: React.FC<AnnouncementProps> = ({ lang }) => {
  const content = useContent(lang);
  const announcement = content?.announcement;
  const [isFloating, setIsFloating] = useState(true);

  // Still keep floating logic for the animation, but rely on native CSS for stickiness
  useEffect(() => {
    const handleFloating = () => {
      // Only disable floating animation if scrolled past 1000px
      if (window.scrollY > 1000) {
        setIsFloating(false);
      } else {
        setIsFloating(true);
      }
    };
    
    window.addEventListener('scroll', handleFloating);
    return () => window.removeEventListener('scroll', handleFloating);
  }, []);

  const getStyles = () => {
    switch (announcement?.type) {
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400',
          text: 'text-white',
          iconBg: 'bg-white/20',
          icon: <AlertTriangle className="w-8 h-8 text-white drop-shadow-md" />
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400',
          text: 'text-white',
          iconBg: 'bg-white/20',
          icon: <CheckCircle className="w-8 h-8 text-white drop-shadow-md" />
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500',
          text: 'text-white',
          iconBg: 'bg-white/20',
          icon: <Info className="w-8 h-8 text-white drop-shadow-md" />
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {announcement && (announcement.text || announcement.title) && (announcement.text?.trim() !== "" || announcement.title?.trim() !== "") && (
        <div style={{ height: '1000px' }} className="relative z-40">
          <div className="sticky top-0 w-full px-4 pt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: isFloating ? [0, -10, 0] : 0,
                rotate: isFloating ? [0, -1.5, 1.5, 0] : 0
              }}
              transition={{ 
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                opacity: { duration: 0.4 }
              }}
              className={`rounded-[2rem] ${styles.bg} shadow-2xl border border-white/20`}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:40px_40px]"></div>

              <div className="max-w-6xl mx-auto px-8 py-10 md:py-16 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="flex-shrink-0">
                    <div className={`p-8 rounded-full shadow-inner backdrop-blur-md ${styles.iconBg} border border-white/30`}>
                      {styles.icon}
                    </div>
                  </div>
                  <div className={`flex-1 ${styles.text}`}>
                    {announcement.title && (
                      <h3 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight drop-shadow font-serif">
                        {announcement.title}
                      </h3>
                    )}
                    {announcement.text && (
                      <p className="text-xl md:text-2xl opacity-95 leading-relaxed max-w-4xl drop-shadow font-medium">
                        {announcement.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

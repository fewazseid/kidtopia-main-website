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
        <div id="announcement-container" className="sticky top-0 z-40 w-full px-4 pt-4 pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -12, 0, -6, 0], // Bouncy, multi-step movement
              rotate: [0, -2, 2, -1, 1, 0] // More complex, vibrational shake
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 1, ease: "easeInOut" },
              opacity: { duration: 0.5 }
            }}
            className={`rounded-3xl ${styles.bg} shadow-2xl border border-white/20 mx-auto max-w-md md:max-w-4xl w-full will-change-transform`}
          >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:40px_40px]"></div>

            <div className="px-6 py-4 md:py-6 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-full shadow-inner backdrop-blur-md ${styles.iconBg} border border-white/30`}>
                    {styles.icon}
                  </div>
                </div>
                <div className={`flex-1 ${styles.text}`}>
                  {announcement.title && (
                    <h3 className="text-xl md:text-2xl font-extrabold mb-1 tracking-tight drop-shadow font-serif">
                      {announcement.title}
                    </h3>
                  )}
                  {announcement.text && (
                    <p className="text-sm md:text-md opacity-95 leading-relaxed max-w-3xl drop-shadow font-medium">
                      {announcement.text}
                    </p>
                  )}
                </div>
              </div>
            </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

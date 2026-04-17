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
  const [isSticky, setIsSticky] = useState(true);
  const [isFloating, setIsFloating] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Threshold check: once user scrolls past 300px, break the sticky behavior
      if (window.scrollY > 300) {
        setIsSticky(false);
        setIsFloating(false);
      } else {
        setIsSticky(true);
        setIsFloating(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        // Added pt-4 to prevent overlap, increased margin and z-index priority
        <div className={`transition-all duration-500 ease-in-out ${isSticky ? 'sticky top-0 z-40' : 'relative'} mb-8`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -8, 0],
              rotate: [0, -1, 1, 0] // Subtle, smoother motion
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              opacity: { duration: 0.8 }
            }}
            className={`rounded-b-3xl ${styles.bg} shadow-2xl border-b-4 border-white/20`}
          >
            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:40px_40px]"></div>

            {/* Increased padding here to fix spacing issues */}
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
      )}
    </AnimatePresence>
  );
};

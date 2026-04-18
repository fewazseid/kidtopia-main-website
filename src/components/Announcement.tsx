import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Info, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { Link } from 'react-router-dom';

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
          icon: <AlertTriangle className="w-8 h-8 text-white drop-shadow-md" />,
          buttonHover: 'hover:bg-amber-600'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400',
          text: 'text-white',
          iconBg: 'bg-white/20',
          icon: <CheckCircle className="w-8 h-8 text-white drop-shadow-md" />,
          buttonHover: 'hover:bg-emerald-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500',
          text: 'text-white',
          iconBg: 'bg-white/20',
          icon: <Info className="w-8 h-8 text-white drop-shadow-md" />,
          buttonHover: 'hover:bg-blue-700'
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {announcement && (announcement.text || announcement.title) && (announcement.text?.trim() !== "" || announcement.title?.trim() !== "") && (
        <div id="announcement-container" className="sticky top-[72px] z-40 w-full px-4 pt-4 pb-4 md:top-[80px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isFloating ? { 
              opacity: 1, 
              scale: 1,
              y: [0, -12, 0, -6, 0],
              rotate: [0, -2, 2, -1, 1, 0]
            } : {
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: 0
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 1, ease: "easeInOut" },
              opacity: { duration: 0.5 }
            }}
            className={`rounded-2xl ${styles.bg} shadow-2xl border border-white/20 mx-auto max-w-md md:max-w-4xl w-full will-change-transform`}
          >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:40px_40px] pointer-events-none rounded-2xl"></div>

            <div className="px-5 py-4 relative z-10 flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-between">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-shrink-0 hidden md:block">
                  <div className={`p-2.5 rounded-full shadow-inner backdrop-blur-md ${styles.iconBg} border border-white/30`}>
                    {styles.icon}
                  </div>
                </div>
                <div className={`flex-1 ${styles.text}`}>
                  {announcement.title && (
                    <h3 className="text-lg md:text-xl font-extrabold mb-0.5 tracking-tight drop-shadow font-serif">
                      {announcement.title}
                    </h3>
                  )}
                  {announcement.text && (
                    <p className="text-sm opacity-95 leading-relaxed max-w-2xl drop-shadow font-medium">
                      {announcement.text}
                    </p>
                  )}
                </div>
              </div>
              
              {announcement.buttonLink && announcement.buttonText && (
                <div className="mt-2 md:mt-0 flex-shrink-0">
                  <Link 
                    to={announcement.buttonLink} 
                    className={`inline-flex items-center gap-2 bg-white text-stone-900 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg ${styles.buttonHover} hover:text-white group`}
                  >
                    {announcement.buttonText}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

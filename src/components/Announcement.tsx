import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, X, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';

interface AnnouncementProps {
  lang: Language;
}

export const Announcement: React.FC<AnnouncementProps> = ({ lang }) => {
  const content = useContent(lang);
  const announcement = content?.announcement;

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
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`relative ${styles.bg} overflow-hidden shadow-xl border-b border-white/10`}
        >
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]"></div>

          <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="flex-shrink-0">
                <motion.div 
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className={`p-4 rounded-2xl shadow-lg backdrop-blur-md ${styles.iconBg} border border-white/30`}
                >
                  {styles.icon}
                </motion.div>
              </div>
              <div className={`flex-1 flex flex-col justify-center ${styles.text}`}>
                {announcement.title && (
                  <h3 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight drop-shadow-sm font-serif">
                    {announcement.title}
                  </h3>
                )}
                {announcement.text && (
                  <p className="text-lg md:text-xl opacity-95 leading-relaxed max-w-4xl drop-shadow-sm font-medium">
                    {announcement.text}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

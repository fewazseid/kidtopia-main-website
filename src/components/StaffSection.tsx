import React, { useState, useEffect } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Users, Heart } from 'lucide-react';

interface StaffSectionProps {
  lang: Language;
}

export const StaffSection: React.FC<StaffSectionProps> = ({ lang }) => {
  const t = useContent(lang).staff;
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!showAll) {
      setShowSticky(false);
      return;
    }
    const handleScroll = () => {
      const element = document.getElementById('staff');
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const isPastTop = rect.top < 0;
      const isBeforeBottom = rect.bottom > window.innerHeight;
      setShowSticky(isPastTop && isBeforeBottom);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAll]);

  const limit = isMobile ? 3 : 4;
  const displayedMembers = showAll ? t.members : t.members.slice(0, limit);

  const handleToggle = () => {
    if (showAll) {
      const element = document.getElementById('staff');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setShowAll(!showAll);
  };

  return (
    <section id="staff" className="py-24 bg-transparent scroll-mt-24 relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute top-1/4 right-[-10%] w-[400px] h-[400px] rounded-full bg-brand-yellow/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <Users size={14} className="stroke-[2.5]" />
            {lang === 'am' ? 'አስተማሪዎች እና አማካሪዎች' : 'Educators & Mentors'}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3.5xl sm:text-5xl font-editorial font-bold text-stone-900 mb-4 tracking-tight leading-tight"
          >
            {t.title}
          </motion.h2>
          <div className="w-16 h-1.5 bg-brand-green mx-auto rounded-full mt-2"></div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-stretch">
          {displayedMembers.filter(Boolean).map((member: any, idx: number) => (
            <motion.div
              key={member.name + idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col items-center text-center h-full"
            >
              {/* Visual Avatar frame with organic border background */}
              <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden mb-6 shadow-lg bg-stone-100 border-4 border-white transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl">
                {member.image && (
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                )}
                {/* Glass overlay bio on hover */}
                <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6 text-left">
                  <span className="w-8 h-8 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center mb-3">
                    <Heart size={16} className="fill-current" />
                  </span>
                  <p className="text-white text-sm font-medium leading-relaxed mb-1">{member.desc}</p>
                  <span className="text-[10px] uppercase tracking-widest text-brand-yellow font-black">{lang === 'am' ? 'የሕይወት ታሪክ' : 'Bio Profile'}</span>
                </div>
              </div>

              <div className="px-2">
                <h3 className="text-xl font-editorial font-bold text-stone-900 mb-1 tracking-tight group-hover:text-brand-green transition-colors duration-300">{member.name}</h3>
                <p className="text-brand-green font-black text-[11px] uppercase tracking-wider font-accent">{member.role}</p>
                {/* Tablet and Mobile description fallback */}
                <p className="text-stone-600 dark:text-stone-400 text-xs mt-2.5 leading-relaxed block lg:hidden max-w-xs mx-auto italic bg-stone-100/60 dark:bg-stone-800/40 p-2.5 rounded-xl border border-stone-200/40">
                  "{member.desc}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {t.members.length > limit && (
          <div className="mt-16 text-center">
            <button 
              onClick={handleToggle}
              className="inline-flex items-center gap-2 px-10 py-4.5 bg-brand-green text-white rounded-full text-sm font-black tracking-wider uppercase hover:bg-brand-orange hover:shadow-[0_15px_30px_rgba(240,140,60,0.2)] transition-all hover:scale-105 active:scale-95 duration-300 cursor-pointer shadow-lg"
            >
              {showAll ? t.showLess : t.seeMore}
              {showAll ? <ChevronUp size={16} className="stroke-[2.5]" /> : <ChevronDown size={16} className="stroke-[2.5]" />}
            </button>
          </div>
        )}

        {/* Sticky/Floating collapse button when list is expanded */}
        <AnimatePresence>
          {showSticky && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <button
                onClick={handleToggle}
                className="flex items-center gap-1.5 px-4 py-3 bg-white/80 backdrop-blur-md border border-stone-200/80 rounded-full text-xs font-black tracking-widest uppercase text-stone-900 shadow-xl hover:bg-stone-100 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <ChevronUp size={14} className="stroke-[2.5] text-brand-green" />
                {t.showLess}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

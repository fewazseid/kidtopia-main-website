import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface CTASectionProps {
  lang: Language;
}

export const CTASection: React.FC<CTASectionProps> = ({ lang }) => {
  const t = useContent(lang).cta;

  return (
    <section className="py-28 bg-gradient-to-br from-brand-green via-brand-green/95 to-brand-teal text-white relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-dashed border-white/5 rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 bg-white/10 text-brand-yellow text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-6 border border-white/10"
        >
          <Sparkles size={14} className="animate-pulse" />
          Join Our Happy Family
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl font-editorial font-bold mb-6 tracking-tight leading-tight"
        >
          {t.title}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          {t.desc}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-5"
        >
          <Link 
            to="/enroll" 
            className="bg-white text-brand-green rounded-full px-10 py-4.5 text-base font-bold hover:bg-brand-cream transition-all hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] duration-350"
          >
            {t.enroll}
          </Link>
          <Link 
            to="/virtual-tour" 
            className="bg-brand-yellow text-stone-900 rounded-full px-10 py-4.5 text-base font-bold hover:bg-brand-yellow/90 transition-all hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(229,177,93,0.15)] duration-350"
          >
            {t.virtualTour}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

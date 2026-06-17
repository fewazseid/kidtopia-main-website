import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface CTASectionProps {
  lang: Language;
}

export const CTASection: React.FC<CTASectionProps> = ({ lang }) => {
  const t = useContent(lang).cta;

  return (
    <section className="py-24 bg-brand-green text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl font-serif font-bold mb-6"
        >
          {t.title}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl text-white/80 mb-12 max-w-2xl mx-auto"
        >
          {t.desc}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link to="/enroll" className="bg-white text-brand-green rounded-full px-10 py-4 text-lg font-bold hover:bg-brand-cream transition-colors shadow-xl">
            {t.enroll}
          </Link>
          <Link to="/virtual-tour" className="bg-brand-yellow text-stone-900 rounded-full px-10 py-4 text-lg font-bold hover:bg-brand-yellow/90 transition-colors">
            {t.virtualTour}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

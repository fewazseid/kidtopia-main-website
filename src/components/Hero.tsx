import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Shield, Users, LayoutGrid } from 'lucide-react';

interface HeroProps {
  lang: Language;
  onScrollTo: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onScrollTo }) => {
  const t = useContent(lang).hero;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {t.heroImage && (
          <img 
            src={t.heroImage} 
            alt="Happy children learning and playing" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream/95 via-brand-cream/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cream/50 to-brand-cream"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6 text-stone-900"
          >
            {t.headline}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-stone-600 mb-10 leading-relaxed"
          >
            {t.subheadline}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/contact" className="btn-secondary text-lg px-8 py-4">{t.enroll}</Link>
            <Link to="/virtual-tour" className="btn-yellow text-lg px-8 py-4">{t.virtualTour}</Link>
          </motion.div>
        </div>

        {/* Highlights Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.4, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {t.highlights.map((item, idx) => (
            <div key={idx} className="card-rounded p-8 flex items-start space-x-4 border border-stone-100 hover:shadow-md transition-shadow">
              <div className={`bg-brand-cream p-3 rounded-2xl ${idx === 0 ? 'text-brand-green' : idx === 1 ? 'text-brand-orange' : 'text-brand-teal'}`}>
                {idx === 0 && <Shield size={24} />}
                {idx === 1 && <Users size={24} />}
                {idx === 2 && <LayoutGrid size={24} />}
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-stone-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

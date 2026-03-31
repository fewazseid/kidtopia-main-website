import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface VirtualTourProps {
  lang: Language;
}

export const VirtualTour: React.FC<VirtualTourProps> = ({ lang }) => {
  const t = useContent(lang).virtualTour;

  return (
    <section id="virtual-tour" className="py-24 bg-stone-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            {t.title}
          </motion.h2>
          <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-video rounded-[40px] overflow-hidden relative group cursor-pointer"
          >
            <img 
              src={t.image} 
              alt="Virtual Tour Preview" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                <Play size={40} fill="white" />
              </div>
            </div>
          </motion.div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <button className="btn-primary px-10 py-4 text-lg">{t.watchFull}</button>
            <button className="btn-yellow px-10 py-4 text-lg">{t.schedule}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

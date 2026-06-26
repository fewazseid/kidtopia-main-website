import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface WhyChooseProps {
  lang: Language;
}

export const WhyChoose: React.FC<WhyChooseProps> = ({ lang }) => {
  const t = useContent(lang).whyChoose;

  return (
    <section className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-8"
            >
              {t.title}
            </motion.h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {t.features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: idx * 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle2 className="text-brand-teal shrink-0 mt-1" size={20} />
                  <span className="text-stone-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {t.image1 && (
                <img src={t.image1} alt="Toddler program" className="pill-image w-full" referrerPolicy="no-referrer" />
              )}
              {t.image2 && (
                <img src={t.image2} alt="Preschool program" className="pill-image w-full mt-12" referrerPolicy="no-referrer" />
              )}
            </div>
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-yellow/20 rounded-full -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-teal/10 rounded-full -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

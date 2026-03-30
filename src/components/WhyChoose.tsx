import React from 'react';
import { Language, translations } from '../translations';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface WhyChooseProps {
  lang: Language;
}

export const WhyChoose: React.FC<WhyChooseProps> = ({ lang }) => {
  const t = translations[lang].whyChoose;

  return (
    <section className="py-24 bg-brand-warm-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
                  transition={{ delay: idx * 0.1 }}
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
              <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop" alt="Toddler program" className="pill-image w-full" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop" alt="Preschool program" className="pill-image w-full mt-12" referrerPolicy="no-referrer" />
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

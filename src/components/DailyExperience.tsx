import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';

interface DailyExperienceProps {
  lang: Language;
}

export const DailyExperience: React.FC<DailyExperienceProps> = ({ lang }) => {
  const t = useContent(lang).dailyExperience;

  return (
    <section className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            {t.title}
          </motion.h2>
          <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-green/20 hidden md:block"></div>

          <div className="space-y-12">
            {t.timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 2.4, delay: idx * 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="md:w-1/2 flex justify-center md:justify-start px-8">
                  <GlassCard 
                    className={`p-8 w-full max-w-md ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                    delay={idx * 0.1}
                  >
                    {item.image && (
                      <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                        <img src={item.image} alt={item.activity} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <span className="text-brand-teal font-bold text-sm uppercase tracking-widest mb-2 block">{item.time}</span>
                    <h3 className="text-2xl font-serif font-bold text-stone-800">{item.activity}</h3>
                  </GlassCard>
                </div>
                
                <div className="w-10 h-10 bg-brand-green rounded-full border-4 border-brand-cream z-10 my-4 md:my-0 flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </div>
                
                <div className="md:w-1/2 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

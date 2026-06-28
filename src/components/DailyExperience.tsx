import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { Clock } from 'lucide-react';

interface DailyExperienceProps {
  lang: Language;
}

export const DailyExperience: React.FC<DailyExperienceProps> = ({ lang }) => {
  const t = useContent(lang).dailyExperience;

  return (
    <section className="py-24 bg-transparent overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/3 left-10 w-2 h-2 rounded-full bg-brand-teal/40 animate-ping pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-2.5 h-2.5 rounded-full bg-brand-orange/40 animate-ping pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <Clock size={14} className="stroke-[2.5]" />
            A Day in the Life
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
          <div className="w-16 h-1.5 bg-brand-orange mx-auto rounded-full mt-2"></div>
        </div>

        <div className="relative">
          {/* Enhanced Vertical Gradient Track */}
          <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-brand-orange/30 via-brand-green/30 to-brand-teal/30 rounded-full -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-16">
            {t.timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Card Container */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-start px-4 sm:px-8">
                  <GlassCard 
                    className={`p-6 sm:p-8 w-full max-w-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-all duration-300 border-t-4 ${
                      idx % 3 === 0 ? 'border-t-brand-orange/85' : 
                      idx % 3 === 1 ? 'border-t-brand-green/85' : 
                      'border-t-brand-teal/85'
                    } ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                    delay={0}
                  >
                    {item.image && (
                      <div className="w-full h-52 rounded-2xl overflow-hidden mb-6 shadow-md relative group">
                        <img 
                          src={item.image} 
                          alt={item.activity} 
                          className="w-full h-full object-cover scale-102 group-hover:scale-110 transition-transform duration-700" 
                          referrerPolicy="no-referrer" 
                        />
                        <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0" />
                      </div>
                    )}
                    <div className={`flex items-center gap-2 mb-2 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${
                        idx % 3 === 0 ? 'bg-brand-orange/10 text-brand-orange' : 
                        idx % 3 === 1 ? 'bg-brand-green/10 text-brand-green' : 
                        'bg-brand-teal/10 text-brand-teal'
                      }`}>{item.time}</span>
                    </div>
                    <h3 className="text-2xl font-editorial font-bold text-stone-900 tracking-tight">{item.activity}</h3>
                  </GlassCard>
                </div>
                
                {/* Step Circle Pin with pulsing outline */}
                <div className="relative my-6 md:my-0">
                  <div className={`w-12 h-12 rounded-full border-4 border-white shadow-xl z-15 flex items-center justify-center text-white font-black text-base relative ${
                    idx % 3 === 0 ? 'bg-brand-orange' : 
                    idx % 3 === 1 ? 'bg-brand-green' : 
                    'bg-brand-teal'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`absolute -inset-1.5 rounded-full -z-10 animate-ping opacity-25 ${
                    idx % 3 === 0 ? 'bg-brand-orange' : 
                    idx % 3 === 1 ? 'bg-brand-green' : 
                    'bg-brand-teal'
                  }`} style={{ animationDuration: '3s' }}></span>
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

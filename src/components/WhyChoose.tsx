import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { CheckCircle2, Award } from 'lucide-react';

interface WhyChooseProps {
  lang: Language;
}

export const WhyChoose: React.FC<WhyChooseProps> = ({ lang }) => {
  const t = useContent(lang).whyChoose;

  return (
    <section className="py-24 bg-transparent overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-brand-orange/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-brand-green/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Column: Copy and Features */}
          <div className={`${(t.image1 || t.image2) ? 'lg:w-1/2 text-left' : 'w-full max-w-4xl mx-auto text-center'}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-6 border border-brand-green/10"
            >
              <Award size={14} className="stroke-[2.5]" />
              Exceptional Standards
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3.5xl sm:text-5xl font-editorial font-bold text-stone-900 mb-8 tracking-tight leading-tight"
            >
              {t.title}
            </motion.h2>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${(t.image1 || t.image2) ? '' : 'md:grid-cols-3'} gap-4 text-left`}>
              {t.features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3.5 bg-white/50 hover:bg-white/85 border border-white/60 p-4.5 rounded-2xl shadow-[0_4px_15px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_25px_-10px_rgba(0,0,0,0.05)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 group cursor-default"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all shrink-0 shadow-sm">
                    <CheckCircle2 className="stroke-[2.5]" size={16} />
                  </div>
                  <span className="text-stone-700 font-bold text-sm tracking-tight leading-tight">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Visual Collage */}
          {(t.image1 || t.image2) && (
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 grid grid-cols-2 gap-6 items-start">
                {t.image1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden organic-border-1 border-8 border-white shadow-2xl hover:scale-[1.03] hover:rotate-[-2deg] transition-all duration-500 aspect-[3/4] bg-stone-100"
                  >
                    <img src={t.image1} alt="Toddler program playing happily" className="w-full h-full object-cover scale-105" referrerPolicy="no-referrer" />
                  </motion.div>
                )}
                {t.image2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden organic-border-2 border-8 border-white shadow-2xl hover:scale-[1.03] hover:rotate-[2deg] transition-all duration-500 aspect-[3/4] mt-12 bg-stone-100"
                  >
                    <img src={t.image2} alt="Preschool learning session" className="w-full h-full object-cover scale-105" referrerPolicy="no-referrer" />
                  </motion.div>
                )}
              </div>

              {/* Premium geometric layout dots & rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-dashed border-brand-green/10 rounded-full pointer-events-none -z-10" />
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-brand-yellow/25 rounded-full -z-10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-brand-teal/20 rounded-full -z-10 blur-xl pointer-events-none" />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

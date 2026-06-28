import React, { useState } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronUp, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from './GlassCard';

interface ProgramsProps {
  lang: Language;
}

export const Programs: React.FC<ProgramsProps> = ({ lang }) => {
  const t = useContent(lang).programs;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section id="programs" className="py-28 bg-transparent relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-teal/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] rounded-full bg-brand-yellow/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-teal/10 text-brand-teal text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <Compass size={14} className="stroke-[2.5]" />
            Nurturing Curriculum
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
          <div className="w-16 h-1.5 bg-brand-teal mx-auto rounded-full mt-2"></div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {t.cards.map((card: any, idx: number) => (
            <motion.div 
              key={idx} 
              className="flex h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard 
                layout
                className="overflow-hidden flex flex-col group w-full h-full shadow-[0_15px_35px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300"
                delay={0}
              >
                <div className="flex flex-col md:flex-row h-full">
                  
                  {/* Left Column: Image with overlay */}
                  <div className="md:w-[45%] h-64 md:h-auto min-h-[300px] relative overflow-hidden">
                    {card.image && (
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="absolute inset-0 w-full h-full object-cover scale-102 group-hover:scale-110 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-stone-950/10 to-transparent" />
                    
                    {/* Floating Age Tag inside Image */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-white/45 text-stone-900 px-3.5 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-md">
                      🍼 {card.age}
                    </div>
                  </div>

                  {/* Right Column: Copy & Actions */}
                  <div className="md:w-[55%] p-8 sm:p-10 flex flex-col justify-between items-start text-left bg-white/40">
                    <div className="w-full">
                      <h3 className="text-2.5xl font-editorial font-bold mb-3.5 text-stone-900 tracking-tight">{card.name}</h3>
                      <p className="text-stone-550 leading-relaxed text-sm font-medium">
                        {card.desc}
                      </p>
                      
                      <div className="overflow-hidden w-full">
                        <AnimatePresence initial={false}>
                          {expandedIdx === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              className="text-stone-550 font-medium leading-relaxed text-sm border-t border-stone-200/40 pt-4.5"
                            >
                              {card.moreInfo || "More information coming soon..."}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-4 mt-8 w-full pt-4 border-t border-stone-100/40">
                      <button 
                        onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        className="flex items-center text-brand-green font-bold text-sm tracking-tight hover:text-brand-green-light transition-colors cursor-pointer group/btn"
                      >
                        {expandedIdx === idx ? 'Show Less' : card.btn} 
                        {expandedIdx === idx ? (
                          <ChevronUp size={16} className="ml-1.5 group-hover/btn:-translate-y-0.5 transition-transform stroke-[2.5]" />
                        ) : (
                          <ArrowRight size={16} className="ml-1.5 group-hover/btn:translate-x-1 transition-transform stroke-[2.5]" />
                        )}
                      </button>
                      <Link 
                        to="/enroll"
                        className="btn-secondary text-xs font-black tracking-tight uppercase px-5 py-2.5 inline-flex items-center shadow-md shadow-brand-orange/15 hover:scale-[1.05] active:scale-95 ml-auto"
                      >
                        {lang === 'am' ? 'ይመዝገቡ' : 'Enroll'}
                      </Link>
                    </div>
                  </div>

                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

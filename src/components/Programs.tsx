import React, { useState } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from './GlassCard';

interface ProgramsProps {
  lang: Language;
}

export const Programs: React.FC<ProgramsProps> = ({ lang }) => {
  const t = useContent(lang).programs;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section id="programs" className="py-24 bg-transparent">
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

        <div className="flex flex-wrap justify-center gap-8 items-stretch">
          {t.cards.map((card: any, idx: number) => (
            <div key={idx} className="w-full lg:w-[calc(50%-1rem)] flex flex-col">
              <GlassCard 
                layout
                disableMotion
                className="overflow-hidden flex flex-col group w-full h-full"
                delay={idx * 0.25}
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/2 h-64 md:h-auto min-h-[260px] relative overflow-hidden">
                    {card.image && (
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="md:w-1/2 p-10 flex flex-col justify-between items-center text-center flex-grow">
                    <div className="w-full">
                      <span className={`font-medium text-sm uppercase tracking-wider mb-2 block ${idx === 0 ? 'text-brand-orange' : 'text-brand-teal'}`}>{card.age}</span>
                      <h3 className="text-3xl font-serif font-bold mb-4">{card.name}</h3>
                      <p className="text-stone-650 leading-relaxed text-base">
                        {card.desc}
                      </p>
                      
                      <div className="overflow-hidden w-full">
                        <AnimatePresence initial={false}>
                          {expandedIdx === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                              className="text-stone-650 font-normal leading-relaxed text-base border-t border-stone-200/50 pt-4"
                            >
                              {card.moreInfo || "More information coming soon..."}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                      <button 
                        onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        className="flex items-center text-brand-green font-bold hover:translate-x-1 transition-transform cursor-pointer"
                      >
                        {expandedIdx === idx ? 'Show Less' : card.btn} 
                        {expandedIdx === idx ? <ChevronUp size={18} className="ml-2" /> : <ArrowRight size={18} className="ml-2" />}
                      </button>
                      <Link 
                        to="/enroll"
                        className="btn-secondary text-sm font-bold px-6 py-2.5 inline-flex items-center shadow-lg shadow-brand-orange/15 hover:scale-[1.03]"
                      >
                        {lang === 'am' ? 'አሁኑኑ ይመዝገቡ' : 'Enroll Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

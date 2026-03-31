import React, { useState } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronUp } from 'lucide-react';

interface ProgramsProps {
  lang: Language;
}

export const Programs: React.FC<ProgramsProps> = ({ lang }) => {
  const t = useContent(lang).programs;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section id="programs" className="py-24 bg-brand-cream">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {t.cards.map((card: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: idx * 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="card-rounded overflow-hidden flex flex-col group bg-white"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                  <span className={`font-medium text-sm uppercase tracking-wider mb-2 ${idx === 0 ? 'text-brand-orange' : 'text-brand-teal'}`}>{card.age}</span>
                  <h3 className="text-3xl font-serif font-bold mb-4">{card.name}</h3>
                  <p className="text-stone-600 mb-8 leading-relaxed">{card.desc}</p>
                  <button 
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                    className="flex items-center text-brand-green font-bold hover:translate-x-2 transition-transform"
                  >
                    {expandedIdx === idx ? 'Show Less' : card.btn} 
                    {expandedIdx === idx ? <ChevronUp size={18} className="ml-2" /> : <ArrowRight size={18} className="ml-2" />}
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {expandedIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-10 border-t border-stone-100 bg-stone-50/50">
                      <p className="text-stone-600 leading-relaxed italic">
                        {card.moreInfo || "More information coming soon..."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  lang: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang }) => {
  const t = useContent(lang).faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!t || !t.items) return null;

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-brand-cream/10 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/3 left-[-10vw] w-[35vw] h-[35vw] rounded-full bg-brand-yellow/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-[-10vw] w-[35vw] h-[35vw] rounded-full bg-brand-green/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4 border border-brand-green/10"
          >
            <HelpCircle size={14} className="stroke-[2.5]" />
            Got Questions?
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
          <div className="w-16 h-1.5 bg-brand-yellow mx-auto rounded-full mt-2"></div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {t.items.map((item: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="border border-stone-200 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left outline-none group"
                >
                  <span className="text-stone-850 font-extrabold text-lg sm:text-xl tracking-tight leading-snug group-hover:text-brand-green transition-colors">
                    {item.question}
                  </span>
                  <div
                    className={`ml-4 p-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-brand-green text-white rotate-180' : 'bg-stone-100 text-stone-500 group-hover:bg-brand-green/10 group-hover:text-brand-green'
                    }`}
                  >
                    <ChevronDown size={18} className="stroke-[2.5]" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-stone-600 text-base sm:text-lg leading-relaxed font-medium border-t border-stone-100/50 pt-3">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

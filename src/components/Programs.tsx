import React from 'react';
import { Language, translations } from '../translations';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface ProgramsProps {
  lang: Language;
}

export const Programs: React.FC<ProgramsProps> = ({ lang }) => {
  const t = translations[lang].programs;

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
          {t.cards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: idx * 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="card-rounded overflow-hidden flex flex-col md:flex-row group"
            >
              <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img 
                  src={idx === 0 
                    ? "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800&auto=format&fit=crop" 
                    : "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"} 
                  alt={card.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-center">
                <span className={`font-medium text-sm uppercase tracking-wider mb-2 ${idx === 0 ? 'text-brand-orange' : 'text-brand-teal'}`}>{card.age}</span>
                <h3 className="text-3xl font-serif font-bold mb-4">{card.name}</h3>
                <p className="text-stone-600 mb-8 leading-relaxed">{card.desc}</p>
                <button className="flex items-center text-brand-green font-bold hover:translate-x-2 transition-transform">
                  {card.btn} <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

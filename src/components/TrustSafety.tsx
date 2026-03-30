import React from 'react';
import { Language, translations } from '../translations';
import { motion } from 'motion/react';
import { ClipboardCheck, UserCheck, Key, Sparkles } from 'lucide-react';

interface TrustSafetyProps {
  lang: Language;
}

export const TrustSafety: React.FC<TrustSafetyProps> = ({ lang }) => {
  const t = translations[lang].safety;
  const icons = [<ClipboardCheck />, <UserCheck />, <Key />, <Sparkles />];

  return (
    <section className="py-24 bg-brand-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            {t.title}
          </motion.h2>
          <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.cards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[32px] border border-stone-100 hover:border-brand-green/20 transition-colors bg-brand-cream/30"
            >
              <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center mb-6">
                {icons[idx]}
              </div>
              <h3 className="font-serif font-bold text-xl mb-4">{card.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

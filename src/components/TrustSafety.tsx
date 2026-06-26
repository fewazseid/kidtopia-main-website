import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { ClipboardCheck, UserCheck, Key, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface TrustSafetyProps {
  lang: Language;
}

export const TrustSafety: React.FC<TrustSafetyProps> = ({ lang }) => {
  const t = useContent(lang).safety;
  const icons = [<ClipboardCheck />, <UserCheck />, <Key />, <Sparkles />];

  return (
    <section className="py-24 bg-transparent">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.cards.map((card: any, idx: number) => (
            <GlassCard 
              key={idx}
              delay={idx * 0.15}
              className="p-8"
            >
              {card.image ? (
                <div className="w-12 h-12 rounded-2xl overflow-hidden mb-6">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center mb-6">
                  {icons[idx % icons.length]}
                </div>
              )}
              <h3 className="font-serif font-bold text-xl mb-4">{card.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{card.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

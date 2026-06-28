import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { ClipboardCheck, UserCheck, Key, Sparkles, ShieldCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface TrustSafetyProps {
  lang: Language;
}

export const TrustSafety: React.FC<TrustSafetyProps> = ({ lang }) => {
  const t = useContent(lang).safety;
  const icons = [
    <ClipboardCheck className="w-6 h-6 stroke-[2.2]" />, 
    <UserCheck className="w-6 h-6 stroke-[2.2]" />, 
    <Key className="w-6 h-6 stroke-[2.2]" />, 
    <Sparkles className="w-6 h-6 stroke-[2.2]" />
  ];

  const colors = [
    { bg: 'bg-brand-green/10', text: 'text-brand-green', border: 'border-brand-green/20' },
    { bg: 'bg-brand-orange/10', text: 'text-brand-orange', border: 'border-brand-orange/20' },
    { bg: 'bg-brand-yellow/15', text: 'text-amber-600', border: 'border-brand-yellow/30' },
    { bg: 'bg-brand-teal/10', text: 'text-brand-teal', border: 'border-brand-teal/20' }
  ];

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Decorative ambient dots */}
      <div className="absolute top-1/2 left-4 w-4 h-4 rounded-full bg-brand-yellow/40 animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 right-8 w-6 h-6 rounded-full bg-brand-orange/20 animate-bounce pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-black tracking-widest uppercase font-accent px-4 py-1.5 rounded-full mb-4"
          >
            <ShieldCheck size={14} className="stroke-[2.5]" />
            Your Peace of Mind is Our Priority
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {t.cards.map((card: any, idx: number) => {
            const colorScheme = colors[idx % colors.length];
            return (
              <motion.div 
                key={idx} 
                className="flex h-full"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard 
                  delay={0}
                  className="p-8 w-full h-full flex flex-col items-start gap-6 text-left group hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-all duration-300 border-t-4 border-t-white/80"
                >
                  {card.image ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <div className={`w-14 h-14 ${colorScheme.bg} ${colorScheme.text} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                      {icons[idx % icons.length]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-display font-black text-xl mb-2 text-stone-900 leading-snug tracking-tight group-hover:text-brand-green transition-colors">{card.title}</h3>
                    <p className="text-stone-550 text-sm leading-relaxed font-medium">{card.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

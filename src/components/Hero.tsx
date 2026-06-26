import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import ReactPlayer from 'react-player';
import { Shield, Users, LayoutGrid } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface HeroProps {
  lang: Language;
  onScrollTo: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onScrollTo }) => {
  const t = useContent(lang).hero;

  console.log('Hero t object:', t);
  console.log('Hero backgroundType:', t.backgroundType);
  console.log('Hero heroVideo:', t.heroVideo);

  return (
    <section className="relative min-h-screen flex items-center pt-16 lg:pt-20 overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {t.backgroundType === 'video' ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden bg-black z-0">
            {React.createElement(ReactPlayer as any, {
              url: t.heroVideo,
              playing: true,
              loop: true,
              muted: true,
              playsinline: true,
              width: "100%",
              height: "100%",
              className: "react-player-bg absolute inset-0 w-full h-full opacity-50",
              config: {
                youtube: {
                  playerVars: { 
                    controls: 0, 
                    disablekb: 1, 
                    modestbranding: 1, 
                    rel: 0, 
                    iv_load_policy: 3 
                  }
                } as any
              }
            })}
          </div>
        ) : (
          <img 
            src={t.heroImage} 
            alt="Happy children learning and playing" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream/95 via-brand-cream/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cream/50 to-brand-cream"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4 md:pt-20">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-7xl font-serif font-bold leading-tight mb-4 md:mb-6 text-stone-900"
          >
            {t.headline}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-stone-600 mb-6 md:mb-10 leading-relaxed"
          >
            {t.subheadline}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link to="/enroll" className="btn-secondary text-lg px-8 py-4">{t.enroll}</Link>
            <Link to="/virtual-tour" className="btn-yellow text-lg px-8 py-4">{t.virtualTour}</Link>
          </motion.div>
        </div>

        {/* Highlights Bar */}
        <div className="flex flex-wrap justify-center gap-4">
          {t.highlights.map((item: any, idx: number) => (
            <div key={idx} className="w-full md:w-[calc(33.333%-0.75rem)] min-w-[280px] flex">
              <GlassCard delay={idx * 0.15} className="p-8 flex flex-col items-center text-center w-full">
                {item.image ? (
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl overflow-hidden mb-4">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className={`flex-shrink-0 bg-brand-cream p-3 rounded-2xl mb-4 ${idx % 3 === 0 ? 'text-brand-green' : idx % 3 === 1 ? 'text-brand-orange' : 'text-brand-teal'}`}>
                    {idx % 3 === 0 && <Shield size={24} />}
                    {idx % 3 === 1 && <Users size={24} />}
                    {idx % 3 === 2 && <LayoutGrid size={24} />}
                  </div>
                )}
                <div>
                  <h3 className="font-serif font-bold text-xl mb-1 text-stone-850">{item.title}</h3>
                  <p className="text-stone-650 text-sm">{item.desc}</p>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

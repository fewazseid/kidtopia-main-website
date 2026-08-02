import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import ReactPlayer from 'react-player';
import { Shield, Users, LayoutGrid } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { convertGoogleDriveUrl } from './ImageSelectModal';

interface HeroProps {
  lang: Language;
  onScrollTo: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onScrollTo }) => {
  const t = useContent(lang).hero;

  const hasBgImageOrVideo = (t.backgroundType === 'video' && Boolean(t.heroVideo)) || Boolean(t.heroImage);
  const textColorToUse = hasBgImageOrVideo ? (t.textColor || '#ffffff') : '#1c1917';

  console.log('Hero t object:', t);
  console.log('Hero backgroundType:', t.backgroundType);
  console.log('Hero heroVideo:', t.heroVideo);
  console.log('Hero resolved text color:', textColorToUse);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background decoration with optional video or image */}
      <div className="absolute inset-0 z-0 bg-brand-cream/20">
        {t.backgroundType === 'video' && t.heroVideo ? (
          <div className="absolute inset-0 overflow-hidden">
            <video 
              src={t.heroVideo} 
              className="w-full h-full object-cover"
              autoPlay 
              loop 
              muted 
              playsInline
            />
            {/* Subtle dark overlay for maximum legibility of white text on top of video */}
            {textColorToUse === '#ffffff' && (
              <div className="absolute inset-0 bg-stone-950/40 pointer-events-none" />
            )}
          </div>
        ) : t.heroImage ? (
          <div className="absolute inset-0">
            <img 
              src={convertGoogleDriveUrl(t.heroImage)} 
              alt="Kidtopia Hero background" 
              className="w-full h-full object-cover no-expand"
              referrerPolicy="no-referrer"
            />
            {/* Subtle dark overlay for maximum legibility of white text on top of image */}
            {textColorToUse === '#ffffff' && (
              <div className="absolute inset-0 bg-stone-950/35 pointer-events-none" />
            )}
            {/* Smooth gradient transition to the page's brand-cream background color at the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-brand-cream via-brand-cream/60 to-transparent pointer-events-none" />
          </div>
        ) : null}

        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-brand-yellow/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[40vw] h-[40vw] rounded-full bg-brand-green/5 blur-[140px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-start justify-start text-left">
          
          {/* Content */}
          <div className="max-w-4xl text-left">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-4.5 py-2 rounded-full mb-6 border border-brand-green/10 shadow-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
              </span>
              <span className="text-[9px] sm:text-xs font-black tracking-widest uppercase font-accent" style={{ color: textColorToUse }}>{t.badgeText}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-editorial font-bold leading-[1.08] mb-6 tracking-tight text-left"
              style={{ color: textColorToUse }}
            >
              {(() => {
                const heroTitle = t.headline || t.title || '';
                const titleHighlight = t.titleHighlight || '';
                
                if (titleHighlight && heroTitle.includes(titleHighlight)) {
                  return heroTitle.split(titleHighlight).map((part: string, i: number, arr: string[]) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="underline decoration-brand-yellow decoration-wavy decoration-3 underline-offset-8" style={{ color: textColorToUse }}>
                          {titleHighlight}
                        </span>
                      )}
                    </React.Fragment>
                  ));
                }
                return heroTitle;
              })()}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg md:text-xl mb-10 leading-relaxed font-medium text-left max-w-2xl"
              style={{ color: textColorToUse }}
            >
              {t.subheadline}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row justify-start items-stretch sm:items-center gap-3 sm:gap-4.5 mb-12 w-full max-w-md"
            >
              <Link to="/enroll" className="btn-secondary text-center whitespace-nowrap text-sm sm:text-base font-bold shadow-[0_10px_25px_rgba(200,106,61,0.25)] hover:scale-105 active:scale-95 transition-all py-3.5 px-6">
                {t.enroll}
              </Link>
              <Link to="/virtual-tour" className="btn-glass text-center whitespace-nowrap text-sm sm:text-base font-bold hover:scale-105 active:scale-95 transition-all py-3.5 px-6" style={{ color: textColorToUse }}>
                {t.virtualTour}
              </Link>
            </motion.div>
          </div>

        </div>

        {/* Highlights Bar */}
        <div className="mt-20 lg:mt-28">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest font-accent" style={{ color: textColorToUse, opacity: 0.8 }}>{t.highlightSectionTitle}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {t.highlights.map((item: any, idx: number) => (
              <GlassCard 

                key={idx}
                delay={idx * 0.15} 
                className="p-8 h-full flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5"
              >
                {item.image ? (
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                    <img src={convertGoogleDriveUrl(item.image)} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className={`flex-shrink-0 p-4 rounded-2xl shadow-sm ${
                    idx % 3 === 0 ? 'bg-brand-green/10 text-brand-green' : 
                    idx % 3 === 1 ? 'bg-brand-orange/10 text-brand-orange' : 
                    'bg-brand-teal/10 text-brand-teal'
                  }`}>
                    {idx % 3 === 0 && <Shield size={26} className="stroke-[2.2]" />}
                    {idx % 3 === 1 && <Users size={26} className="stroke-[2.2]" />}
                    {idx % 3 === 2 && <LayoutGrid size={26} className="stroke-[2.2]" />}
                  </div>
                )}
                <div>
                  <h3 className="font-display font-extrabold text-lg text-stone-900 mb-1.5">{item.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

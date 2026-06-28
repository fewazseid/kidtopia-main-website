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
    <section className="relative min-h-screen flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Background decoration with optional image/video */}
      <div className="absolute inset-0 z-0 bg-brand-cream/20">
        {t.backgroundType === 'video' && t.heroVideo ? (
          <div className="absolute inset-0 overflow-hidden">
            <video 
              src={t.heroVideo} 
              className="w-full h-full object-cover opacity-[0.18]"
              autoPlay 
              loop 
              muted 
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/10 via-brand-cream/35 to-brand-cream" />
          </div>
        ) : t.backgroundType === 'image' && t.heroImage ? (
          <div className="absolute inset-0">
            <img 
              src={t.heroImage} 
              alt="Kidtopia background" 
              className="w-full h-full object-cover opacity-[0.18]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/10 via-brand-cream/35 to-brand-cream" />
          </div>
        ) : null}

        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-brand-yellow/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[40vw] h-[40vw] rounded-full bg-brand-green/5 blur-[140px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 text-left">
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
              <span className="text-xs font-black tracking-widest uppercase font-accent">Now Enrolling for 2026</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4.5xl sm:text-6xl lg:text-7xl font-editorial font-bold leading-[1.08] mb-6 text-stone-900 tracking-tight"
            >
              A <span className="text-brand-green underline decoration-brand-yellow decoration-wavy decoration-3 underline-offset-8">Safe, Caring</span>, and Inspiring Space for Your Child.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-stone-650 mb-10 leading-relaxed max-w-2xl font-medium"
            >
              {t.subheadline}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4.5 mb-12"
            >
              <Link to="/enroll" className="btn-secondary text-base font-bold shadow-[0_10px_25px_rgba(200,106,61,0.25)] hover:scale-105 active:scale-95 transition-all">
                {t.enroll}
              </Link>
              <Link to="/virtual-tour" className="btn-yellow text-base font-bold shadow-[0_10px_25px_rgba(229,177,93,0.2)] hover:scale-105 active:scale-95 transition-all">
                {t.virtualTour}
              </Link>
            </motion.div>
          </div>

          {/* Right Visual Collage Column */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] flex items-center justify-center"
            >
              {/* Decorative blobs behind images */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-yellow/25 rounded-full blur-2xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-brand-teal/25 rounded-full blur-3xl -z-10" />
              
              {/* Organic Frame 1 */}
              <div className="absolute top-0 left-6 w-[70%] aspect-[4/5] rounded-[48px] overflow-hidden border-8 border-white shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 group z-10">
                <img 
                  src={t.heroImage || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop"} 
                  alt="Happy children learning and playing" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Organic Frame 2 */}
              <div className="absolute bottom-4 right-2 w-[55%] aspect-[1/1] rounded-[40px] overflow-hidden border-6 border-white shadow-xl rotate-[6deg] hover:rotate-0 transition-transform duration-500 group z-20">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop" 
                  alt="Daycare active play" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Decorative scribble badge */}
              <div className="absolute top-1/3 -right-6 bg-brand-orange text-white p-4.5 rounded-[24px] shadow-xl z-30 rotate-[12deg] max-w-[160px] border border-white/20">
                <span className="text-2xl font-black block mb-0.5 leading-none">★ 4.9</span>
                <span className="text-[11px] font-bold uppercase tracking-wider block opacity-90">Parent Rating in Addis Ababa</span>
              </div>

              {/* Floating trust badge */}
              <div className="absolute bottom-1/3 -left-8 bg-white text-stone-800 py-3.5 px-5 rounded-[24px] shadow-xl z-30 rotate-[-8deg] flex items-center gap-3 border border-stone-100">
                <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <Shield size={18} className="stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <span className="font-extrabold text-stone-900 text-sm block leading-tight">100% Secure</span>
                  <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wide">Doctor Approved</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

        {/* Highlights Bar */}
        <div className="mt-20 lg:mt-28">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-stone-400 font-accent">What makes us special</span>
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
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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

import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Play, Video, Calendar, Shield, Compass } from 'lucide-react';
import { ThreeSixtyViewer } from './ThreeSixtyViewer';

interface VirtualTourProps {
  lang: Language;
}

export const VirtualTour: React.FC<VirtualTourProps> = ({ lang }) => {
  const t = useContent(lang).virtualTour;

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section id="virtual-tour" className="py-24 bg-stone-900 text-white overflow-hidden relative">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-[-10vw] w-[40vw] h-[40vw] rounded-full bg-brand-green/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10vw] w-[40vw] h-[40vw] rounded-full bg-brand-yellow/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-white/10 text-brand-yellow text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <Compass size={14} className="stroke-[2.5] animate-spin" style={{ animationDuration: '10s' }} />
            Interactive 360° Experience
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3.5xl sm:text-5xl font-editorial font-bold text-stone-100 mb-4 tracking-tight leading-tight"
          >
            {t.title}
          </motion.h2>
          <div className="w-16 h-1.5 bg-brand-yellow mx-auto rounded-full mt-2"></div>
        </div>

        {/* Traditional Media Gallery Divider Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-xl sm:text-2xl font-sans font-bold text-stone-200 mb-2">
            Photo Gallery & Highlights
          </h3>
          <p className="text-stone-400 text-sm font-sans">
            Take a look at some of our daycare spaces and happy moments
          </p>
        </div>

        {/* Visual Collage */}
        <div className="relative max-w-4xl mx-auto mb-16 sm:mb-32 h-[320px] xs:h-[400px] sm:h-[450px] md:h-[500px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Decorative blobs behind images */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-yellow/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-brand-green/20 rounded-full blur-3xl -z-10" />
            
            {/* Organic Frame 1 */}
            <div className="absolute top-0 left-0 sm:left-12 w-[65%] sm:w-[55%] aspect-[4/5] rounded-[24px] sm:rounded-[48px] overflow-hidden border-4 sm:border-8 border-white shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 group z-10">
              <img 
                src={t.collageImage1 || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop"} 
                alt="Happy children learning and playing" 
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Organic Frame 2 */}
            <div className="absolute bottom-4 right-0 sm:right-12 w-[55%] sm:w-[45%] aspect-[1/1] rounded-[20px] sm:rounded-[40px] overflow-hidden border-4 sm:border-6 border-white shadow-xl rotate-[6deg] hover:rotate-0 transition-transform duration-500 group z-20">
              <img 
                src={t.collageImage2 || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"} 
                alt="Daycare active play" 
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Decorative scribble badge */}
            <div className="absolute top-1/4 -right-1 sm:-right-8 bg-brand-orange text-white p-3 sm:p-4.5 rounded-[16px] sm:rounded-[24px] shadow-xl z-30 rotate-[12deg] max-w-[110px] sm:max-w-[160px] border border-white/20">
              <span className="text-lg sm:text-2xl font-black block mb-0.5 leading-none">{t.ratingText}</span>
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider block opacity-90">{t.ratingSubtext}</span>
            </div>

            {/* Floating trust badge */}
            <div className="absolute bottom-1/4 -left-2 sm:-left-12 bg-white text-stone-800 py-2.5 px-3.5 sm:py-3.5 sm:px-5 rounded-[16px] sm:rounded-[24px] shadow-xl z-30 rotate-[-8deg] flex items-center gap-2 sm:gap-3 border border-stone-100 max-w-[150px] sm:max-w-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                <Shield size={15} className="sm:size-[18px] stroke-[2.5]" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-stone-900 text-xs sm:text-sm block leading-tight">{t.trustText}</span>
                <span className="text-[8px] sm:text-[10px] font-bold text-stone-400 block uppercase tracking-wide">{t.trustSubtext}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive 360° Virtual Tour Area */}
        <div className="max-w-5xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ThreeSixtyViewer />
          </motion.div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 items-stretch">
            {t.media && t.media.map((item: any, index: number) => {
              const ytId = item.type === 'video' ? getYouTubeId(item.url) : null;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-5 w-full md:w-[calc(50%-1.5rem)] max-w-2xl group"
                >
                  <div className="aspect-video rounded-[32px] overflow-hidden relative shadow-2xl bg-stone-950 border-4 border-stone-800 transition-all duration-500 group-hover:border-brand-green/30">
                    {item.type === 'video' ? (
                      ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          title={`Virtual Tour Video ${index + 1}`}
                          className="w-full h-full border-0 rounded-[28px]"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video 
                          src={item.url || undefined} 
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
                          controls
                        />
                      )
                    ) : (
                      <img 
                        src={item.url || undefined} 
                        alt={`Virtual Tour ${index + 1}`} 
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {item.type === 'image' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                        <div className="w-16 h-16 bg-brand-orange/90 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-350">
                          <Play size={22} fill="white" className="stroke-none" />
                        </div>
                      </div>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-stone-350 text-center text-base font-medium px-4 leading-relaxed group-hover:text-stone-200 transition-colors">
                      {item.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-5">
            <button className="btn-primary px-10 py-4.5 text-base font-black tracking-wider uppercase hover:scale-105 active:scale-95 duration-350 shadow-lg">{t.watchFull}</button>
            <Link 
              to="/book-tour" 
              className="btn-yellow px-10 py-4.5 text-base font-black tracking-wider uppercase inline-flex items-center justify-center gap-2 hover:scale-105 active:scale-95 duration-350 shadow-lg shadow-brand-yellow/10"
            >
              <Calendar size={16} className="stroke-[2.5]" />
              {t.schedule}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

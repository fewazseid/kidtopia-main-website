import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Play, Video, Calendar } from 'lucide-react';

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
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-white/10 text-brand-yellow text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <Video size={14} className="stroke-[2.5]" />
            Take a Look Inside
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

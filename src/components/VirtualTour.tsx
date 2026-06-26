import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

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
    <section id="virtual-tour" className="py-24 bg-stone-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            {t.title}
          </motion.h2>
          <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 items-stretch">
            {t.media && t.media.map((item: any, index: number) => {
              const ytId = item.type === 'video' ? getYouTubeId(item.url) : null;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-4 w-full md:w-[calc(50%-1rem)] max-w-2xl"
                >
                  <div className="aspect-video rounded-[30px] overflow-hidden relative group cursor-pointer shadow-2xl">
                    {item.type === 'video' ? (
                      ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          title={`Virtual Tour Video ${index + 1}`}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video 
                          src={item.url || undefined} 
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                          controls
                        />
                      )
                    ) : (
                      <img 
                        src={item.url || undefined} 
                        alt={`Virtual Tour ${index + 1}`} 
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {item.type === 'image' && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-brand-orange/80 rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                          <Play size={24} fill="white" />
                        </div>
                      </div>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-stone-300 text-center text-lg px-4">
                      {item.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6">
            <button className="btn-primary px-10 py-4 text-lg">{t.watchFull}</button>
            <Link to="/book-tour" className="btn-yellow px-10 py-4 text-lg inline-flex items-center justify-center">
              {t.schedule}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

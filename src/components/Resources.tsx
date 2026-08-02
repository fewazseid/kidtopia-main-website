import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { BookOpen, Download, FileText, Sparkles, GraduationCap, User, CheckSquare } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ParentalResourceDetails } from './ParentalResourceDetails';

interface ResourcesProps {
  lang: Language;
}

export const Resources: React.FC<ResourcesProps> = ({ lang }) => {
  const t = useContent(lang).resources;
  const [activeActionType, setActiveActionType] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const actionParam = searchParams.get('action');

  useEffect(() => {
    if (actionParam) {
      setActiveActionType(actionParam);
    }
  }, [actionParam]);
  
  const icons = [
    <BookOpen className="w-6 h-6 text-brand-teal" />,
    <FileText className="w-6 h-6 text-brand-orange" />,
    <Sparkles className="w-6 h-6 text-brand-yellow" />,
    <Download className="w-6 h-6 text-brand-green" />,
    <User className="w-6 h-6 text-brand-teal" />,
    <CheckSquare className="w-6 h-6 text-brand-orange" />
  ];

  return (
    <section id="resources" className="py-24 bg-transparent overflow-hidden relative">
      {/* Decorative vector overlays */}
      <div className="absolute top-1/2 left-[-10%] w-[350px] h-[350px] rounded-full bg-brand-green/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-teal/10 text-brand-teal text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <GraduationCap size={14} className="stroke-[2.5]" />
            {t.title}
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
          <div className="w-16 h-1.5 bg-brand-teal mx-auto rounded-full mt-2 mb-6"></div>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-stone-550 font-medium leading-relaxed text-sm sm:text-base"
          >
            {t.desc}
          </motion.p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {t.items.map((resource: any, idx: number) => (
            <motion.div 
              key={idx} 
              className="flex h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard
                delay={0}
                className="rounded-[28px] p-7 h-full flex flex-col justify-between group w-full text-left hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-350 cursor-pointer"
                onClick={() => {
                  if (resource.actionType) {
                    if (resource.actionType === 'url' && resource.link) {
                      window.location.href = resource.link;
                    } else {
                      setActiveActionType(resource.actionType);
                    }
                  }
                }}
              >
                <div>
                  {/* Icon Frame */}
                  <div className="mb-6">
                    {resource.image ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-stone-200/20">
                        <img src={resource.image} alt={resource.title} className="w-full h-full object-cover scale-102 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-white/80 border border-white/60 rounded-2xl flex items-center justify-center shadow-[0_4px_15px_-4px_rgba(0,0,0,0.03)] group-hover:scale-110 transition-transform">
                        {icons[idx % icons.length]}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-editorial font-bold text-stone-900 mb-2 leading-tight tracking-tight group-hover:text-brand-green transition-colors duration-300">
                    {resource.title}
                  </h3>
                  <p className="text-stone-550 text-sm font-medium mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-brand-green bg-brand-green/10 px-3.5 py-1.5 rounded-full inline-block font-accent border border-brand-green/5">
                    {resource.type}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {activeActionType && (
          <ParentalResourceDetails 
            actionType={activeActionType} 
            onClose={() => {
              setActiveActionType(null);
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('action');
              setSearchParams(newParams);
            }} 
            lang={lang === 'en' || lang === 'am' ? lang : 'en'} 
          />
        )}

      </div>
    </section>
  );
};

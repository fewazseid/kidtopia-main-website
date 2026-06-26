import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { BookOpen, Download, FileText, Video } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ResourcesProps {
  lang: Language;
}

export const Resources: React.FC<ResourcesProps> = ({ lang }) => {
  const t = useContent(lang).resources;
  
  const icons = [
    <BookOpen className="w-8 h-8 text-brand-teal" />,
    <FileText className="w-8 h-8 text-brand-orange" />,
    <Video className="w-8 h-8 text-brand-yellow" />,
    <Download className="w-8 h-8 text-brand-green" />
  ];

  return (
    <section id="resources" className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6"
          >
            {t.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg text-stone-600"
          >
            {t.desc}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 items-stretch">
          {t.items.map((resource: any, idx: number) => (
            <div key={idx} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] flex h-full">
              <GlassCard
                delay={idx * 0.15}
                className="rounded-3xl p-8 h-full flex flex-row items-center gap-5 group w-full text-left"
              >
                {resource.image ? (
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                    <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform text-brand-green">
                    {icons[idx % icons.length]}
                  </div>
                )}
                <div className="flex flex-col h-full justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2 leading-tight">{resource.title}</h3>
                    <p className="text-stone-600 text-sm mb-4 leading-relaxed">{resource.description}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-brand-green bg-brand-green/10 px-3 py-1.5 rounded-full inline-block">
                      {resource.type}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

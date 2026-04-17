import React from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { BookOpen, Download, FileText, Video } from 'lucide-react';

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
    <section id="resources" className="py-24 bg-brand-cream overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.items.map((resource: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: idx * 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col items-center text-center group cursor-pointer"
            >
              {resource.image ? (
                <div className="w-full h-32 rounded-2xl overflow-hidden mb-6">
                  <img src={resource.image} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {icons[idx % icons.length]}
                </div>
              )}
              <h3 className="text-xl font-bold text-stone-900 mb-3">{resource.title}</h3>
              <p className="text-stone-600 mb-6 flex-grow">{resource.description}</p>
              <span className="text-sm font-medium text-brand-green bg-brand-green/10 px-4 py-1.5 rounded-full">
                {resource.type}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

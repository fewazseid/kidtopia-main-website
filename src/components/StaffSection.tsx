import React from 'react';
import { Language, translations } from '../translations';
import { motion } from 'motion/react';

interface StaffSectionProps {
  lang: Language;
}

export const StaffSection: React.FC<StaffSectionProps> = ({ lang }) => {
  const t = translations[lang].staff;

  const images = [
    'https://picsum.photos/seed/nurse-faeza/600/800',
    'https://picsum.photos/seed/teacher-mekdes/600/800',
    'https://picsum.photos/seed/caregiver-hayat/600/800',
    'https://picsum.photos/seed/educator-alemitu/600/800'
  ];

  return (
    <section id="staff" className="py-24 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            {t.title}
          </motion.h2>
          <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.members.map((member: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6 shadow-lg">
                <img 
                  src={images[idx]} 
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white text-sm italic">{member.desc}</p>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">{member.name}</h3>
                <p className="text-brand-green font-medium text-sm uppercase tracking-wider">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

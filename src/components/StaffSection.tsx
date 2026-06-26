import React, { useState } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StaffSectionProps {
  lang: Language;
}

export const StaffSection: React.FC<StaffSectionProps> = ({ lang }) => {
  const t = useContent(lang).staff;
  const [showAll, setShowAll] = useState(false);

  const displayedMembers = showAll ? t.members : t.members.slice(0, 4);

  return (
    <section id="staff" className="py-24 bg-transparent scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4"
          >
            {t.title}
          </motion.h2>
          <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {displayedMembers.map((member: any, idx: number) => (
              <motion.div
                key={member.name + idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl mb-6 shadow-lg">
                  {member.image && (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  )}
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
          </AnimatePresence>
        </div>

        {t.members.length > 4 && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white rounded-full font-bold hover:bg-brand-orange transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {showAll ? t.showLess : t.seeMore}
              {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

import React from 'react';
import { Language, translations } from '../translations';
import { motion } from 'motion/react';
import { BookOpen, Download, FileText, Video } from 'lucide-react';

interface ResourcesProps {
  lang: Language;
}

export const Resources: React.FC<ResourcesProps> = ({ lang }) => {
  const t = translations[lang].nav; // Using nav translation for title fallback if needed
  
  const resources = [
    {
      title: "Parent Handbook",
      description: "Everything you need to know about our policies, daily schedules, and what to expect.",
      icon: <BookOpen className="w-8 h-8 text-brand-teal" />,
      type: "PDF Document"
    },
    {
      title: "Enrollment Forms",
      description: "Download and print the necessary forms to begin the enrollment process.",
      icon: <FileText className="w-8 h-8 text-brand-orange" />,
      type: "PDF Forms"
    },
    {
      title: "Educational Activities",
      description: "Fun and educational activities you can do with your child at home.",
      icon: <Video className="w-8 h-8 text-brand-yellow" />,
      type: "Video Series"
    },
    {
      title: "Nutrition Guide",
      description: "Learn about our healthy meal plans and get tips for nutritious eating at home.",
      icon: <Download className="w-8 h-8 text-brand-green" />,
      type: "Guide"
    }
  ];

  return (
    <section id="resources" className="py-24 bg-brand-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6"
          >
            {lang === 'en' ? 'Parent Resources' : 'የወላጅ መርጃዎች'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-stone-600"
          >
            {lang === 'en' 
              ? 'Helpful materials and guides to support you and your child\'s journey with us.' 
              : 'እርስዎን እና የልጅዎን ጉዞ ከእኛ ጋር ለመደገፍ አጋዥ ቁሳቁሶች እና መመሪያዎች።'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((resource, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {resource.icon}
              </div>
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

import React from 'react';
import { Language, translations } from '../translations';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const t = translations[lang].testimonials;

  return (
    <section id="testimonials" className="py-24 bg-brand-warm-white">
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

        <div className="max-w-4xl mx-auto">
          {t.list.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 2.4, delay: idx * 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="card-rounded p-12 relative text-center"
            >
              <Quote className="absolute top-8 left-8 text-brand-green/10" size={80} />
              
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="#DDA74F" className="text-brand-yellow" />
                ))}
              </div>
              
              <p className="text-2xl font-serif italic text-stone-700 mb-8 leading-relaxed">
                "{item.text}"
              </p>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-brand-cream mb-4 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop" alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <h4 className="font-bold text-stone-900">{item.name}</h4>
                <span className="text-stone-500 text-sm">Kidtopia Parent</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

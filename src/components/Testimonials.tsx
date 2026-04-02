import React, { useState, useEffect } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const t = useContent(lang).testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = (manual = false) => {
    if (manual) setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % t.list.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + t.list.length) % t.list.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => next(false), 8000);
    return () => clearInterval(timer);
  }, [t.list.length, isAutoPlaying]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const item = t.list[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-brand-warm-white overflow-hidden">
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

        <div className="max-w-4xl mx-auto relative px-12">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div 
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="card-rounded p-8 md:p-12 relative text-center bg-white shadow-sm"
            >
              <Quote className="absolute top-8 left-8 text-brand-green/10" size={80} />
              
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(Math.max(0, Math.min(5, Number(item.rating) || 0)))].map((_, i) => (
                  <Star key={i} size={20} fill="#DDA74F" className="text-brand-yellow" />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl font-serif italic text-stone-700 mb-8 leading-relaxed">
                "{item.text}"
              </p>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-brand-cream mb-4 overflow-hidden border-2 border-brand-green/20">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <h4 className="font-bold text-stone-900">{item.name}</h4>
                <span className="text-stone-500 text-sm">{item.workInfo || 'Kidtopia Parent'}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {t.list.length > 1 && (
            <>
              <button 
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md text-stone-400 hover:text-brand-green transition-colors z-10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => next(true)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md text-stone-400 hover:text-brand-green transition-colors z-10"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="flex justify-center gap-2 mt-8">
            {t.list.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-brand-green' : 'bg-stone-300'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

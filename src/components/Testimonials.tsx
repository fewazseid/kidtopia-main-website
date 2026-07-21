import React, { useState, useEffect } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight, Heart, ChevronDown, ChevronUp } from 'lucide-react';

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const t = useContent(lang).testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset index if list changes and current index is out of bounds
  useEffect(() => {
    if (t.list && currentIndex >= t.list.length) {
      setCurrentIndex(0);
    }
  }, [t.list?.length]);

  // Reset expanded state when changing cards
  useEffect(() => {
    setIsExpanded(false);
  }, [currentIndex]);

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
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  if (!t.list || t.list.length === 0) return null;

  const item = t.list[currentIndex];

  if (!item) return null;

  // Check text length for truncation (limit to 150 characters)
  const isLongText = item.text && item.text.length > 150;

  return (
    <section id="testimonials" className="py-24 bg-brand-cream/40 overflow-hidden relative">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-[-10vw] w-[40vw] h-[40vw] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10vw] w-[30vw] h-[30vw] rounded-full bg-brand-green/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <Heart size={14} className="stroke-[2.5]" />
            What Parents Say
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
          <div className="w-16 h-1.5 bg-brand-green mx-auto rounded-full mt-2"></div>
        </div>

        <div className="max-w-4xl mx-auto relative px-4 sm:px-12 md:px-20">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div 
              layout
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(e, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  next(true);
                } else if (info.offset.x > swipeThreshold) {
                  prev();
                }
              }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                x: { type: "spring", stiffness: 300, damping: 30 }
              }}
              className="card-rounded p-8 sm:p-12 md:p-16 relative text-center shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] border-t-8 border-t-brand-green/90 cursor-grab active:cursor-grabbing select-none bg-white touch-pan-y"
            >
              <Quote className="absolute top-6 left-6 sm:top-10 sm:left-10 text-brand-green/10 stroke-[2.5]" size={80} />
              
              <div className="flex justify-center space-x-1.5 mb-6">
                {[...Array(Math.max(0, Math.min(5, Number(item.rating) || 0)))].map((_, i) => (
                  <Star key={i} size={22} fill="#E5B15D" className="text-brand-yellow stroke-[1.5]" />
                ))}
              </div>
              
              {/* Testimonial message - beautifully limited/expandable */}
              <div className="overflow-hidden w-full relative mb-8">
                <motion.p 
                  layout="position"
                  className="text-lg sm:text-xl md:text-2xl font-editorial font-bold italic text-stone-700 leading-relaxed max-w-2xl mx-auto"
                >
                  "{isLongText && !isExpanded ? `${item.text.slice(0, 150)}...` : item.text}"
                </motion.p>

                {isLongText && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    className="mt-4 px-4 py-1.5 rounded-full bg-brand-green/10 hover:bg-brand-green/20 text-brand-green font-bold text-xs sm:text-sm transition duration-200 cursor-pointer flex items-center gap-1.5 mx-auto group/btn"
                  >
                    <span>{isExpanded ? (lang === 'am' ? 'ያንስ' : 'Show Less') : (lang === 'am' ? 'ተጨማሪ ያንብቡ' : 'Read More')}</span>
                    {isExpanded ? (
                      <ChevronUp size={14} className="group-hover/btn:-translate-y-0.5 transition-transform stroke-[2.5]" />
                    ) : (
                      <ChevronDown size={14} className="group-hover/btn:translate-y-0.5 transition-transform stroke-[2.5]" />
                    )}
                  </button>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-stone-150 mb-4 overflow-hidden border-4 border-white shadow-md pointer-events-none">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover no-expand" referrerPolicy="no-referrer" />
                  )}
                </div>
                <h4 className="font-display font-black text-lg text-stone-900 mb-0.5">{item.name}</h4>
                <span className="text-stone-400 text-xs font-bold uppercase tracking-widest font-accent">{item.workInfo || 'Kidtopia Parent'}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {t.list.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 sm:px-0 hidden sm:flex">
              <button 
                onClick={prev}
                className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-md text-stone-500 hover:text-brand-green hover:bg-white transition-all flex items-center justify-center border border-stone-100 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} className="stroke-[2.5]" />
              </button>
              <button 
                onClick={() => next(true)}
                className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-md text-stone-500 hover:text-brand-green hover:bg-white transition-all flex items-center justify-center border border-stone-100 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} className="stroke-[2.5]" />
              </button>
            </div>
          )}

          {/* Progress Indicator Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {t.list.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-350 cursor-pointer ${
                  idx === currentIndex ? 'w-8 bg-brand-green' : 'bg-stone-300/80 hover:bg-stone-400'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mobile Drag hint text */}
          <p className="text-center text-[10px] text-stone-400 font-sans mt-4 sm:hidden">
            {lang === 'am' ? 'ካርዱን ወደ ግራ ወይም ቀኝ በመሳብ ማለፍ ይችላሉ' : 'Swipe left or right to browse testimonials'}
          </p>
        </div>
      </div>
    </section>
  );
};

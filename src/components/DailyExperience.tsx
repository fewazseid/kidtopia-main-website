import React, { useState } from 'react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { Clock, Baby, Sparkles, Smile, School, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface DailyExperienceProps {
  lang: Language;
}

export const DailyExperience: React.FC<DailyExperienceProps> = ({ lang }) => {
  const content = useContent(lang);
  const t = content.dailyExperience || {};

  const schedules = t.schedules && t.schedules.length > 0 
    ? t.schedules 
    : [
        {
          id: 'default',
          name: lang === 'am' ? 'አጠቃላይ መርሃግብር' : 'General Schedule',
          nameAm: 'አጠቃላይ መርሃግብር',
          ageRange: lang === 'am' ? 'ሁሉም የዕድሜ ክልሎች' : 'All Ages',
          ageRangeAm: 'ሁሉም የዕድሜ ክልሎች',
          description: lang === 'am' ? 'በኪድቶፒያ የየዕለት ትምህርት እና እንክብካቤ እንቅስቃሴዎች።' : 'Daily routine and care activities at Kidtopia.',
          descriptionAm: 'በኪድቶፒያ የየዕለት ትምህርት እና እንክብካቤ እንቅስቃሴዎች።',
          timeline: t.timeline || []
        }
      ];

  const [activeScheduleId, setActiveScheduleId] = useState<string>(schedules[0]?.id || 'default');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Find active schedule or fallback to first
  const activeSchedule = schedules.find((s: any) => s.id === activeScheduleId) || schedules[0];

  const handleSelectSchedule = (id: string) => {
    setActiveScheduleId(id);
    setIsExpanded(false);
  };

  const fullTimeline = activeSchedule?.timeline || [];
  const hasMoreThanFive = fullTimeline.length > 5;
  const visibleTimeline = (!isExpanded && hasMoreThanFive) 
    ? fullTimeline.slice(0, 5) 
    : fullTimeline;

  const getScheduleIcon = (id: string, index: number) => {
    const lower = id.toLowerCase();
    if (lower.includes('infant') || lower.includes('baby')) return <Baby size={18} />;
    if (lower.includes('toddler')) return <Smile size={18} />;
    if (lower.includes('preschool') || lower.includes('school')) return <School size={18} />;
    if (index === 0) return <Baby size={18} />;
    if (index === 1) return <Smile size={18} />;
    return <Sparkles size={18} />;
  };

  return (
    <section className="py-24 bg-transparent overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-1/3 left-10 w-2 h-2 rounded-full bg-brand-teal/40 animate-ping pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-2.5 h-2.5 rounded-full bg-brand-orange/40 animate-ping pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <Clock size={14} className="stroke-[2.5]" />
            {lang === 'am' ? 'በኪድቶፒያ አንድ ቀን' : 'A Day in the Life'}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3.5xl sm:text-5xl font-editorial font-bold text-stone-900 mb-4 tracking-tight leading-tight"
          >
            {t.title || (lang === 'am' ? 'አንድ ቀን በኪድቶፒያ' : 'A Day at Kidtopia')}
          </motion.h2>
          
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {t.subtitle || (lang === 'am' 
              ? 'ለእያንዳንዱ የዕድሜ ክልል ታስበው የተዘጋጁ የቀን መርሃግብሮች' 
              : 'Explore tailored daily schedules designed specifically for each developmental age group.')}
          </p>
          <div className="w-16 h-1.5 bg-brand-orange mx-auto rounded-full mt-4"></div>
        </div>

        {/* Age Group Selector Tabs */}
        {schedules.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-3 mb-12">
            {schedules.map((sched: any, idx: number) => {
              const isActive = sched.id === activeScheduleId;
              const schedName = lang === 'am' ? (sched.nameAm || sched.name) : (sched.name || sched.nameAm);
              const ageRange = lang === 'am' ? (sched.ageRangeAm || sched.ageRange) : (sched.ageRange || sched.ageRangeAm);

              return (
                <button
                  key={sched.id || idx}
                  onClick={() => handleSelectSchedule(sched.id)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2.5 border cursor-pointer ${
                    isActive
                      ? 'bg-brand-green text-white border-brand-green shadow-lg shadow-brand-green/25 scale-105 font-black'
                      : 'bg-white/80 hover:bg-white text-stone-700 border-stone-200/80 shadow-sm hover:shadow-md hover:border-brand-green/30'
                  }`}
                >
                  <span className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-brand-green'}`}>
                    {getScheduleIcon(sched.id, idx)}
                  </span>
                  <div className="text-left">
                    <div className="leading-tight font-black">{schedName}</div>
                    {ageRange && (
                      <div className={`text-[10px] font-semibold opacity-90 ${isActive ? 'text-white/90' : 'text-stone-500'}`}>
                        {ageRange}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Age Group Overview Card */}
        {activeSchedule && (
          <motion.div
            key={`overview-${activeSchedule.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm max-w-3xl mx-auto mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-green/10 text-brand-green text-xs font-black rounded-full mb-3 uppercase tracking-wider">
              <Users size={14} />
              <span>{lang === 'am' ? (activeSchedule.nameAm || activeSchedule.name) : activeSchedule.name}</span>
              {(activeSchedule.ageRange || activeSchedule.ageRangeAm) && (
                <span className="opacity-70">• {lang === 'am' ? (activeSchedule.ageRangeAm || activeSchedule.ageRange) : activeSchedule.ageRange}</span>
              )}
            </div>
            
            {(activeSchedule.description || activeSchedule.descriptionAm) && (
              <p className="text-stone-700 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
                {lang === 'am' ? (activeSchedule.descriptionAm || activeSchedule.description) : activeSchedule.description}
              </p>
            )}
          </motion.div>
        )}

        {/* Schedule Timeline */}
        <div className="relative">
          {/* Vertical Gradient Line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-brand-orange/30 via-brand-green/30 to-brand-teal/30 rounded-full -translate-x-1/2 hidden md:block"></div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={`timeline-${activeSchedule?.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 sm:space-y-12"
            >
              {visibleTimeline && visibleTimeline.length > 0 ? (
                visibleTimeline.map((item: any, idx: number) => {
                  const activityText = lang === 'am' ? (item.activityAm || item.activity) : item.activity;
                  const timeText = item.time;

                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: idx * 0.04 }}
                      className={`flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                      {/* Timeline Card Container */}
                      <div className="w-full md:w-1/2 flex justify-center md:justify-start px-2 sm:px-8">
                        <GlassCard 
                          className={`p-5 sm:p-7 w-full max-w-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-all duration-300 border-t-4 ${
                            idx % 3 === 0 ? 'border-t-brand-orange/85' : 
                            idx % 3 === 1 ? 'border-t-brand-green/85' : 
                            'border-t-brand-teal/85'
                          } ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                          delay={0}
                        >
                          <div className={`flex items-center gap-2 mb-3 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                            <span className={`px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${
                              idx % 3 === 0 ? 'bg-brand-orange/10 text-brand-orange' : 
                              idx % 3 === 1 ? 'bg-brand-green/10 text-brand-green' : 
                              'bg-brand-teal/10 text-brand-teal'
                            }`}>
                              <Clock size={13} />
                              {timeText}
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-editorial font-bold text-stone-900 tracking-tight leading-snug">
                            {activityText}
                          </h3>
                        </GlassCard>
                      </div>
                      
                      {/* Step Circle Pin */}
                      <div className="relative my-4 md:my-0">
                        <div className={`w-11 h-11 rounded-full border-4 border-white shadow-xl z-15 flex items-center justify-center text-white font-black text-sm relative ${
                          idx % 3 === 0 ? 'bg-brand-orange' : 
                          idx % 3 === 1 ? 'bg-brand-green' : 
                          'bg-brand-teal'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`absolute -inset-1.5 rounded-full -z-10 animate-ping opacity-20 ${
                          idx % 3 === 0 ? 'bg-brand-orange' : 
                          idx % 3 === 1 ? 'bg-brand-green' : 
                          'bg-brand-teal'
                        }`} style={{ animationDuration: '3s' }}></span>
                      </div>
                      
                      <div className="md:w-1/2 hidden md:block"></div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center p-8 bg-white rounded-3xl border border-stone-200 text-stone-500 font-medium">
                  {lang === 'am' ? 'ለዚህ ክፍል ምንም የመርሃግብር ዝርዝር አልተገኘም።' : 'No schedule entries found for this class.'}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Sticky Expand / Collapse Button */}
          {hasMoreThanFive && (
            <div className="sticky bottom-6 z-30 flex justify-center mt-8 pt-4 pointer-events-none">
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="pointer-events-auto px-6 py-3.5 bg-brand-green text-white rounded-full font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-brand-green/30 border-2 border-white/90 flex items-center gap-2.5 backdrop-blur-md cursor-pointer hover:bg-brand-green/95 transition-all"
              >
                <span>
                  {isExpanded 
                    ? (lang === 'am' ? 'አነስ አድርግ (ዝጋ)' : 'Show Less') 
                    : (lang === 'am' ? `ሙሉ መርሃግብር አሳይ (+${fullTimeline.length - 5} ተጨማሪ)` : `Show Full Schedule (+${fullTimeline.length - 5} More)`)}
                </span>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </motion.button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};



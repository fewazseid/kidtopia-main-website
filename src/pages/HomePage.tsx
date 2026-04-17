import React from 'react';
import { Hero } from '../components/Hero';
import { Announcement } from '../components/Announcement';
import { TrustSafety } from '../components/TrustSafety';
import { Programs } from '../components/Programs';
import { WhyChoose } from '../components/WhyChoose';
import { StaffSection } from '../components/StaffSection';
import { VirtualTour } from '../components/VirtualTour';
import { DailyExperience } from '../components/DailyExperience';
import { Resources } from '../components/Resources';
import { Testimonials } from '../components/Testimonials';
import { CTASection } from '../components/CTASection';
import { Language } from '../translations';
import { motion } from 'motion/react';

interface HomePageProps {
  lang: Language;
  onScrollTo: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ lang, onScrollTo }) => {
  return (
    <main>
      <Hero lang={lang} onScrollTo={onScrollTo} />
      <Announcement lang={lang} />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
      >
        <TrustSafety lang={lang} />
      </motion.div>

      <Programs lang={lang} />
      
      <WhyChoose lang={lang} />

      <StaffSection lang={lang} />
      
      <VirtualTour lang={lang} />
      
      <DailyExperience lang={lang} />

      <Resources lang={lang} />
      
      <Testimonials lang={lang} />
      
      <CTASection lang={lang} />
    </main>
  );
};

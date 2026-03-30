import React from 'react';
import { TrustSafety } from '../components/TrustSafety';
import { WhyChoose } from '../components/WhyChoose';
import { DailyExperience } from '../components/DailyExperience';
import { Language } from '../translations';

interface AboutPageProps {
  lang: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  return (
    <main className="pt-24">
      <TrustSafety lang={lang} />
      <WhyChoose lang={lang} />
      <DailyExperience lang={lang} />
    </main>
  );
};

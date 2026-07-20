import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TrustSafety } from '../components/TrustSafety';
import { WhyChoose } from '../components/WhyChoose';
import { SoftwareShowcase } from '../components/SoftwareShowcase';
import { DailyExperience } from '../components/DailyExperience';
import { StaffSection } from '../components/StaffSection';
import { Language } from '../translations';

interface AboutPageProps {
  lang: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <main className="pt-24">
      <div id="company">
        <TrustSafety lang={lang} />
        <WhyChoose lang={lang} />
        <SoftwareShowcase lang={lang} />
      </div>
      <StaffSection lang={lang} />
      <DailyExperience lang={lang} />
    </main>
  );
};

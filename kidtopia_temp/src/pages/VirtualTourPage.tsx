import React from 'react';
import { VirtualTour } from '../components/VirtualTour';
import { Language } from '../translations';

interface VirtualTourPageProps {
  lang: Language;
}

export const VirtualTourPage: React.FC<VirtualTourPageProps> = ({ lang }) => {
  return (
    <main className="pt-24">
      <VirtualTour lang={lang} />
    </main>
  );
};

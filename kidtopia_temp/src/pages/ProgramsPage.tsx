import React from 'react';
import { Programs } from '../components/Programs';
import { Language } from '../translations';

interface ProgramsPageProps {
  lang: Language;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ lang }) => {
  return (
    <main className="pt-24">
      <Programs lang={lang} />
    </main>
  );
};

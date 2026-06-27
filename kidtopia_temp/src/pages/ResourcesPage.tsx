import React from 'react';
import { Resources } from '../components/Resources';
import { Language } from '../translations';

interface ResourcesPageProps {
  lang: Language;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ lang }) => {
  return (
    <main className="pt-24">
      <Resources lang={lang} />
    </main>
  );
};

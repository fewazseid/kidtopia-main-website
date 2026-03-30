import React from 'react';
import { CTASection } from '../components/CTASection';
import { Language } from '../translations';

interface ContactPageProps {
  lang: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang }) => {
  return (
    <main className="pt-24">
      <CTASection lang={lang} />
    </main>
  );
};

import React from 'react';
import { Testimonials } from '../components/Testimonials';
import { Language } from '../translations';

interface TestimonialsPageProps {
  lang: Language;
}

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ lang }) => {
  return (
    <main className="pt-24">
      <Testimonials lang={lang} />
    </main>
  );
};

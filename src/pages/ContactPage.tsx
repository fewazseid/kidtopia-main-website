import React from 'react';
import { CTASection } from '../components/CTASection';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface ContactPageProps {
  lang: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang }) => {
  const t = useContent(lang).footer;
  const nav = useContent(lang).nav;

  return (
    <main className="pt-24">
      <section className="py-20 bg-brand-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-4"
            >
              {nav.contact}
            </motion.h1>
            <div className="w-24 h-1 bg-brand-green mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-full bg-brand-yellow/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="text-brand-yellow" size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">Phone</h3>
              <div className="space-y-2">
                {t.phones && t.phones.map((ph: string, idx: number) => (
                  <motion.a 
                    key={idx}
                    href={`tel:${ph.replace(/\s+/g, '')}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="block text-stone-600 hover:text-brand-orange transition-colors"
                  >
                    {ph}
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-full bg-brand-teal/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="text-brand-teal" size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">Email</h3>
              <div className="space-y-2">
                {t.emails && t.emails.map((em: string, idx: number) => (
                  <motion.a 
                    key={idx}
                    href={`mailto:${em}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="block text-stone-600 hover:text-brand-orange transition-colors"
                  >
                    {em}
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="text-brand-orange" size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">Location</h3>
              <div className="space-y-2">
                {t.addresses && t.addresses.map((addr: string, idx: number) => (
                  <motion.a 
                    key={idx}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="block text-stone-600 hover:text-brand-orange transition-colors"
                  >
                    {addr}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTASection lang={lang} />
    </main>
  );
};

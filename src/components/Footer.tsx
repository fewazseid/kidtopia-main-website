import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Music2 } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const content = useContent(lang);
  const t = content.footer;
  const nav = content.nav;

  return (
    <footer id="footer" className="bg-stone-900 text-stone-400 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Contact */}
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-6">{t.contact}</h3>
            <div className="space-y-4">
              {t.addresses && t.addresses.map((addr: any, idx: number) => (
                <a 
                  key={idx}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(typeof addr === 'string' ? addr : (addr.googleMapsCoordinates || addr.locationName))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-3 hover:text-white transition-colors group"
                >
                  <MapPin size={18} className="shrink-0 mt-1 text-brand-orange group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{typeof addr === 'string' ? addr : addr.locationName}</span>
                </a>
              ))}
              {t.phones && t.phones.map((ph: string, idx: number) => (
                <a 
                  key={idx}
                  href={`tel:${ph.replace(/\s+/g, '')}`}
                  className="flex items-center space-x-3 hover:text-white transition-colors group"
                >
                  <Phone size={18} className="shrink-0 text-brand-yellow group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{ph}</span>
                </a>
              ))}
              {t.emails && t.emails.map((em: string, idx: number) => (
                <a 
                  key={idx}
                  href={`mailto:${em}`}
                  className="flex items-center space-x-3 hover:text-white transition-colors group"
                >
                  <Mail size={18} className="shrink-0 text-brand-teal group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{em}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-6">{t.links}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm hover:text-white transition-colors">{nav.about}</Link></li>
              <li><Link to="/programs" className="text-sm hover:text-white transition-colors">{nav.programs}</Link></li>
              <li><Link to="/virtual-tour" className="text-sm hover:text-white transition-colors">{nav.virtualTour}</Link></li>
              <li><Link to="/enroll" className="text-sm hover:text-white transition-colors">{nav.enrollNow}</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">{nav.contact}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-6">{content.nav.parentResources || t.resources}</h3>
            <ul className="space-y-3">
              <li><button className="text-sm hover:text-white transition-colors">Parent Guidelines</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Health Policy</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Terms and Conditions</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-6">{content.nav.socialMedia || 'Social Media'}</h3>
            <div className="flex flex-wrap gap-4">
              {t.social.facebook && (
                <a href={t.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
                  <Facebook size={20} />
                </a>
              )}
              {t.social.instagram && (
                <a href={t.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
                  <Instagram size={20} />
                </a>
              )}
              {t.social.youtube && (
                <a href={t.social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
                  <Youtube size={20} />
                </a>
              )}
              {t.social.tiktok && (
                <a href={t.social.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
                  <Music2 size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col justify-center mb-4 md:mb-0 group">
            <div className="font-sans font-bold text-2xl tracking-tighter flex">
              {['K','I','D','T','O','P','I','A'].map((letter, i) => {
                const colors = ['text-brand-orange', 'text-brand-yellow', 'text-brand-green', 'text-brand-teal', 'text-brand-tan', 'text-brand-orange', 'text-brand-yellow', 'text-brand-green'];
                return (
                  <motion.span 
                    key={i}
                    className={colors[i]}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  >
                    {letter}
                  </motion.span>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-xs opacity-50 mb-1">© 2026 Kidtopia International Daycare and Preschool. All rights reserved.</p>
            <a 
              href="https://arhotechnology.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => console.log('Arho Technology link clicked')}
              className="text-[10px] opacity-50 hover:opacity-100 hover:text-brand-orange transition-all cursor-pointer inline-block py-1 px-2 -mx-2"
            >
              Developed by Arho Technology
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Music2, ExternalLink } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const content = useContent(lang);
  const t = content.footer;
  const nav = content.nav;

  const [selectedBranchIdx, setSelectedBranchIdx] = useState(0);

  return (
    <footer id="footer" className="bg-gradient-to-b from-stone-900 to-stone-950 text-stone-400 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Contact */}
          <div>
            <h3 className="font-display font-black uppercase text-xs tracking-widest text-stone-200 mb-6 pb-2 border-b border-white/10 inline-block">
              {t.contact}
            </h3>
            <div className="space-y-4.5">
              {t.addresses && t.addresses.map((addr: any, idx: number) => {
                const locationStr = typeof addr === 'string' ? addr : addr.locationName;
                return (
                  <div key={idx} className="flex items-start space-x-3.5 text-stone-400">
                    <MapPin size={18} className="shrink-0 mt-1 text-brand-orange stroke-[2]" />
                    <span className="text-sm font-medium leading-relaxed">{locationStr}</span>
                  </div>
                );
              })}
              {t.phones && t.phones.map((ph: string, idx: number) => (
                <a 
                  key={idx}
                  href={`tel:${ph.replace(/\s+/g, '')}`}
                  className="flex items-center space-x-3.5 hover:text-white transition-all group/link"
                >
                  <Phone size={18} className="shrink-0 text-brand-yellow group-hover/link:scale-110 transition-transform stroke-[2]" />
                  <span className="text-sm font-medium">{ph}</span>
                </a>
              ))}
              {t.emails && t.emails.map((em: string, idx: number) => (
                <a 
                  key={idx}
                  href={`mailto:${em}`}
                  className="flex items-center space-x-3.5 hover:text-white transition-all group/link"
                >
                  <Mail size={18} className="shrink-0 text-brand-teal group-hover/link:scale-110 transition-transform stroke-[2]" />
                  <span className="text-sm font-medium">{em}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-black uppercase text-xs tracking-widest text-stone-200 mb-6 pb-2 border-b border-white/10 inline-block">
              {t.links}
            </h3>
            <ul className="space-y-3.5">
              <li><Link to="/about" className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-transform">{nav.about}</Link></li>
              <li><Link to="/programs" className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-transform">{nav.programs}</Link></li>
              <li><Link to="/virtual-tour" className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-transform">{nav.virtualTour}</Link></li>
              <li><Link to="/enroll" className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-transform">{nav.enrollNow}</Link></li>
              <li><Link to="/contact" className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-transform">{nav.contact}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-black uppercase text-xs tracking-widest text-stone-200 mb-6 pb-2 border-b border-white/10 inline-block">
              {content.nav.parentResources || t.resources}
            </h3>
            <ul className="space-y-3.5">
              <li><button className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer">Parent Guidelines</button></li>
              <li><button className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer">Health Policy</button></li>
              <li><button className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer">Terms and Conditions</button></li>
              <li><button className="text-sm font-medium hover:text-white hover:translate-x-1 inline-block transition-all cursor-pointer">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display font-black uppercase text-xs tracking-widest text-stone-200 mb-6 pb-2 border-b border-white/10 inline-block">
              {content.nav.socialMedia || 'Social Media'}
            </h3>
            <div className="flex flex-wrap gap-3.5">
              {t.social.facebook && (
                <a href={t.social.facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white hover:border-brand-green hover:scale-110 active:scale-95 transition-all">
                  <Facebook size={18} />
                </a>
              )}
              {t.social.instagram && (
                <a href={t.social.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white hover:border-brand-green hover:scale-110 active:scale-95 transition-all">
                  <Instagram size={18} />
                </a>
              )}
              {t.social.youtube && (
                <a href={t.social.youtube} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white hover:border-brand-green hover:scale-110 active:scale-95 transition-all">
                  <Youtube size={18} />
                </a>
              )}
              {t.social.tiktok && (
                <a href={t.social.tiktok} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white hover:border-brand-green hover:scale-110 active:scale-95 transition-all">
                  <Music2 size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Full-width branch maps display - all locations displayed in the footer at the bottom */}
        {t.addresses && t.addresses.length > 0 && (
          <div className="border-t border-white/5 pt-12 pb-8 mt-10 flex flex-col items-center justify-center text-center">
            <h3 className="font-display font-black uppercase text-xs tracking-widest text-stone-200 mb-6 pb-2 border-b border-white/10 inline-block mx-auto">
              {lang === 'en' ? 'Our Campus Locations & Maps' : 'የካምፓስ አካባቢዎች እና ካርታዎች'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl justify-center text-left">
              {t.addresses.map((addr: any, idx: number) => {
                const locationStr = typeof addr === 'string' ? addr : addr.locationName;
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="shrink-0 mt-1 text-brand-orange stroke-[2]" />
                      <div>
                        <h4 className="text-white text-sm font-bold">{typeof addr === 'string' ? `Campus ${idx + 1}` : locationStr.split(',')[0]}</h4>
                        <p className="text-xs text-stone-400 mt-1">{locationStr}</p>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-white/10 h-48 w-full relative">
                      <iframe
                        title={`Kidtopia Map - ${idx}`}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(typeof addr === 'string' ? addr : (addr.googleMapsCoordinates || addr.locationName))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(typeof addr === 'string' ? addr : (addr.googleMapsCoordinates || addr.locationName))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-orange hover:underline font-bold"
                    >
                      Open in Google Maps <ExternalLink size={11} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col justify-center mb-6 md:mb-0">
            <div className="font-display font-black text-2.5xl tracking-tighter flex items-center">
              <span className="text-brand-orange">K</span>
              <span className="text-brand-yellow">I</span>
              <span className="text-brand-green">D</span>
              <span className="text-brand-teal">T</span>
              <span className="text-brand-tan">O</span>
              <span className="text-brand-orange">P</span>
              <span className="text-brand-yellow">I</span>
              <span className="text-brand-green">A</span>
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-brand-green"></span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-xs font-medium text-stone-500 mb-1">© 2026 Kidtopia International Daycare and Preschool. All rights reserved.</p>
            <a 
              href="https://arhotechnology.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => console.log('Arho Technology link clicked')}
              className="text-[10px] font-bold text-stone-600 hover:text-brand-orange transition-all cursor-pointer inline-block py-1 px-2 -mx-2"
            >
              Developed by Arho Technology
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

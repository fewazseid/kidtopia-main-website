import React from 'react';
import { Link } from 'react-router-dom';
import { Language, translations } from '../translations';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang].footer;
  const nav = translations[lang].nav;

  return (
    <footer id="footer" className="bg-stone-900 text-stone-400 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Contact */}
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-6">{t.contact}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="shrink-0 mt-1 text-brand-orange" />
                <span className="text-sm">{t.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="shrink-0 text-brand-yellow" />
                <span className="text-sm">{t.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="shrink-0 text-brand-teal" />
                <span className="text-sm">{t.email}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-6">{t.links}</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm hover:text-white transition-colors">{nav.about}</Link></li>
              <li><Link to="/programs" className="text-sm hover:text-white transition-colors">{nav.programs}</Link></li>
              <li><Link to="/virtual-tour" className="text-sm hover:text-white transition-colors">{nav.virtualTour}</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">{nav.enrollNow}</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">{nav.contact}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-6">{t.resources}</h3>
            <ul className="space-y-3">
              <li><button className="text-sm hover:text-white transition-colors">Parent Guidelines</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Health Policy</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Terms and Conditions</button></li>
              <li><button className="text-sm hover:text-white transition-colors">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-serif font-bold text-xl mb-6">{t.social}</h3>
            <div className="flex space-x-4">
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
                <Facebook size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
                <Instagram size={20} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all">
                <Youtube size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col justify-center mb-4 md:mb-0">
            <div className="font-sans font-bold text-2xl tracking-tighter flex">
              <span className="text-brand-orange">K</span>
              <span className="text-brand-yellow">I</span>
              <span className="text-brand-green">D</span>
              <span className="text-brand-teal">T</span>
              <span className="text-brand-tan">O</span>
              <span className="text-brand-orange">P</span>
              <span className="text-brand-yellow">I</span>
              <span className="text-brand-green">A</span>
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

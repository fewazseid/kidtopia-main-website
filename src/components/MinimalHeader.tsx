import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { Language } from '../translations';
import { useLanguageConfig } from '../ContentContext';

interface MinimalHeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
}

export const MinimalHeader: React.FC<MinimalHeaderProps> = ({ lang, setLang }) => {
  const navigate = useNavigate();
  const { languageConfig } = useLanguageConfig();
  const { isEnActive, isAmActive } = languageConfig;
  const showLanguageSwitcher = isEnActive && isAmActive;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/65 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-brand-green/5 rounded-full transition-colors text-brand-green cursor-pointer"
            title="Go Back to Main Website"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer flex flex-col justify-center"
          >
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
            <span className="text-[7px] sm:text-[8px] font-sans text-brand-green font-medium tracking-wide mt-[-4px] block">
              International Daycare and Preschool
            </span>
          </div>
        </div>

      {/* Single Floating Language Button Under Navigation Bar */}
      {showLanguageSwitcher && (
        <div className="fixed top-[84px] right-4 sm:right-8 z-40">
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-stone-800 font-black text-xs sm:text-sm cursor-pointer tracking-wider uppercase group"
            title={lang === 'en' ? 'Switch to አማርኛ' : 'Switch to English'}
          >
            <Globe size={15} className="text-brand-green group-hover:rotate-45 transition-transform duration-300" />
            <span>{lang === 'en' ? 'EN' : 'አማ'}</span>
          </button>
        </div>
      )}
      </div>
    </header>
  );
};

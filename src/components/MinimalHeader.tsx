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

        <div className="flex items-center gap-4">
          {/* Language Switcher Pill (EN | AM) - hidden if only 1 language exists */}
          {showLanguageSwitcher && (
            <div className="flex items-center p-0.5 rounded-xl bg-white/80 border border-stone-200 shadow-sm">
              {isEnActive && (
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-brand-green text-white shadow-sm scale-105'
                      : 'text-stone-700 hover:text-stone-900 opacity-75 hover:opacity-100'
                  }`}
                  title="English"
                >
                  EN
                </button>
              )}
              {isAmActive && (
                <button
                  type="button"
                  onClick={() => setLang('am')}
                  className={`px-2.5 py-1 text-xs font-black tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                    lang === 'am'
                      ? 'bg-brand-green text-white shadow-sm scale-105'
                      : 'text-stone-700 hover:text-stone-900 opacity-75 hover:opacity-100'
                  }`}
                  title="አማርኛ"
                >
                  አማ
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

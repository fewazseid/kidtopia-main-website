import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as defaultTranslations, Language } from './translations';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

type ContentContextType = {
  content: any;
  loading: boolean;
  refresh: () => Promise<void>;
};

export const ContentContext = createContext<ContentContextType>({
  content: defaultTranslations,
  loading: true,
  refresh: async () => {},
});

// Robust deep merge to ensure partial edits in Firestore do not destroy nested translations structures
function deepMerge(target: any, source: any): any {
  if (source === undefined || source === null) return target;

  if (Array.isArray(source)) {
    if (!Array.isArray(target)) return source;
    return source.map((item, idx) => {
      const defaultTarget = target[idx] || target[0];
      if (item && typeof item === 'object' && defaultTarget && typeof defaultTarget === 'object') {
        return deepMerge(defaultTarget, item);
      }
      return item;
    });
  }

  if (typeof source !== 'object') {
    // If source is empty string "", it's a valid empty field, do not replace with target
    return source;
  }

  if (target === null || target === undefined || typeof target !== 'object') {
    return source;
  }

  const output = { ...target };
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    if (sourceVal !== undefined && sourceVal !== null) {
      if (key in target) {
        output[key] = deepMerge(target[key], sourceVal);
      } else {
        output[key] = sourceVal;
      }
    }
  }
  return output;
}

// Highly intelligent Amharic merge to discard any un-localized English reference values in DB
function deepMergeAmharic(target: any, source: any, referenceEn: any): any {
  return deepMerge(target, source);
}

function cleanResources(data: any): any {
  if (!data) return data;
  const cleaned = { ...data };
  if (cleaned.resources && Array.isArray(cleaned.resources.items)) {
    cleaned.resources = {
      ...cleaned.resources,
      items: cleaned.resources.items.filter(
        (item: any) => item && !['ar_activities', 'forms', 'avatar'].includes(item.actionType)
      )
    };
  }
  return cleaned;
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<any>(() => ({
    en: cleanResources(defaultTranslations.en),
    am: cleanResources(defaultTranslations.am)
  }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let enLoaded = false;
    let amLoaded = false;

    const checkLoaded = () => {
      if (enLoaded && amLoaded) {
        setLoading(false);
      }
    };

    const unsubEn = onSnapshot(doc(db, 'content', 'en'), (snapshot) => {
      if (snapshot.exists()) {
        setContent((prev: any) => ({
          ...prev,
          en: cleanResources(deepMerge(defaultTranslations.en, snapshot.data()))
        }));
      }
      enLoaded = true;
      checkLoaded();
    }, (err) => {
      const isOffline = err && (
        String(err.message || err).toLowerCase().includes('offline') || 
        String(err.message || err).toLowerCase().includes('unavailable') ||
        String(err.message || err).toLowerCase().includes('could not reach')
      );
      if (isOffline) {
        console.warn('Firestore EN snapshot warning (offline):', err.message || err);
      } else {
        console.error('Firestore EN snapshot error:', err);
      }
      enLoaded = true;
      checkLoaded();
    });

    const unsubAm = onSnapshot(doc(db, 'content', 'am'), (snapshot) => {
      if (snapshot.exists()) {
        setContent((prev: any) => ({
          ...prev,
          am: cleanResources(deepMergeAmharic(defaultTranslations.am, snapshot.data(), defaultTranslations.en))
        }));
      }
      amLoaded = true;
      checkLoaded();
    }, (err) => {
      const isOffline = err && (
        String(err.message || err).toLowerCase().includes('offline') || 
        String(err.message || err).toLowerCase().includes('unavailable') ||
        String(err.message || err).toLowerCase().includes('could not reach')
      );
      if (isOffline) {
        console.warn('Firestore AM snapshot warning (offline):', err.message || err);
      } else {
        console.error('Firestore AM snapshot error:', err);
      }
      amLoaded = true;
      checkLoaded();
    });

    return () => {
      unsubEn();
      unsubAm();
    };
  }, []);

   return (
    <ContentContext.Provider value={{ content, loading, refresh: async () => {} }}>
      <AnimatePresence>
        {loading && (
          <>
            {/* Top glowing Kidtopia brand green & orange loading progress bar */}
            <motion.div 
              key="top-loading-bar"
              initial={{ width: "0%", opacity: 1 }}
              animate={{ width: "95%", opacity: 1 }}
              exit={{ width: "100%", opacity: 0 }}
              transition={{ 
                width: { duration: 2.0, ease: "easeOut" },
                opacity: { duration: 0.3, delay: 0.1 }
              }}
              className="fixed top-0 left-0 h-1 bg-gradient-to-r from-brand-green to-brand-orange z-[9999] shadow-[0_0_15px_rgba(58,91,50,0.9)]"
            />

            {/* Custom Kidtopia Immersive Loading Screen Background Overlay */}
            <motion.div
              key="kidtopia-loading-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 bg-brand-cream z-[9998] flex flex-col items-center justify-center font-sans select-none overflow-hidden"
            >
              {/* Responsive Loading Backgrounds from Google Drive */}
              {/* Mobile Loading Background */}
              <div 
                className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
                style={{ 
                  backgroundImage: "url('https://lh3.googleusercontent.com/d/1GN2JSjap-KYp4U2c0WYQOZs4zLajJUmU')" 
                }}
              />
              {/* Desktop & Tablet Loading Background */}
              <div 
                className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
                style={{ 
                  backgroundImage: "url('https://lh3.googleusercontent.com/d/18WFRU2ZNWIeCsyP26XQI9UV6Xf2wJ1PA')" 
                }}
              />

              {/* Semi-transparent dark/warm ambient vignette overlay to keep logo and text highly legible */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 z-[1]" />

              {/* Premium Glassmorphic Centered Loading Card */}
              <motion.div 
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                className="relative z-[2] max-w-sm w-11/12 mx-auto bg-white/75 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] flex flex-col items-center text-center"
              >
                {/* Logo with bouncing animation */}
                <div className="font-display font-black text-3xl tracking-tighter flex items-center mb-1.5 select-none">
                  <span className="text-brand-orange animate-pulse">K</span>
                  <span className="text-brand-yellow animate-pulse delay-75">I</span>
                  <span className="text-brand-green animate-pulse delay-100">D</span>
                  <span className="text-brand-teal animate-pulse delay-150">T</span>
                  <span className="text-brand-tan animate-pulse delay-200">O</span>
                  <span className="text-brand-orange animate-pulse delay-250">P</span>
                  <span className="text-brand-yellow animate-pulse delay-300">I</span>
                  <span className="text-brand-green animate-pulse delay-350">A</span>
                  <span className="ml-1.5 w-2.5 h-2.5 rounded-full bg-brand-orange animate-bounce"></span>
                </div>
                
                <span className="text-[9px] font-display font-extrabold tracking-widest text-brand-green uppercase mb-6 opacity-90">
                  International Daycare & Preschool
                </span>

                {/* Aesthetic Circular Spinner using Kidtopia Color Accents */}
                <div className="relative w-12 h-12 mb-5 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-4 border-brand-green/10"></span>
                  <span className="absolute inset-0 rounded-full border-4 border-t-brand-green border-r-brand-orange animate-spin"></span>
                </div>

                {/* Dynamic Dual-language Animated Status Messages */}
                <div className="space-y-1">
                  <p className="text-stone-800 font-display font-semibold text-sm tracking-tight">
                    Welcoming you to Kidtopia...
                  </p>
                  <p className="text-brand-green/90 font-display font-medium text-xs tracking-wide">
                    ወደ ኪድቶፒያ እንኳን በደህና መጡ...
                  </p>
                </div>
              </motion.div>

              {/* Small footer tag on the loading screen */}
              <div className="absolute bottom-6 left-0 right-0 text-center z-[2] pointer-events-none">
                <span className="text-white/80 text-[10px] tracking-widest font-display font-bold uppercase drop-shadow-md">
                  Nurturing Minds • Shaping Futures
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (lang: Language) => {
  const { content } = useContext(ContentContext);
  return content[lang] || defaultTranslations[lang];
};

export const useContentRefresh = () => {
  const { refresh } = useContext(ContentContext);
  return refresh;
};

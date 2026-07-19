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

  const letters = [
    { char: 'K', color: 'text-brand-orange' },
    { char: 'I', color: 'text-brand-yellow' },
    { char: 'D', color: 'text-brand-green' },
    { char: 'T', color: 'text-brand-teal' },
    { char: 'O', color: 'text-brand-tan' },
    { char: 'P', color: 'text-brand-orange' },
    { char: 'I', color: 'text-brand-yellow' },
    { char: 'A', color: 'text-brand-green' },
  ];

   return (
    <ContentContext.Provider value={{ content, loading, refresh: async () => {} }}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="simple-dot-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-brand-cream flex flex-col items-center justify-center font-sans z-[9999]"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex flex-col items-center select-none cursor-default">
                {/* Logo with playful bouncing/wave motion */}
                <div className="font-display font-black text-4xl sm:text-5xl tracking-tighter flex items-center justify-center mb-1">
                  {letters.map((letter, idx) => (
                    <motion.span
                      key={idx}
                      className={letter.color}
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: idx * 0.1,
                        ease: "easeInOut",
                      }}
                    >
                      {letter.char}
                    </motion.span>
                  ))}
                  <motion.span
                    className="ml-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-brand-orange animate-bounce"
                    animate={{
                      y: [0, -15, 0],
                      scale: [1, 1.25, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: letters.length * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <span className="text-[8px] sm:text-[10px] font-display font-bold tracking-[0.18em] text-brand-green uppercase opacity-90 text-center">
                  International Daycare & Preschool
                </span>
              </div>

              {/* Dot-dot-dot Loading indicator */}
              <div className="flex items-center gap-1 text-stone-500 font-semibold text-xs mt-6">
                <span>Loading</span>
                <span className="flex items-center gap-1.5 ml-1">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
                    className="w-2 h-2 rounded-full bg-brand-green"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                    className="w-2 h-2 rounded-full bg-brand-orange"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                    className="w-2 h-2 rounded-full bg-brand-yellow"
                  />
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
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

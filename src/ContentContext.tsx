import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as defaultTranslations, Language } from './translations';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

export type LanguageConfig = {
  defaultLanguage: 'en' | 'am';
  isEnActive: boolean;
  isAmActive: boolean;
};

type ContentContextType = {
  content: any;
  loading: boolean;
  refresh: () => Promise<void>;
  languageConfig: LanguageConfig;
  updateLanguageConfig: (config: LanguageConfig) => Promise<void>;
};

export const ContentContext = createContext<ContentContextType>({
  content: defaultTranslations,
  loading: true,
  refresh: async () => {},
  languageConfig: {
    defaultLanguage: 'en',
    isEnActive: true,
    isAmActive: true,
  },
  updateLanguageConfig: async () => {},
});

// Robust deep merge to ensure partial edits in Firestore do not destroy nested translations structures
function deepMerge(target: any, source: any): any {
  if (source === undefined || source === null) return target;

  if (Array.isArray(source)) {
    if (!Array.isArray(target)) return source;
    // If target array is longer than source array (e.g. new default items added in code), preserve target items
    if (target.length > source.length) {
      return target.map((targetItem, idx) => {
        const sourceItem = source[idx];
        if (sourceItem && typeof sourceItem === 'object' && targetItem && typeof targetItem === 'object') {
          return deepMerge(targetItem, sourceItem);
        }
        return sourceItem !== undefined && sourceItem !== null ? sourceItem : targetItem;
      });
    }
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

function isConfigKey(key: string, value: any, path: string[] = []): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'object') return false; // Objects and Arrays must be traversed, not treated as atomic config values
  if (typeof value === 'boolean' || typeof value === 'number') return true;

  const lowerKey = key.toLowerCase();
  const parentKey = path.length > 1 ? path[path.length - 2].toLowerCase() : '';
  const configKeys = [
    'backgroundtype', 'icon', 'logo', 'buttonlink', 'googlemapscoordinates',
    'image1', 'image2', 'rating', 'rate', 'image', 'video', 'heroimage', 'herovideo',
    'actiontype', 'link', 'step', 'id', 'enabled', 'phones', 'emails', 'developerurl', 'url', 'externalenrollmenturl'
  ];
  if (configKeys.includes(lowerKey) || configKeys.includes(parentKey)) return true;
  if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:') || value.startsWith('blob:'))) {
    return true;
  }
  return false;
}

function getNestedValue(obj: any, path: string[]): any {
  let current = obj;
  for (const part of path) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

function alignStructures(enVal: any, amVal: any, path: string[] = []): any {
  if (enVal === null || enVal === undefined) return amVal;

  // If enVal is an array
  if (Array.isArray(enVal)) {
    if (!Array.isArray(amVal)) {
      const defaultAm = getNestedValue(defaultTranslations.am, path);
      if (Array.isArray(defaultAm)) {
        return JSON.parse(JSON.stringify(defaultAm));
      }
      return JSON.parse(JSON.stringify(enVal));
    }

    const alignedAm: any[] = [];
    const pairedAmIndices = new Set<number>();

    for (let i = 0; i < enVal.length; i++) {
      const itemEn = enVal[i];
      let matchedAmIdx = -1;

      if (itemEn && typeof itemEn === 'object') {
        for (let j = 0; j < amVal.length; j++) {
          if (pairedAmIndices.has(j)) continue;
          const itemAm = amVal[j];
          if (!itemAm || typeof itemAm !== 'object') continue;

          // Try match strategies
          if (itemEn.actionType && itemAm.actionType && itemEn.actionType === itemAm.actionType) {
            matchedAmIdx = j;
            break;
          }
          if (itemEn.image && itemAm.image && itemEn.image === itemAm.image && itemEn.image !== '') {
            matchedAmIdx = j;
            break;
          }
          if (itemEn.url && itemAm.url && itemEn.url === itemAm.url && itemEn.url !== '') {
            matchedAmIdx = j;
            break;
          }
          if (itemEn.step && itemAm.step && itemEn.step === itemAm.step && itemEn.step !== '') {
            matchedAmIdx = j;
            break;
          }
          if (itemEn.time && itemAm.time && itemEn.time === itemAm.time && itemEn.time !== '') {
            matchedAmIdx = j;
            break;
          }
        }
      }

      // Fallback matching by index
      if (matchedAmIdx === -1 && i < amVal.length && !pairedAmIndices.has(i)) {
        matchedAmIdx = i;
      }

      const nextPath = [...path, i.toString()];
      if (matchedAmIdx !== -1) {
        alignedAm.push(alignStructures(itemEn, amVal[matchedAmIdx], nextPath));
        pairedAmIndices.add(matchedAmIdx);
      } else {
        const defaultAmItem = getNestedValue(defaultTranslations.am, nextPath);
        if (defaultAmItem !== undefined) {
          alignedAm.push(JSON.parse(JSON.stringify(defaultAmItem)));
        } else {
          alignedAm.push(JSON.parse(JSON.stringify(itemEn)));
        }
      }
    }

    return alignedAm;
  }

  // If enVal is an object (and not null/undefined)
  if (typeof enVal === 'object') {
    if (amVal === null || amVal === undefined || typeof amVal !== 'object' || Array.isArray(amVal)) {
      const defaultAm = getNestedValue(defaultTranslations.am, path);
      if (defaultAm && typeof defaultAm === 'object' && !Array.isArray(defaultAm)) {
        return JSON.parse(JSON.stringify(defaultAm));
      }
      return JSON.parse(JSON.stringify(enVal));
    }

    const resObj: any = {};
    for (const key of Object.keys(enVal)) {
      const nextPath = [...path, key];
      if (isConfigKey(key, enVal[key], nextPath)) {
        resObj[key] = JSON.parse(JSON.stringify(enVal[key]));
      } else {
        if (amVal[key] === undefined || amVal[key] === null) {
          const defaultAmField = getNestedValue(defaultTranslations.am, nextPath);
          if (defaultAmField !== undefined) {
            resObj[key] = JSON.parse(JSON.stringify(defaultAmField));
          } else {
            if (typeof enVal[key] === 'object' && enVal[key] !== null) {
              resObj[key] = alignStructures(enVal[key], undefined, nextPath);
            } else {
              resObj[key] = enVal[key];
            }
          }
        } else {
          resObj[key] = alignStructures(enVal[key], amVal[key], nextPath);
        }
      }
    }
    return resObj;
  }

  return amVal !== undefined && amVal !== null && amVal !== "" ? amVal : enVal;
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<any>(() => ({
    en: cleanResources(defaultTranslations.en),
    am: alignStructures(cleanResources(defaultTranslations.en), cleanResources(defaultTranslations.am))
  }));
  const [loading, setLoading] = useState(true);

  const [languageConfig, setLanguageConfig] = useState<LanguageConfig>({
    defaultLanguage: 'en',
    isEnActive: true,
    isAmActive: true,
  });

  useEffect(() => {
    const unsubLang = onSnapshot(doc(db, 'settings', 'language_config'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setLanguageConfig({
          defaultLanguage: data.defaultLanguage === 'am' ? 'am' : 'en',
          isEnActive: data.isEnActive !== false,
          isAmActive: data.isAmActive !== false,
        });
      }
    }, (err) => {
      console.warn("Firestore language config snapshot warning:", err);
    });

    return () => unsubLang();
  }, []);

  const updateLanguageConfig = async (newConfig: LanguageConfig) => {
    setLanguageConfig(newConfig);
    try {
      await setDoc(doc(db, 'settings', 'language_config'), newConfig);
    } catch (err) {
      console.error("Failed to update language config in Firestore:", err);
    }
  };

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
        const snapData = snapshot.data();
        const policies = snapData?.resources?.policiesAndRegulations;
        const chapters = snapData?.resources?.handbookChapters;
        if (!policies || policies.length < 10 || !chapters || chapters.length < 11) {
          setDoc(doc(db, 'content', 'en'), {
            ...snapData,
            resources: defaultTranslations.en.resources
          }, { merge: true }).catch(() => {});
        }
        setContent((prev: any) => {
          const enData = cleanResources(deepMerge(defaultTranslations.en, snapData));
          const amData = alignStructures(enData, prev.am);
          return { en: enData, am: amData };
        });
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
        const snapData = snapshot.data();
        const policies = snapData?.resources?.policiesAndRegulations;
        const chapters = snapData?.resources?.handbookChapters;
        if (!policies || policies.length < 10 || !chapters || chapters.length < 11) {
          setDoc(doc(db, 'content', 'am'), {
            ...snapData,
            resources: defaultTranslations.am.resources
          }, { merge: true }).catch(() => {});
        }
        setContent((prev: any) => {
          const amRaw = cleanResources(deepMergeAmharic(defaultTranslations.am, snapData, defaultTranslations.en));
          const amData = alignStructures(prev.en, amRaw);
          return { en: prev.en, am: amData };
        });
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
    <ContentContext.Provider value={{ content, loading, refresh: async () => {}, languageConfig, updateLanguageConfig }}>
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

export const useLanguageConfig = () => {
  const { languageConfig, updateLanguageConfig } = useContext(ContentContext);
  return { languageConfig, updateLanguageConfig };
};

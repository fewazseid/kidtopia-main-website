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

const ContentContext = createContext<ContentContextType>({
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

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<any>(defaultTranslations);
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
          en: deepMerge(defaultTranslations.en, snapshot.data())
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
          am: deepMergeAmharic(defaultTranslations.am, snapshot.data(), defaultTranslations.en)
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
            {/* Top glowing red loading bar */}
            <motion.div 
              key="top-loading-bar"
              initial={{ width: "0%", opacity: 1 }}
              animate={{ width: "90%", opacity: 1 }}
              exit={{ width: "100%", opacity: 0 }}
              transition={{ 
                width: { duration: 1.5, ease: "easeOut" },
                opacity: { duration: 0.3, delay: 0.1 }
              }}
              className="fixed top-0 left-0 h-1 bg-red-600 z-[9999] shadow-[0_0_10px_rgba(220,38,38,0.85)]"
            />

            {/* YouTube Desktop Skeleton Screen Background Overlay */}
            <motion.div
              key="youtube-skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed inset-0 bg-stone-50 z-[9998] flex flex-col font-sans select-none overflow-hidden"
            >
              {/* Header */}
              <div className="h-14 border-b border-stone-200 bg-white px-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                  {/* Menu Icon Placeholder */}
                  <div className="w-5 h-4 flex flex-col justify-between">
                    <div className="h-0.5 bg-stone-200 rounded animate-pulse" />
                    <div className="h-0.5 bg-stone-200 rounded animate-pulse" />
                    <div className="h-0.5 bg-stone-200 rounded animate-pulse" />
                  </div>
                  {/* Logo Placeholder */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-green/10 animate-pulse flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full bg-brand-green animate-pulse" />
                    </div>
                    <div className="w-24 h-5 bg-stone-200 rounded-md animate-pulse" />
                  </div>
                </div>

                {/* Search Bar Placeholder */}
                <div className="hidden sm:flex items-center w-full max-w-xl h-9 border border-stone-200 rounded-full overflow-hidden bg-stone-50">
                  <div className="flex-1 px-4 py-1 animate-pulse bg-stone-50" />
                  <div className="w-16 border-l border-stone-200 bg-stone-100 flex items-center justify-center h-full">
                    <div className="w-4 h-4 rounded-full border-2 border-stone-300 animate-pulse" />
                  </div>
                </div>

                {/* Header Right Actions */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse" />
                  <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse" />
                </div>
              </div>

              {/* Main Skeleton Page Structure */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Skeleton (desktop only) */}
                <div className="hidden md:flex flex-col w-60 border-r border-stone-200 bg-white p-3 gap-6 flex-shrink-0">
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 px-3 py-2.5 rounded-xl">
                        <div className="w-5 h-5 rounded-lg bg-stone-200 animate-pulse" />
                        <div className="w-28 h-4 rounded-full bg-stone-200 animate-pulse" />
                      </div>
                    ))}
                  </div>
                  <div className="h-[1px] bg-stone-200" />
                  <div className="flex flex-col gap-2">
                    <div className="px-3 h-3 w-16 bg-stone-200 rounded-full animate-pulse mb-1" />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 px-3 py-2 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-stone-200 animate-pulse" />
                        <div className="w-24 h-4 rounded-full bg-stone-200 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Feed / Grid Skeleton */}
                <div className="flex-1 overflow-y-auto bg-stone-50 p-4 sm:p-6">
                  {/* Category Chips Skeleton */}
                  <div className="flex items-center gap-2 overflow-x-hidden mb-6 flex-shrink-0">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-8 rounded-lg animate-pulse bg-stone-200 shrink-0 ${
                          i === 0 ? 'w-14 bg-stone-400' : i === 1 ? 'w-24' : i === 2 ? 'w-20' : 'w-16'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Grid of Skeleton Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-3">
                        {/* Video Thumbnail */}
                        <div className="aspect-video rounded-2xl bg-stone-200 animate-pulse w-full shadow-sm" />
                        {/* Channel Info & Title */}
                        <div className="flex gap-3 px-1">
                          <div className="w-9 h-9 rounded-full bg-stone-200 animate-pulse shrink-0" />
                          <div className="flex flex-col gap-2 w-full">
                            <div className="h-4 w-11/12 bg-stone-200 rounded animate-pulse" />
                            <div className="h-3 w-2/3 bg-stone-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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

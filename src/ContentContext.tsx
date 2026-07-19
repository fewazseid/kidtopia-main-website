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

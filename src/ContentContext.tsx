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
  if (!source) return target;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      // Guard against empty strings or falsy values from Firestore replacing valid translation values
      if ((source[key] === "" || source[key] === null || source[key] === undefined) && target[key]) {
        output[key] = target[key];
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
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
      console.error('Firestore EN snapshot error:', err);
      enLoaded = true;
      checkLoaded();
    });

    const unsubAm = onSnapshot(doc(db, 'content', 'am'), (snapshot) => {
      if (snapshot.exists()) {
        setContent((prev: any) => ({
          ...prev,
          am: deepMerge(defaultTranslations.am, snapshot.data())
        }));
      }
      amLoaded = true;
      checkLoaded();
    }, (err) => {
      console.error('Firestore AM snapshot error:', err);
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
          <motion.div 
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: "90%", opacity: 1 }}
            exit={{ width: "100%", opacity: 0 }}
            transition={{ 
              width: { duration: 1.2, ease: "easeOut" },
              opacity: { duration: 0.3, delay: 0.1 }
            }}
            className="fixed top-0 left-0 h-1 bg-red-600 z-[9999] shadow-[0_0_10px_rgba(220,38,38,0.85)]"
          />
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

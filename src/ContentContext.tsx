import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as defaultTranslations, Language } from './translations';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

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
          en: { ...defaultTranslations.en, ...snapshot.data() }
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
          am: { ...defaultTranslations.am, ...snapshot.data() }
        }));
      }
      amLoaded = true;
      checkLoaded();
    }, (err) => {
      console.error('Firestore AM snapshot error:', err);
      amLoaded = true;
      checkLoaded();
    });

    // Safety timeout to ensure we don't block render if network is slow
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      unsubEn();
      unsubAm();
      clearTimeout(timer);
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
  return content[lang];
};

export const useContentLoading = () => {
  const { loading } = useContext(ContentContext);
  return loading;
};

export const useContentRefresh = () => {
  const { refresh } = useContext(ContentContext);
  return refresh;
};

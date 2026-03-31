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
    const unsubEn = onSnapshot(doc(db, 'content', 'en'), (snapshot) => {
      if (snapshot.exists()) {
        setContent((prev: any) => ({
          ...prev,
          en: { ...defaultTranslations.en, ...snapshot.data() }
        }));
      }
    }, (err) => {
      console.error('Firestore EN snapshot error:', err);
    });

    const unsubAm = onSnapshot(doc(db, 'content', 'am'), (snapshot) => {
      if (snapshot.exists()) {
        setContent((prev: any) => ({
          ...prev,
          am: { ...defaultTranslations.am, ...snapshot.data() }
        }));
      }
    }, (err) => {
      console.error('Firestore AM snapshot error:', err);
    });

    setLoading(false);

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
  return content[lang];
};

export const useContentRefresh = () => {
  const { refresh } = useContext(ContentContext);
  return refresh;
};

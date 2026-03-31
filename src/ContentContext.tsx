import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as defaultTranslations, Language } from './translations';

type ContentContextType = {
  content: any;
  loading: boolean;
};

const ContentContext = createContext<ContentContextType>({
  content: defaultTranslations,
  loading: true,
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<any>(defaultTranslations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          // Merge with default translations to ensure all keys exist
          setContent({
            en: { ...defaultTranslations.en, ...data.en },
            am: { ...defaultTranslations.am, ...data.am }
          });
        }
      } catch (err) {
        console.error('Failed to fetch dynamic content', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (lang: Language) => {
  const { content } = useContext(ContentContext);
  return content[lang];
};

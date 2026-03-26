import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import vi, { type Translations } from '@/i18n/vi';
import en from '@/i18n/en';

type Lang = 'vi' | 'en';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const translations: Record<Lang, Translations> = { vi, en };

const LanguageContext = createContext<LanguageContextType>({
  lang: 'vi',
  setLang: () => {},
  t: vi,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('fpt-lang');
    return (saved === 'en' ? 'en' : 'vi') as Lang;
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('fpt-lang', newLang);
  }, []);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

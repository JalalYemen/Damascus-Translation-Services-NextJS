import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '../data/en';
import { ar } from '../data/ar';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: typeof en;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const dir = language === 'en' ? 'ltr' : 'rtl';
  const t = language === 'en' ? en : ar;

  useEffect(() => {
    // Update HTML attributes for accessibility and styling hooks
    document.documentElement.lang = language;
    document.documentElement.dir = dir;

    // Add/remove specific class for Arabic styling logic if needed (Bootstrap handles RTL automatically with dir="rtl")
    if (language === 'ar') {
      document.body.classList.add('lang-ar');
      document.body.style.fontFamily = "'Readex Pro', 'Cairo', sans-serif";
    } else {
      document.body.classList.remove('lang-ar');
      document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    }
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
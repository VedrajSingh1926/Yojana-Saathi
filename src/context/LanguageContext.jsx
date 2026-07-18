import React, { createContext, useState, useContext, useEffect } from 'react';
import translations from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('yojana_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('yojana_lang', lang);
  }, [lang]);

  const t = translations[lang] || translations.en;

  const gnaniLangMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN'
  };
  const gnaniLang = gnaniLangMap[lang] || 'en-IN';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, gnaniLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

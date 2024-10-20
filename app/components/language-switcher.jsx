'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

export const LanguageSwitcher = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  
  const changeLanguage = (lang) => {
    const currentPath = window.location.pathname;
    const supportedLangs = ['en', 'pt-br'];
    
    // Remove current language prefix from URL
    let pathWithoutLang = currentPath;
    supportedLangs.forEach((supportedLang) => {
      if (pathWithoutLang.startsWith(`/${supportedLang}`)) {
        pathWithoutLang = pathWithoutLang.replace(`/${supportedLang}`, '');
      }
    });
    
    // Construct new path with the selected language
    const newPath = `/${lang}${pathWithoutLang}`;
    
    router.push(newPath);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('pt-br')}>Português</button>
    </div>
  );
};

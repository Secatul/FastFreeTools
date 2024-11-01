import React from 'react';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center md:flex-row">
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
            {t('Support_Text')}{' '}
            <a href="https://www.patreon.com/c/Lcscostadev" className='underline decoration-2' target="_blank" rel="noopener noreferrer">
              {t('Support_Link')} 💖
            </a>{' '}
            &copy; {new Date().getFullYear()} {t('Copyright_Text')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

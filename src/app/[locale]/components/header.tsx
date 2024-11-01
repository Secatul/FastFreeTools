'use client';

import { useTranslations } from 'next-intl';

export const Header = () => {
  const t = useTranslations('Header');

  return (
    <div className='mx-auto flex max-w-screen-2xl flex-row items-center justify-center p-5'>
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('Header_Title')}
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400">
          ✨ {t('Header_Slogan')} ✨
        </h2>
      </header>
    </div>
  );
};

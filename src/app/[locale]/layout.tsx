'use client'

import React from 'react';
import { ThemeProvider } from '@/src/app/[locale]/components/ThemeProvider'
import { Inter, Rubik, Space_Grotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'
import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleTagManager } from '@next/third-parties/google'
import { NextIntlClientProvider } from 'next-intl'
import { store } from '../redux/store'
import Script from "next/script";
import Head from 'next/head'

const inter = Inter({
  subsets: ['latin'],
  variable: '--inter'
});
const rubik = Rubik({
  subsets: ['arabic'],
  variable: '--rubik'
});
const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

interface Params {
  locale: string;
}

export default async function RootLayout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<Params>; 
}) {
  const params = await paramsPromise; 

  let messages;
  try {
    messages = (await import(`../../../messages/${params.locale}.json`)).default;
  } catch (error) {
    console.error(`Erro ao carregar mensagens para o locale ${params.locale}`, error);
    messages = (await import('../../../messages/en.json')).default;
  }

  return (
    <html
      lang={params.locale} 
      dir={params.locale === 'ar' || params.locale === 'fa' ? 'rtl' : 'ltr'}
      className={`${space_grotesk.variable} ${rubik.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}></Script>
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
            `,
        }}
      />
      <body>
        <Provider store={store}>
          <ThemeProvider
            enableSystem
            attribute='class'
            defaultTheme='light'
            themes={[
              'light',
              'dark',
              'instagram',
              'facebook',
              'discord',
              'netflix',
              'twilight',
              'reddit'
            ]}
          >
            <NextIntlClientProvider locale={params.locale} messages={messages}>
              <NextTopLoader
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                easing='ease'
                speed={200}
                shadow='0 0 10px #2299DD,0 0 5px #2299DD'
                color='var(--primary)'
                showSpinner={false}
              />
              <main className='mx-auto'>{children}</main>
              <Toaster />
              <Analytics />
              <SpeedInsights />
              {process.env.NEXT_PUBLIC_GTM_ID && (
                <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
              )}
            </NextIntlClientProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}

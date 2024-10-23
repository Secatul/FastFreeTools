'use client'

import localFont from "next/font/local";
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/toaster";
import { Provider } from 'react-redux';
import { store } from '../store';
// import { LanguageSwitcher } from "./components/language-switcher";
import '../styles/globals.css';
// import '../i18n';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

function RootLayout({ children }) {
  return (
    <html lang="en"> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <ThemeProvider attribute="class">
            {children}
            {/* <LanguageSwitcher /> */}
            <Toaster />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;

import { ThemeProvider } from 'next-themes'
import { Toaster } from "@/components/ui/toaster"
import { appWithTranslation } from 'next-i18next';
// import { Header } from '@/app/components/ui/header';
import '../styles/globals.css';


function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
 
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  )
}

export default appWithTranslation(MyApp)
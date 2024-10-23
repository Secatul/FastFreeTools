import { ThemeProvider } from 'next-themes'
import { Toaster } from "@/components/ui/toaster"
import '../styles/globals.css';


function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
      <Toaster />
    </ThemeProvider>
  )
}

export default MyApp
import { GlobalContext } from 'api/globalContext';
import { Footer } from 'components/Footer';
import { Navbar } from 'components/Navbar';
import { GlobalStyle } from 'GlobalStyle';
import { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
  // We need common data and current language in multiple locations, so we
  // lift them up to a global context so we don't have to prop drill them
  // to random components
  const { commonData, language, translations } = pageProps;

  return (
    <GlobalContext.Provider value={{ commonData, language, translations }}>
      <GlobalStyle />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </GlobalContext.Provider>
  );
}

export default App;

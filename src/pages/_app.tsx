import { GlobalStyle } from 'GlobalStyle';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import { directus } from 'api';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && directus.auth.token === null) {
      const oldToken = localStorage.getItem('directus_access_token');
      if (oldToken) {
        directus.auth.token = oldToken;
        directus.auth.refresh(false);
      }
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}

export default App;

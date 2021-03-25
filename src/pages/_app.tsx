import { GlobalStyle } from 'GlobalStyle';
import { AppProps } from 'next/app';
import { AuthWrapper } from 'api/auth';

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthWrapper>
      <GlobalStyle />
      <Component {...pageProps} />
    </AuthWrapper>
  );
}

export default App;

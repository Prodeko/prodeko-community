import { GlobalStyle } from 'GlobalStyle';
import { AppProps as NextAppProps } from 'next/app';

import { init } from '../utils/sentry';

init();

type AppProps = {
  err: Error;
} & NextAppProps;

function App({ Component, pageProps, err }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} err={err} />
    </>
  );
}

export default App;

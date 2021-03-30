import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import { getPageBySlug } from 'api';

/**
 * We are using optimized variable fonts with only a subset of UTF-8
 * characters available, namely latin characters and most commonly
 * used special characters.
 *
 * Unfortunately defining fonts in a Styled Components global stylesheet
 * has some issues with dynamic styles changing in the DOM and causing fonts
 * to flicker while in development, so we need to define our fonts separately
 * from other global styles. The main downside with this approach is splitting
 * style definitions in two places, but it's not a tough price to pay.
 *
 * Specifying the fonts here also has the benefit of browsers being able to
 * start preloading them sooner, so the end user experience is marginally
 * better.
 *
 * Related issue:
 * https://github.com/styled-components/styled-components/issues/1593
 */
const fontStyles = `
@font-face {
  font-family: 'Raleway';
  src: url('/fonts/Raleway-Italic-VariableFont_wght-subset.woff2') format('woff2');
  font-weight: 1 999;
  font-style: italic;
  font-display: swap;
  unicode-range: U+20-7E, U+C4, U+C5, U+D6, U+E4, U+E5, U+F6;
}

@font-face {
  font-family: 'Raleway';
  src: url('/fonts/Raleway-VariableFont_wght-subset.woff2') format('woff2');
  font-weight: 1 999;
  font-style: normal;
  font-display: swap;
  unicode-range: U+20-7E, U+C4, U+C5, U+D6, U+E4, U+E5, U+F6;
}
`;

export default class MyDocument extends Document {
  /** We override default behavior to enable SSR Styled Components */
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      const pageProps = await getPageBySlug(ctx.query.slug as string[] | undefined);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
        lang: pageProps.language,
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang={((this.props as unknown) as { lang: string }).lang}>
        <Head>
          <link
            rel="preload"
            href="/fonts/Raleway-Italic-VariableFont_wght-subset.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Raleway-VariableFont_wght-subset.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

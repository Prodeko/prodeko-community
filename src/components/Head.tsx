import { useEffect } from 'react';
import NextHead from 'next/head';

import { PROD_URL } from 'api/config';
import { useGlobalContext } from 'api/globalContext';

type HeadProps = {
  title?: string;
  description?: string;
  image?: string;
};

export const Head: React.FC<HeadProps> = ({ title, description, image }) => {
  const { language, commonData } = useGlobalContext();

  const { site_title, site_tagline } = commonData.translations[language];

  // SSR can sometimes drop the language from the html-tag, so we ensure it exists
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // As we create proper urls for dynamic images when parsing them, we need to
  // re-parse the image into something that can be used by search engines in
  // meta tags
  const getImageUrl = (url: string) => {
    const urlBase = PROD_URL;
    const urlParts = url.split('/');
    const assetsIndex = urlParts.indexOf('assets');
    const assetParts = urlParts.slice(assetsIndex);
    const assetUrl = assetParts.join('/');
    return `${urlBase}/${assetUrl}`;
  };

  const fullTitle = title ? `${title} | ${site_title}` : site_title;
  const fullDescription = description ? description : site_tagline;

  return (
    <NextHead>
      <title key="title">{fullTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={fullDescription} />

      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <meta name="google" content="nositelinkssearchbox" />
      <meta name="google" content="notranslate" />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:locale" content={language} />
      <meta
        property="og:image"
        content={image ? getImageUrl(image) : getImageUrl(commonData.logo)}
      />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta
        property="twitter:image"
        content={image ? getImageUrl(image) : getImageUrl(commonData.logo)}
      />
    </NextHead>
  );
};

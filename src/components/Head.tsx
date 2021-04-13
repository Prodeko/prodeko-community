import { useGlobalContext } from 'api/globalContext';
import NextHead from 'next/head';
import { useEffect } from 'react';
import { getProductionAssetUrl } from 'utils/getProductionAssetUrl';

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

  const fullTitle = title ? `${title} | ${site_title}` : site_title;
  const fullDescription = description ? description : site_tagline;

  return (
    <NextHead>
      <title key="title">{fullTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={fullDescription} />
      <link rel="icon" type="image/png" href={getProductionAssetUrl(commonData.favicon)} />

      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <meta name="google" content="nositelinkssearchbox" />
      <meta name="google" content="notranslate" />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:locale" content={language} />
      <meta
        property="og:image"
        content={image ? getProductionAssetUrl(image) : getProductionAssetUrl(commonData.favicon)}
      />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta
        property="twitter:image"
        content={image ? getProductionAssetUrl(image) : getProductionAssetUrl(commonData.favicon)}
      />
    </NextHead>
  );
};

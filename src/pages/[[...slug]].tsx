import { getCommonData, getPageBySlug, getPaths } from 'api';
import { GlobalContext } from 'api/globalContext';
import { useAuth } from 'api/useAuth';
import { Head } from 'components/Head';
import { Navbar } from 'components/Navbar';
import { SkipLink } from 'components/SkipLink';
import { AnimatePresence, AnimateSharedLayout, domMax, LazyMotion } from 'framer-motion';
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useSWR from 'swr';
import {
  ArchivePageData,
  Article,
  FrontPageData,
  InfoPageData,
  LanguageCode,
  LANGUAGES,
} from 'types';
import { stripTags } from 'utils/stripTags';
import { truncateString } from 'utils/truncateString';

// Lazily load different page components for optimized js bundles
const FrontPage = dynamic<FrontPageData>(() => import('_pages/Front').then((mod) => mod.Front), {
  ssr: false,
});
const InfoPage = dynamic<InfoPageData>(() => import('_pages/Info').then((mod) => mod.Info), {
  ssr: false,
});
const ArchivePage = dynamic<ArchivePageData>(
  () => import('_pages/Archive').then((mod) => mod.Archive),
  {
    ssr: false,
  }
);
const ArticlePage = dynamic<{ article: Article }>(
  () => import('_pages/Article').then((mod) => mod.Article),
  {
    ssr: false,
  }
);

/**
 * This could be imagined as the "router" for this app. We use a root catch-all
 * Next.js route so that our CMS can control the slugs of the application
 */
export default function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data } = useSWR('commonData', getCommonData, { initialData: props.commonData });

  const { initializeAuth } = useAuth();
  useEffect(initializeAuth, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (props.template === 'notFound' || !props.template) {
    return <></>; // TODO: proper 404 page
  }

  const {
    language,
    routes,
    data: { translations },
  } = props;

  // Safe assertion as static prop data is always available as initial SWR data
  const commonData = data!;

  // Get the correct component to render with an immediately invoked function execution
  // Pick which meta tags to use as well
  /* eslint-disable react/jsx-key */
  const [pageMeta, pageComponent] = (() => {
    switch (props.template) {
      case 'front':
        return [<Head />, <FrontPage {...props.data} key="front" />];

      case 'info':
        return [
          <Head
            title={props.data.translations[language].page_title}
            description={truncateString(stripTags(props.data.translations[language].body))}
          />,
          <InfoPage {...props.data} key="info" />,
        ];

      case 'archive':
        return [
          <Head title={props.data.translations[language].page_title} />,
          <ArchivePage {...props.data} key="archive" />,
        ];

      case 'article':
        return [
          <Head
            title={props.data.translations[language].title}
            description={props.data.translations[language].tagline}
            image={props.data.photo}
          />,
          <ArticlePage article={props.data} key={`article-${props.data.id}`} />,
        ];
    }
  })();
  /* eslint-enable react/jsx-key */

  // Generate all links to same content in different language to be passed into global
  // context and used in `LanguageSwitcher`
  const alternativeSlugs = Object.fromEntries(
    LANGUAGES.map((lang) => {
      const slug = translations[lang].slug;
      if (props.template === 'article') {
        const linkPrefix = commonData.translations[lang][`${props.data.type}_slug` as const];
        return [lang, [linkPrefix, slug]];
      } else {
        return [lang, [slug]];
      }
    })
  ) as Record<LanguageCode, string[]>;

  // We need common data and current language in multiple locations, so we
  // lift them up to a global context so we don't have to prop drill them
  // to random components
  return (
    <GlobalContext.Provider value={{ commonData, language, alternativeSlugs, routes }}>
      <Toaster position="top-right" reverseOrder={false} />
      <LazyMotion features={domMax} strict>
        <SkipLink>{commonData.translations[language].skip_link_text}</SkipLink>
        <Navbar />
        {pageMeta}
        <AnimateSharedLayout>
          <AnimatePresence exitBeforeEnter>{pageComponent}</AnimatePresence>
        </AnimateSharedLayout>
      </LazyMotion>
    </GlobalContext.Provider>
  );
}

/** Fetch the correct props for our current page */
export const getStaticProps = async (context: GetStaticPropsContext<ParsedUrlQuery>) => {
  const pageProps = await getPageBySlug(context.params?.slug as string[] | undefined);
  return { props: pageProps, revalidate: 1 };
};

/** Next.js uses this function to know which paths to statically prerender */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getPaths();
  return { paths, fallback: true };
};

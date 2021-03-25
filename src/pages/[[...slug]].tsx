import { getPageBySlug, getPaths } from 'api';
import {
  FrontPageData,
  ArchivePageData,
  InfoPageData,
  Article,
  LANGUAGES,
  LanguageCode,
} from 'types';
import { GetStaticPropsContext, InferGetStaticPropsType, GetStaticPaths } from 'next';
import dynamic from 'next/dynamic';
import { ParsedUrlQuery } from 'querystring';
import { GlobalContext } from 'api/globalContext';
import { Footer } from 'components/Footer';
import { Navbar } from 'components/Navbar';

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
  if (props.template === 'notFound' || !props.template) {
    return <></>; // TODO: proper 404 page
  }

  const {
    commonData,
    language,
    routes,
    data: { translations },
  } = props;

  // Get the correct component to render with an immediately invoked function execution
  const pageComponent = (() => {
    switch (props.template) {
      case 'front':
        return <FrontPage {...props.data} />;

      case 'info':
        return <InfoPage {...props.data} />;

      case 'archive':
        return <ArchivePage {...props.data} />;

      case 'article':
        return <ArticlePage article={props.data} />;
    }
  })();

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
      <Navbar />
      {pageComponent}
      <Footer />
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

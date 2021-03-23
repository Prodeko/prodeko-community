import { getPageBySlug, getPaths } from 'api';
import { InfoPageData, FrontPageData } from 'types';
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
    data: { translations },
  } = props;

  const pageComponent = (() => {
    switch (props.template) {
      case 'front':
        return <FrontPage {...props.data} />;
    }
  })();

  // We need common data and current language in multiple locations, so we
  // lift them up to a global context so we don't have to prop drill them
  // to random components
  return (
    <GlobalContext.Provider value={{ commonData, language, translations }}>
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

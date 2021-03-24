import DirectusSDK from '@directus/sdk-js';

import { API_URL } from 'api/config';
import {
  parseArchivePageData,
  parseArticles,
  parseCommonData,
  parseFrontPageData,
  parseInfoPageData,
} from 'api/parsers';
import { LANGUAGES, PageData, PageRoutes } from 'types';

export let directus = new DirectusSDK(API_URL as string);

if (typeof window !== 'undefined') {
  const asyncLocalStorage = {
    setItem: async function (key: string, value: any) {
      await null;
      return localStorage.setItem(key, value);
    },
    getItem: async function (key: string) {
      await null;
      return localStorage.getItem(key);
    },
    removeItem: async function (key: string) {
      await null;
      return localStorage.removeItem(key);
    },
  };

  directus = new DirectusSDK(API_URL as string, {
    auth: { storage: asyncLocalStorage, mode: 'json' },
  });
}

/**
 * Called when returning from custom authentication endpoint with a refresh
 * token which we can use to gain a proper access token for the current user
 */
export const authenticate = async (refreshToken: string) => {
  const res = await directus.axios.post(`${API_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });
  const { access_token, expires, refresh_token } = res.data.data;
  directus.auth.token = access_token;
  localStorage.setItem('directus_access_token_expires', expires);
  localStorage.setItem('directus_refresh_token', refresh_token);
  directus.auth.refresh(false);
};

/**
 * Directus SDK can accept objects instead of query params.
 *
 * `fields` specifies an array of fields to be fetched from the API,
 */
type Query = {
  fields: string[];
  single?: boolean;
};

function createDataFetcher<T>(collection: string, query: Query, parse: (data: any) => T) {
  return async () => {
    const { data } = await directus.items(collection).read(query);
    const parsedData = parse(data);
    return parsedData;
  };
}

const commonDataQuery = {
  fields: ['*', 'translations.*'], // Fetch all fields and all relational translation data
  single: true, // Data modeled as a 'singleton' in Directus
};

export const getCommonData = createDataFetcher('common_data', commonDataQuery, parseCommonData);

const frontPageQuery = {
  ...commonDataQuery,
  fields: [
    ...commonDataQuery.fields,
    'highlighted_articles.*',
    'highlighted_articles.translations.*',
    'highlighted_articles.author.*',
    'highlighted_articles.author.translations.*',
  ],
};

export const getFrontPageData = createDataFetcher('front_page', frontPageQuery, parseFrontPageData);

export const getInfoPageData = createDataFetcher('info_page', commonDataQuery, parseInfoPageData);

// Archive page needs to list all available articles but that data isn't linked
// in the CMS, so we need to combine data fetchers to achieve the desired result
const articlesQuery = {
  fields: ['*', 'translations.*', 'author.*', 'author.translations.*'],
};
const getArticles = createDataFetcher('articles', articlesQuery, parseArticles);
const getArchivePage = createDataFetcher('archive_page', commonDataQuery, parseArchivePageData);
const getArchivePageData = async () => {
  const [articles, archivePageData] = await Promise.all([getArticles(), getArchivePage()]);
  return { ...archivePageData, articles };
};

/** Page order defined here also reflects on the navbar */
const getAllPages = async () =>
  Promise.all([getFrontPageData(), getArchivePageData(), getInfoPageData()]);

/**
 * As we want to be able to define page slugs via Directus, we need to be able
 * to fetch page data based on the slug in our main page component. Here we
 * also provide contents for the global context.
 */
export const getPageBySlug = async (slug: string[] | undefined): Promise<PageData> => {
  const [pages, articles, commonData] = await Promise.all([
    getAllPages(),
    getArticles(),
    getCommonData(),
  ]);

  // Map all pages' slugs to arrays to be accessed in site navigation
  const routes = pages.reduce((acc, curr) => {
    LANGUAGES.forEach((lang) => {
      const newRoute = {
        title: curr.translations[lang].navigation_title,
        slug: curr.translations[lang].slug || '',
      };
      if (Array.isArray(acc[lang])) {
        acc[lang] = [...acc[lang], newRoute];
      } else {
        acc[lang] = [newRoute];
      }
    });
    return acc;
  }, {} as PageRoutes);

  if (slug === undefined) {
    // nextjs default query for front page
    return {
      template: 'front',
      data: pages[0],
      language: 'fi',
      commonData,
      routes,
    };
  }

  // Iterate over each page's data and their translations to try and match the
  // query to a page so we can determine what to render
  if (slug.length === 1) {
    for (let i = 0; i < pages.length; i++) {
      const pageData = pages[i];
      for (let j = 0; j < LANGUAGES.length; j++) {
        const lang = LANGUAGES[j];
        const pageSlug = pageData.translations[lang].slug;
        if (slug[0] === pageSlug) {
          return {
            template: pageData.template,
            data: pageData as any,
            language: lang,
            commonData,
            routes,
          };
        }
      }
    }
  }

  // We currently have no routes with two-parts-slug other than individual articles,
  // so we can just match the second part to know which article to render.
  if (slug.length === 2) {
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      for (let j = 0; j < LANGUAGES.length; j++) {
        const lang = LANGUAGES[j];
        const articleSlug = article.translations[lang].slug;
        if (slug[1] === articleSlug) {
          return {
            template: 'article',
            data: article,
            language: lang,
            commonData,
            routes,
          };
        }
      }
    }
  }

  return {
    template: 'notFound',
    language: 'fi',
    commonData,
    routes,
  };
};

/**
 * Output all website paths for static rendering to be consumed by Next.js
 * `getStaticPaths`
 */
export const getPaths = async () => {
  const pages = await getAllPages();
  return pages.flatMap((page) => {
    return LANGUAGES.flatMap((lang) => ({
      params: {
        slug: page.translations[lang].slug?.split('/').filter((x) => x !== ''),
      },
    }));
  });
};

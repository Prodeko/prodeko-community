import DirectusSDK from '@directus/sdk-js';
import { asyncLocalStorage } from 'api/asyncLocalStorage';
import { API_URL } from 'api/config';
import {
  parseArchivePageData,
  parseArticle,
  parseArticles,
  parseCommonData,
  parseFrontPageData,
  parseInfoPageData,
  parseUser,
} from 'api/parsers';
import {
  AuthenticationResponse,
  CommentFormData,
  LANGUAGES,
  LikeFormData,
  PageData,
  PageRoutes,
} from 'types';

export let directus = new DirectusSDK(API_URL as string);

// If we are in browser, swap build time default directus instance with one
// that is capable of storing authentication state
if (typeof window !== 'undefined') {
  directus = new DirectusSDK(API_URL as string, {
    auth: { storage: asyncLocalStorage, mode: 'json', autoRefresh: true },
  });
}

/**
 * Fetches new authetication data based on current refresh token
 */
export const getAccessToken = async (refreshToken: string) => {
  const { data } = await directus.axios.post(`${API_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  });
  return data.data as AuthenticationResponse;
};

/**
 *  Get currently authenticated user data
 */
export const getMe = async () => {
  const { data } = await directus.users.me.read();
  const parsedUser = parseUser(data);
  return parsedUser;
};

/** Requires an authenticated user to call, otherwise will fail */
export const createComment = async (data: CommentFormData) => {
  return directus.items('comments').create(data);
};

/** Requires an authenticated user to call, otherwise will fail */
export const likeArticle = async (data: LikeFormData) => {
  return directus.items('rainbow_likes').create(data);
};

/** Allows users to unlike an article they've previously liked */
export const unlikeArticle = async (likeId: number) => {
  return directus.items('rainbow_likes').delete(likeId);
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

/**
 * Generic fetcher 'factory' we can use to keep the API code a bit more DRY
 */
function createDataFetcher<T>(collection: string, query: Query, parse: (data: unknown) => T) {
  return async () => {
    const { data } = await directus.items(collection).read(query);
    return parse(data);
  };
}

const commonDataQuery = {
  fields: ['*', 'translations.*'], // Fetch all fields and all relational translation data
  single: true, // Data modeled as a 'singleton' in Directus
};

export const getCommonData = createDataFetcher('common_data', commonDataQuery, parseCommonData);

// Archive page needs to list all available articles but that data isn't linked
// in the CMS, so we need to combine data fetchers to achieve the desired result
const articlesQuery = {
  fields: [
    '*',
    'translations.*',
    'author.*',
    'author.translations.*',
    'comments.*',
    'comments.user_created.*',
    'comments.subcomments.*',
    'comments.subcomments.user_created.*',
    'liked_by.*',
  ],
};
const getArticles = createDataFetcher('articles', articlesQuery, parseArticles);

export const getArticleFetcher = (id: number) => async () => {
  const { data } = await directus.items('articles').read(id, articlesQuery);
  return parseArticle(data);
};

const frontPageQuery = {
  ...commonDataQuery,
  fields: [
    ...commonDataQuery.fields,
    ...articlesQuery.fields.map((field) => `highlighted_articles.${field}`),
  ],
};

export const getFrontPageData = createDataFetcher('front_page', frontPageQuery, parseFrontPageData);

export const getInfoPageData = createDataFetcher('info_page', commonDataQuery, parseInfoPageData);

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
            data: pageData as any, // eslint-disable-line @typescript-eslint/no-explicit-any
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
